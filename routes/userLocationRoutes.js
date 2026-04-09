import { Router } from "express";
const router = Router();

// ✅ correct import (named)
import { saveLocation, getLocation, getAllLocations, updateLocation, deleteLocation } from "../controllers/userLocationController.js";

// Save or update user location
router.post("/", saveLocation);

// Static path before ":customerId" (Express 5 / catch-all param)
router.get("/", getAllLocations);
router.get("/:customerId", getLocation);
router.put("/:customerId", updateLocation);
router.delete("/:customerId", deleteLocation);

export default router;