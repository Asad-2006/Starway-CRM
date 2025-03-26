import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus } from "lucide-react";
import "../../../Frontend/src/index.css";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    start: "",
    end: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/events`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const events = await response.json();
          const mappedEvents = events.map((event) => ({
            ...event,
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
          }));
          setEvents(mappedEvents);
        } else {
          console.error("Failed to fetch events. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = async (arg) => {
    setShowModal(true);
    setNewEvent({
      title: "",
      start: arg.dateStr,
      end: arg.dateStr,
    });
    setErrors({
      title: "",
      start: "",
      end: "",
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", start: "", end: "" };

    if (!newEvent.title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }

    if (!newEvent.start) {
      newErrors.start = "Start date is required";
      valid = false;
    }

    if (!newEvent.end) {
      newErrors.end = "End date is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const event = {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
      };

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE}/api/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(event),
        });

        if (response.ok) {
          const savedEvent = await response.json();
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              ...savedEvent,
              id: savedEvent._id,
            },
          ]);
          setShowModal(false);
        } else {
          console.error("Failed to create event. Status:", response.status);
        }
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!eventId) {
        console.error("Event ID is missing");
        return;
      }

      const response = await fetch(`${API_BASE}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Event deleted successfully");
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        setShowEventModal(false);
      } else {
        console.error("Failed to delete event. Status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowEventModal(true);
  };

  const eventContent = (eventInfo) => {
    return (
      <div className="event-item">
        <span className="text-blue-500 text-sm">
          <FiberManualRecordIcon />
        </span>
        <span>{eventInfo.event.title}</span>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={eventContent}
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-md">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create New Event
            </h3>
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Title:
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.title ? "border-red-500" : ""
                  }`}
                  onChange={handleInputChange}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs italic">{errors.title}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="start"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Start Date:
                </label>
                <input
                  type="date"
                  name="start"
                  id="start"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.start ? "border-red-500" : ""
                  }`}
                  onChange={handleInputChange}
                  value={newEvent.start}
                />
                {errors.start && (
                  <p className="text-red-500 text-xs italic">{errors.start}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  End Date:
                </label>
                <input
                  type="date"
                  name="end"
                  id="end"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.end ? "border-red-500" : ""
                  }`}
                  onChange={handleInputChange}
                  value={newEvent.end}
                />
                {errors.end && (
                  <p className="text-red-500 text-xs italic">{errors.end}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Create Event
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-backdrop-blur bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-md">
          <div className="relative top-50 mx-auto p-5 border w-[600px] h-[300px] shadow-lg rounded-md bg-white">
            <h3 className="text-xl mb-6 font-medium leading-6 text-gray-900">
              Event Details
            </h3>
            <div className="mt-2">
              <p className="mb-2 text-lg">
                {" "}
                <strong>Title : </strong>
                {selectedEvent.title}
              </p>
              <p className="mb-2 text-lg">
                <strong>Start Date : </strong>
                {new Date(selectedEvent.start).toLocaleDateString()}
              </p>
              <p className="mb-4 text-lg ">
                <strong> End Date : </strong>{" "}
                {new Date(selectedEvent.end).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => handleDeleteEvent(selectedEvent.id)}
              >
                Delete Event
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setShowEventModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        onClick={() => setShowModal(true)}
      >
        <Plus className="inline-block mr-2" size={20} />
        Create New Event
      </button>
    </div>
  );
};

export default Calendar;
