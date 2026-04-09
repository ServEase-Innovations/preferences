import { saveUserLocationService, getUserLocationService, getAllUserLocationsService, updateUserLocationService,deleteUserLocationService } from "../services/userLocationService.js";

// Save location
export const saveLocation = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body[0] : req.body;

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
  
    const location = await getUserLocationService(req.params.customerId);

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const saved = location.savedLocations;
    res.json([
      {
        _id: String(location._id),
        customerId: location.customerId,
        savedLocations: Array.isArray(saved) ? saved : [],
      },
    ]);
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
    const result = await updateUserLocationService(
      req.params.customerId,
      req.body
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
export const deleteLocation = async (req, res) => {
  try {
    const result = await deleteUserLocationService(req.params.customerId);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};