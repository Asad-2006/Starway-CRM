import Event from "../Models/EventModel.js";

// Create  event
export const createEvent = async (req, res) => {
  const { title, start, end } = req.body;
  const userId = req.user.id;

  try {
    const newEvent = new Event({
      title,
      start,
      end,
      user: userId,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error in createEvent:", error);
    res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
};

// getting all the events fron here
export const getEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const events = await Event.find({ user: userId });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, start, end } = req.body;
  const userId = req.user._id;

  try {
    const event = await Event.findOne({ _id: id, user: userId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = title;
    event.start = start;
    event.end = end;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  console.log("Deleting event ID:", id, "for user ID:", userId);

  try {
    const event = await Event.findOne({ _id: id, user: userId });
    if (!event) {
      console.log("Event not found or does not belong to the user");
      return res.status(404).json({ message: "Event not found" });
    }
    await event.deleteOne();

    console.log("Event deleted successfully");
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};
