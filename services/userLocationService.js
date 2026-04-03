import { getDB } from "../config/db.js";
import userLocationModel from "../models/userLocation.js";

const { collectionName } = userLocationModel;

// Save (insert OR update)
export const saveUserLocationService = async (data) => {
  const db = getDB();

  return await db.collection(collectionName).updateOne(
    { customerId: data.customerId },
    {
     $push: {
  savedLocations: {
    $each: data.savedLocations
  }
}
    },
    { upsert: true }
  );
};

// Get location
export const getUserLocationService = async (customerId) => {
  const db = getDB();
  return await db.collection(collectionName).findOne({ customerId });
};

//  GET ALL USERS' LOCATIONS
export const getAllUserLocationsService = async () => {
  const db = getDB();

  return await db.collection(collectionName).find({}).toArray();
};
//  UPDATE USER LOCATION (WITHOUT UPSERT)
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
    updateFields.savedLocations = data.savedLocations;
  }

  // 🔹 perform update (no $push, no upsert)
  const result = await db.collection(collectionName).updateOne(
    { customerId },
    { $set: updateFields }
  );

  return result;
};
//  DELETE USER LOCATION
export const deleteUserLocationService = async (customerId) => {
  const db = getDB();

  return await db.collection(collectionName).deleteOne({ customerId });
};