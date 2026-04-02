import { Router } from "express";
const router = Router();

// ✅ correct import (named)
import { saveLocation, getLocation, getAllLocations, updateLocation, deleteLocation } from "../controllers/userLocationController.js";

// Save or update user location
router.post("/save", saveLocation);

// Get user location by userId
router.get("/:customerId", getLocation);
router.get("/", getAllLocations);
router.put("/:customerId", updateLocation);
router.delete("/:customerId", deleteLocation);

export default router;