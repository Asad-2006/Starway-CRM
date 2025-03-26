import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus } from "lucide-react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
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
  const [openEventModal, setOpenEventModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    setOpenModal(true);
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
          setOpenModal(false);
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
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        setOpenEventModal(false);
      } else {
        console.error("Failed to delete event. Status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setOpenEventModal(true);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: isMobile ? 1 : 0 }}>
          Calendar
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setOpenModal(true)}
          sx={{
            width: isMobile ? "100%" : "auto",
            mb: isMobile ? 1 : 0,
            bgcolor: "#2636ee",
            "&:hover": {
              bgcolor: "#212ec5",
            },
          }}
        >
          Create New Event
        </Button>
      </Box>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={isMobile ? "dayGridMonth" : "dayGridMonth"}
        weekends
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={eventContent}
        height={isMobile ? "auto" : "auto"}
      />

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              margin="dense"
              id="start"
              name="start"
              label="Start Date"
              type="date"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
              value={newEvent.start}
              error={!!errors.start}
              helperText={errors.start}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              id="end"
              name="end"
              label="End Date"
              type="date"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
              value={newEvent.end}
              error={!!errors.end}
              helperText={errors.end}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create Event
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEventModal} onClose={() => setOpenEventModal(false)}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <div>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>Title:</strong> {selectedEvent.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedEvent.start).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <strong>End Date:</strong>{" "}
                {new Date(selectedEvent.end).toLocaleDateString()}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeleteEvent(selectedEvent?.id)}
            color="error"
          >
            Delete Event
          </Button>
          <Button onClick={() => setOpenEventModal(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Calendar;
