import { saveUserLocationService, getUserLocationService, getAllUserLocationsService, updateUserLocationService,deleteUserLocationService } from "../services/userLocationService.js";

// Save location
export const saveLocation = async (req, res) => {
  try {
    const data = req.body[0];

    // minimal check only
    if (!data.customerId || !data.savedLocations) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const result = await saveUserLocationService({
      customerId: Number(data.customerId),
      savedLocations: data.savedLocations, // 👈 frontend controls structure
    });

    res.status(201).json({
      message: "Location saved",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get location
export const getLocation = async (req, res) => {
  try {
  
const customerId = Number(req.params.customerId);

    const location = await getUserLocationService(customerId);

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// GET ALL
export const getAllLocations = async (req, res) => {
  const data = await getAllUserLocationsService();
  res.json(data);
};

// UPDATE
export const updateLocation = async (req, res) => {
  try {
    const customerId = Number(req.params.customerId); // ✅ FIX

    const result = await updateUserLocationService(customerId, req.body);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
export const deleteLocation = async (req, res) => {
  try {
    const customerId = Number(req.params.customerId); // ✅ IMPORTANT

    const result = await deleteUserLocationService(customerId);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};