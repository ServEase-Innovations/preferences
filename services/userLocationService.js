import { Int32 } from "mongodb";
import { getDB } from "../config/db.js";
import userLocationModel from "../models/userLocation.js";

const { collectionName } = userLocationModel;

function toEpochSeconds(value) {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
}

function normalizeSavedLocationEntry(entry = {}) {
  if (!entry || typeof entry !== "object") return entry;
  const out = { ...entry };
  if (out.createdAt_epoch == null) {
    out.createdAt_epoch = toEpochSeconds(out.createdAt);
  }
  if (out.updatedAt_epoch == null) {
    out.updatedAt_epoch = toEpochSeconds(out.updatedAt);
  }
  return out;
}

function withEpochMirrors(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const out = { ...doc };
  out.createdAt_epoch = toEpochSeconds(out.createdAt);
  out.updatedAt_epoch = toEpochSeconds(out.updatedAt);
  if (Array.isArray(out.savedLocations)) {
    out.savedLocations = out.savedLocations.map(normalizeSavedLocationEntry);
  }
  return out;
}

/**
 * Matches documents whether customerId was stored as number, string, or BSON Int32
 * (Compass often shows Int32; plain JS queries can still miss without explicit variants).
 */
function buildCustomerIdFilter(customerIdParam) {
  if (customerIdParam == null) return null;
  const raw = String(customerIdParam).trim();
  if (!raw) return null;
  const num = Number(raw);
  if (Number.isFinite(num) && !Number.isNaN(num)) {
    return {
      customerId: {
        $in: [num, raw, new Int32(num)],
      },
    };
  }
  return { customerId: raw };
}

// Save (insert OR update)
export const saveUserLocationService = async (data) => {
  const db = getDB();
  const filter = buildCustomerIdFilter(data.customerId);
  if (!filter) {
    throw new Error("Invalid customerId");
  }

  const coll = db.collection(collectionName);
  const existing = await coll.findOne(filter);
  if (existing) {
    return await coll.updateOne(
      { _id: existing._id },
      {
        $push: {
          savedLocations: {
            $each: data.savedLocations,
          },
        },
      }
    );
  }

  return await coll.insertOne({
    customerId: Number(data.customerId),
    savedLocations: data.savedLocations,
  });
};

// Get location
export const getUserLocationService = async (customerIdParam) => {
  const db = getDB();
  const filter = buildCustomerIdFilter(customerIdParam);
  if (!filter) return null;
  const doc = await db.collection(collectionName).findOne(filter);
  return withEpochMirrors(doc);
};

//  GET ALL USERS' LOCATIONS
export const getAllUserLocationsService = async () => {
  const db = getDB();
  const docs = await db.collection(collectionName).find({}).toArray();
  return docs.map(withEpochMirrors);
};
//  UPDATE USER LOCATION (WITHOUT UPSERT) — customerId may be path string e.g. "118"
export const updateUserLocationService = async (customerId, data) => {
  const db = getDB();

  // 🔹 prepare $set object
  const updateFields = { updatedAt: new Date() };

  // normal fields (if provided)
  if (data.customerId) {
    updateFields.customerId = Number(data.customerId);
  }

  // 🔹 savedLocations handled directly — frontend sends full array object
  if (data.savedLocations) {
    updateFields.savedLocations = Array.isArray(data.savedLocations)
      ? data.savedLocations.map(normalizeSavedLocationEntry)
      : data.savedLocations;
  }

  const filter = buildCustomerIdFilter(customerId);
  if (!filter) {
    return { matchedCount: 0, modifiedCount: 0, acknowledged: true };
  }

  // 🔹 perform update (no $push, no upsert)
  const result = await db.collection(collectionName).updateOne(filter, {
    $set: updateFields,
  });

  return result;
};
//  DELETE USER LOCATION
export const deleteUserLocationService = async (customerId) => {
  const db = getDB();
  const filter = buildCustomerIdFilter(customerId);
  if (!filter) {
    return { deletedCount: 0, acknowledged: true };
  }
  return await db.collection(collectionName).deleteOne(filter);
};