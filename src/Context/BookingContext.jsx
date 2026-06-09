import React, { createContext, useContext, useState, useCallback } from "react";
import { getMinimumBookingTime } from "../Utils/timeHelpers";

const BookingContext = createContext(null);

// Compute default pickup date and time using centralized helper
const getDefaultPickupDateTime = () => {
  const { minHour24, minMinute, isTomorrow } = getMinimumBookingTime();
  
  let targetDate = new Date();
  if (isTomorrow) {
    targetDate.setDate(targetDate.getDate() + 1); // Push to tomorrow
  }

  const hour12 = (minHour24 % 12 || 12).toString().padStart(2, "0");
  const minStr = minMinute.toString().padStart(2, "0");
  const ampm = minHour24 >= 12 ? "PM" : "AM";

  return {
    date: targetDate,
    time: `${hour12}:${minStr} ${ampm}`
  };
};

const defaultDateTime = getDefaultPickupDateTime();

const defaultBookingData = {
  pickup: null,
  dropoff: null,
  pickupDate: defaultDateTime.date,
  pickupTime: defaultDateTime.time,
  serviceType: "oneway",
  hours: 2,
  selectedVehicle: null,
  journeyInfo: null,
  passengerDetails: null,
  flightDetails: null,
  specialInstructions: "",
  savedBookingId: null,
  originalEmail: null,
};

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState(defaultBookingData);
  const [isFromHero, setIsFromHero] = useState(false);

  const updateBooking = useCallback((field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingData(defaultBookingData);
    setIsFromHero(false);
  }, []);

  const markAsFromHero = useCallback(() => {
    setIsFromHero(true);
  }, []);

  const hasValidLocations = useCallback(() => {
    return !!(bookingData.pickup && (bookingData.serviceType === "hourly" || bookingData.dropoff));
  }, [bookingData.pickup, bookingData.dropoff, bookingData.serviceType]);

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateBooking,
        resetBooking,
        isFromHero,
        markAsFromHero,
        hasValidLocations,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
