import ServiceType from "../Models/ServiceTypeModel.js";

export const createServiceType = async (req, res) => {
  try {
    const { name } = req.body;
    const newServiceType = new ServiceType({ name });
    const savedServiceType = await newServiceType.save();
    res.status(201).json(savedServiceType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find();
    res.status(200).json(serviceTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteServiceType = async (req, res) => {
  try {
    const { name } = req.params;
    await ServiceType.findOneAndDelete({ name });
    res.status(200).json({ message: "Service type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
