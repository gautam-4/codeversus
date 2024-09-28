"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EventCard = ({ event }) => {
  return (
    <div className="bg-[#222222] text-[#DEA03C] rounded-lg p-4 shadow-md w-full max-w-md mx-auto mt-5">
      <h3 className="text-xl font-bold">{event.contestName}</h3>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Duration:</strong> {event.duration}</p>
      <p><strong>Platform:</strong> {event.platform}</p>
      <a href={event.link} target="_blank" className="text-blue-500 underline">View Contest</a>
    </div>
  );
};

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    id: "",
    title: "",
    start: new Date(),
    end: new Date(),
    contestName: "",
    time: "",
    date: "",
    duration: "",
    link: "",
    platform: "",
  });
  const calendarRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected) => {
    setNewEvent({
      ...newEvent,
      id: `${selected.startStr}-${Date.now()}`,
      start: selected.start,
      end: selected.end,
      date: formatDate(selected.start, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    });
  };

  const handleEventClick = (selected) => {
    const event = selected.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      contestName: event.extendedProps.contestName || "",
      time: event.extendedProps.time || "",
      date: formatDate(event.start, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      duration: event.extendedProps.duration || "",
      link: event.extendedProps.link || "",
      platform: event.extendedProps.platform || "",
    });
  };

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi) {
      calendarApi.addEvent({
        ...newEvent,
        title: newEvent.platform, // Title is now the platform name
      });
      setNewEvent({
        id: "",
        title: "",
        start: new Date(),
        end: new Date(),
        contestName: "",
        time: "",
        date: "",
        duration: "",
        link: "",
        platform: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#0f0f0f] text-[#DEA03C] min-h-screen">
      <div className="flex w-full px-10 justify-start items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">
            Calendar Events
          </div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && (
              <div className="italic text-center">No Events Present</div>
            )}

            {currentEvents.length > 0 &&
              currentEvents.map((event) => (
                <li
                  className="border border-[#DEA03C] shadow px-4 py-2 rounded-md"
                  key={event.id}
                >
                  <span className="text-white">{event.extendedProps.contestName}</span>
                  <br />
                  <label className="text-white">
                    {formatDate(event.start, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </label>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-9/12 mt-8">
          <FullCalendar
            ref={calendarRef}
            height={"85vh"}
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={
              typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("events") || "[]")
                : []
            }
            displayEventTime={false}
          />
        </div>
      </div>

      <Dialog open={!!newEvent.id} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event Details</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddOrUpdateEvent}>
            <div>
              <label htmlFor="contestName" className="block text-sm font-medium text-gray-700">
                Contest Name:
              </label>
              <input
                type="text"
                id="contestName"
                name="contestName"
                value={newEvent.contestName}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time:
              </label>
              <input
                type="text"
                id="time"
                name="time"
                value={newEvent.time}
                onChange={handleInputChange}
                placeholder="e.g., 8:00 AM - 9:30 AM"
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration:
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={newEvent.duration}
                onChange={handleInputChange}
                placeholder="e.g., 1 hr 30 mins"
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                Link:
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={newEvent.link}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Platform:
              </label>
              <input
                type="text"
                id="platform"
                name="platform"
                value={newEvent.platform}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
              type="submit"
            >
              Add Event
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {selectedEvent && <EventCard event={selectedEvent} />}
    </div>
  );
};

export default Calendar;
