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
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
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
    savedBookingId: null, // Track saved booking ID
    originalEmail: null, // Track original email for change detection
  });

  const updateBooking = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step) => {
    setShowSummary(false);
    setCurrentStep(step);
  };

  // Build booking payload (shared between create and update)
  // Accepts optional formData to use instead of bookingData state (for avoiding race conditions)
  const buildBookingPayload = (formData = null) => {
    const isHourly = bookingData.serviceType === "hourly";

    // Use formData if provided, otherwise fall back to state
    const passengerDetails = formData?.passengerDetails || bookingData.passengerDetails;
    const flightDetails = formData?.flightDetails || bookingData.flightDetails;
    const specialInstructions = formData?.specialInstructions ?? bookingData.specialInstructions;

    return {
      pickup: {
        address: bookingData.pickup,
      },
      dropoff: {
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
      passengerDetails: passengerDetails,
      isBookingForSomeoneElse: passengerDetails?.isBookingForSomeoneElse || false,
      guestDetails: passengerDetails?.isBookingForSomeoneElse
        ? {
          firstName: passengerDetails?.guestFirstName,
          lastName: passengerDetails?.guestLastName,
          email: passengerDetails?.guestEmail,
          countryCode: passengerDetails?.guestCountryCode,
          phone: passengerDetails?.guestPhone,
        }
        : null,
      isAirportPickup: flightDetails?.isAirportPickup || false,
      flightDetails: flightDetails?.isAirportPickup
        ? {
          flightNumber: flightDetails?.flightNumber,
          nameBoard: flightDetails?.nameBoard,
        }
        : null,
      specialInstructions: specialInstructions,
    };
  };

  // Handle UserDetails form submission - CREATE LEAD and show summary
  // formData is passed directly from UserDetails to avoid race condition with state updates
  const handleUserDetailsSubmit = async (formData = null) => {
    const existingBookingId = bookingData.savedBookingId;

    // Get the current email from formData or fall back to state
    const currentPassengerDetails = formData?.passengerDetails || bookingData.passengerDetails;

    // If booking already exists, this is a re-submit from edit
    // Just go to summary without creating a new booking
    if (existingBookingId) {
      // Check if email changed and update if needed
      const currentEmail = currentPassengerDetails?.email;
      const originalEmail = bookingData.originalEmail;

      if (currentEmail !== originalEmail) {
        // Email changed - update booking and send welcome email to new address
        setIsLoadingLead(true);
        try {
          await bookingAPI.updateBookingDetails(existingBookingId, {
            ...buildBookingPayload(formData),
            originalEmail: originalEmail, // Send original email for comparison
          });
          // Update original email to current
          updateBooking("originalEmail", currentEmail);
          console.log("Booking updated with new email, welcome email sent to:", currentEmail);
        } catch (error) {
          console.error("Error updating booking:", error);
        } finally {
          setIsLoadingLead(false);
        }
      }

      setShowSummary(true);
      return;
    }

    // NEW LEAD - Create booking in database
    setIsLoadingLead(true);
    try {
      const bookingPayload = {
        ...buildBookingPayload(formData),
        paymentStatus: "pending",
        status: "pending",
      };

      console.log("Creating booking with payload:", bookingPayload);

      const bookingResponse = await bookingAPI.createBooking(bookingPayload);

      if (!bookingResponse.success) {
        throw new Error("Failed to save booking");
      }

      // Store booking ID and original email for later
      const savedBookingId = bookingResponse.data._id;
      const originalEmail = currentPassengerDetails?.email;

      updateBooking("savedBookingId", savedBookingId);
      updateBooking("originalEmail", originalEmail);

      console.log("Lead saved with ID:", savedBookingId);
      console.log("Welcome emails sent to user and admin notification sent!");

      setShowSummary(true);
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoadingLead(false);
    }
  };

  // Handle edit from summary - go back to step 3
  const handleEditFromSummary = () => {
    setShowSummary(false);
  };

  // Handle proceed to payment - CREATE PAYMENT INTENT (booking already exists)
  const handleProceedToPayment = async () => {
    const totalAmount = bookingData.selectedVehicle?.pricing?.totalPrice;
    const savedBookingId = bookingData.savedBookingId;

    if (!totalAmount) {
      alert("Invalid booking amount");
      return;
    }

    if (!savedBookingId) {
      alert("Booking not found. Please try again.");
      return;
    }

    setIsLoadingPayment(true);

    try {
      // Create payment intent (booking already saved in handleUserDetailsSubmit)
      const response = await paymentAPI.createPaymentIntent({
        amount: totalAmount,
        currency: "gbp",
        bookingData: bookingData,
        bookingId: savedBookingId,
      });

      if (response.success) {
        setClientSecret(response.clientSecret);
        setIsTestMode(response.isTestMode || false);
        setShowSummary(false);
        setCurrentStep(4);
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Handle payment success - UPDATE existing booking (triggers confirmation emails)
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const bookingId = bookingData.savedBookingId;

      if (bookingId) {
        // Update the existing booking with paid status
        // This triggers confirmation emails on the backend
        await bookingAPI.updateBookingStatus(bookingId, {
          paymentStatus: "paid",
          paymentIntentId: paymentIntent.id,
        });
        console.log("Booking confirmed! Confirmation emails sent.");
      } else {
        console.error("No booking ID found to update");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
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
      {/* --- STEPS INDICATOR (Classic Style with Circles & Lines) --- */}
      <div className="bg-gray-50 pt-32 md:pt-36 pb-6 ">
        <div className="max-w-4xl mx-auto px-4">
          {/* Stepper - 4 Steps with Circles and Connecting Lines */}
          <div className="flex items-center justify-center space-x-1 md:space-x-4 text-sm">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <div
                    className="w-8 md:w-16 h-0.5 rounded-full transition-all duration-500"
                    style={{
                      background: displayStep >= step.id
                        ? 'linear-gradient(to right, var(--color-primary), var(--color-primary-dark))'
                        : '#d1d5db'
                    }}
                  ></div>
                )}
                <div
                  className={`flex items-center gap-1 md:gap-2 transition-all duration-300 ${displayStep >= step.id
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400"
                    }`}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-sm font-bold border-2 transition-all duration-300"
                    style={
                      displayStep > step.id
                        ? {
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          borderColor: 'var(--color-primary)',
                          boxShadow: '0 4px 14px rgba(var(--color-primary-rgb), 0.3)'
                        }
                        : displayStep === step.id
                          ? { backgroundColor: '#1f2937', color: 'white', borderColor: '#1f2937', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
                          : { backgroundColor: 'white', borderColor: '#d1d5db', color: '#9ca3af' }
                    }
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
                isLoading={isLoadingLead}
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
                    savedBookingId: null,
                    originalEmail: null,
                  });
                  setClientSecret(null);
                  setShowSummary(false);
                  setCurrentStep(1);
                }}
                isLoadingIntent={isLoadingPayment}
                isTestMode={isTestMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Booking;
