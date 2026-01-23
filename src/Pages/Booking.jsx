import React, { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import Locations from "../Components/booking/Locations";
import CarsSelection from "../Components/booking/CarsSelection";
import UserDetails from "../Components/booking/UserDetails";
import BookingSummary from "../Components/booking/BookingSummary";
import Payment from "../Components/booking/Payment";
import { paymentAPI, bookingAPI } from "../Utils/api";

const LIBRARIES = ["places"];

// Step configurations - 4 steps including payment
const STEPS = [
  { id: 1, label: "Locations", description: "Where would you like to go?" },
  { id: 2, label: "Cars", description: "Choose your vehicle" },
  { id: 3, label: "Details", description: "Tell us about yourself" },
  { id: 4, label: "Payment", description: "Complete your booking" },
];

function Booking() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickup: null,
    dropoff: null,
    pickupDate: new Date(),
    pickupTime: "12:00 PM",
    serviceType: "oneway",
    hours: 2, // Default hours for hourly bookings
    selectedVehicle: null,
    journeyInfo: null,
    passengerDetails: null,
    flightDetails: null,
    specialInstructions: "",
  });

  const updateBooking = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step) => {
    setShowSummary(false);
    setCurrentStep(step);
  };

  // Handle UserDetails form submission - show summary
  const handleUserDetailsSubmit = () => {
    setShowSummary(true);
  };

  // Handle edit from summary - go back to step 3
  const handleEditFromSummary = () => {
    setShowSummary(false);
  };

  // Handle proceed to payment - create payment intent and go to step 4
  const handleProceedToPayment = async () => {
    const totalAmount = bookingData.selectedVehicle?.pricing?.totalPrice;

    if (!totalAmount) {
      alert("Invalid booking amount");
      return;
    }

    setIsLoadingPayment(true);

    try {
      const response = await paymentAPI.createPaymentIntent({
        amount: totalAmount,
        currency: "gbp",
        bookingData: bookingData,
      });

      if (response.success) {
        setClientSecret(response.clientSecret);
        setShowSummary(false);
        setCurrentStep(4); // Go to Payment step
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Handle payment success - save booking to DB
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Create booking in database with payment info
      const isHourly = bookingData.serviceType === "hourly";

      const bookingPayload = {
        pickup: {
          address: bookingData.pickup,
        },
        dropoff: {
          // For hourly bookings, use pickup address as dropoff (or leave empty)
          address: isHourly ? bookingData.pickup : bookingData.dropoff,
        },
        pickupDate: bookingData.pickupDate,
        pickupTime: bookingData.pickupTime,
        serviceType: bookingData.serviceType,
        journeyInfo: {
          ...bookingData.journeyInfo,
          hours: isHourly ? (bookingData.hours || 2) : undefined,
        },
        vehicleId: bookingData.selectedVehicle?._id,
        vehicleDetails: {
          categoryName: bookingData.selectedVehicle?.categoryName,
          categoryDetails: bookingData.selectedVehicle?.categoryDetails,
          numberOfPassengers: bookingData.selectedVehicle?.numberOfPassengers,
          numberOfBigLuggage: bookingData.selectedVehicle?.numberOfBigLuggage,
        },
        pricing: bookingData.selectedVehicle?.pricing,
        passengerDetails: bookingData.passengerDetails,
        isBookingForSomeoneElse:
          bookingData.passengerDetails?.isBookingForSomeoneElse || false,
        guestDetails: bookingData.passengerDetails?.isBookingForSomeoneElse
          ? {
            firstName: bookingData.passengerDetails?.guestFirstName,
            lastName: bookingData.passengerDetails?.guestLastName,
            email: bookingData.passengerDetails?.guestEmail,
            countryCode: bookingData.passengerDetails?.guestCountryCode,
            phone: bookingData.passengerDetails?.guestPhone,
          }
          : null,
        isAirportPickup: bookingData.flightDetails?.isAirportPickup || false,
        flightDetails: bookingData.flightDetails?.isAirportPickup
          ? {
            flightNumber: bookingData.flightDetails?.flightNumber,
            nameBoard: bookingData.flightDetails?.nameBoard,
          }
          : null,
        specialInstructions: bookingData.specialInstructions,
        paymentStatus: "paid",
        paymentIntentId: paymentIntent.id,
      };

      await bookingAPI.createBooking(bookingPayload);
      console.log("Booking saved successfully!");
    } catch (error) {
      console.error("Error saving booking:", error);
      // Payment was successful but booking save failed
      // You might want to handle this case (e.g., retry, notify admin)
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium tracking-widest uppercase text-sm">
          Loading Booking Engine...
        </p>
      </div>
    );
  }

  const currentStepConfig = STEPS.find((s) => s.id === currentStep);
  const displayStep = showSummary ? 3 : currentStep;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-900 pb-20">
      {/* --- HEADER AREA --- */}
      <div className="bg-white pt-10 pb-8 px-4 shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            key={displayStep}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-600 font-bold tracking-[0.2em] text-xs uppercase mb-3"
          >
            STEP {displayStep} OF {STEPS.length}
          </motion.p>
          <motion.h1
            key={`title-${displayStep}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-5xl font-light text-black mb-2 uppercase tracking-tight"
          >
            Your Journey
          </motion.h1>
          <motion.p
            key={`desc-${displayStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 uppercase tracking-widest text-xs md:text-sm mb-10"
          >
            {showSummary
              ? "Review your booking details"
              : currentStepConfig?.description}
          </motion.p>

          {/* Stepper - 4 Steps */}
          <div className="flex items-center justify-center space-x-1 md:space-x-4 text-sm">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <div
                    className={`w-6 md:w-12 h-0.5 rounded-full transition-all duration-500 ${displayStep >= step.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gray-300"
                      }`}
                  ></div>
                )}
                <div
                  className={`flex items-center gap-1 md:gap-2 transition-all duration-300 ${displayStep >= step.id
                    ? "text-black font-semibold"
                    : "text-gray-400"
                    }`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full text-xs border-2 transition-all duration-300 ${displayStep > step.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30"
                      : displayStep === step.id
                        ? "bg-black text-white border-black shadow-lg"
                        : "bg-white border-gray-300"
                      }`}
                  >
                    {displayStep > step.id ? "✓" : step.id}
                  </span>
                  <span className="hidden md:inline uppercase text-xs tracking-wide">
                    {step.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-3xl mx-auto mt-8 md:mt-12 px-4 md:px-0">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Locations
                data={bookingData}
                updateData={updateBooking}
                onNext={() => goToStep(2)}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CarsSelection
                data={bookingData}
                updateData={updateBooking}
                onNext={() => goToStep(3)}
                onBack={() => goToStep(1)}
              />
            </motion.div>
          )}

          {currentStep === 3 && !showSummary && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserDetails
                data={bookingData}
                updateData={updateBooking}
                onNext={handleUserDetailsSubmit}
                onBack={() => goToStep(2)}
              />
            </motion.div>
          )}

          {currentStep === 3 && showSummary && (
            <motion.div
              key="step-3-summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BookingSummary
                data={bookingData}
                onEdit={handleEditFromSummary}
                onProceed={handleProceedToPayment}
                isLoading={isLoadingPayment}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Payment
                data={bookingData}
                clientSecret={clientSecret}
                onBack={() => {
                  setShowSummary(true);
                  setCurrentStep(3);
                }}
                onPaymentSuccess={handlePaymentSuccess}
                onComplete={() => {
                  // Reset everything and go back to Step 1
                  setBookingData({
                    pickup: null,
                    dropoff: null,
                    pickupDate: new Date(),
                    pickupTime: "12:00 PM",
                    serviceType: "oneway",
                    hours: 2,
                    selectedVehicle: null,
                    journeyInfo: null,
                    passengerDetails: null,
                    flightDetails: null,
                    specialInstructions: "",
                  });
                  setClientSecret(null);
                  setShowSummary(false);
                  setCurrentStep(1);
                }}
                isLoadingIntent={isLoadingPayment}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Booking;
