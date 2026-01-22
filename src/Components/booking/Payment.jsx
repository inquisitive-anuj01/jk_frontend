import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Car,
  Shield,
  Lock,
} from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_TEST_KEY);

// Payment Form Component (inside Elements provider)
const PaymentForm = ({ onSuccess, onError, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/booking/success",
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        onError(error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl
          font-semibold text-white hover:from-green-700 hover:to-emerald-600 shadow-lg shadow-green-500/25 
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock size={20} />
            Pay £{amount?.toFixed(2)} Securely
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
        <Shield size={16} />
        <span>Secured by Stripe. Your payment info is encrypted.</span>
      </div>
    </form>
  );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg shadow-green-500/30"
        >
          <CheckCircle size={50} className="text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          🎉 Booking Confirmed!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-2 text-lg"
        >
          Your payment was successful.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 mb-8"
        >
          A confirmation email with your booking details will be sent to you shortly. Thank you for choosing us!
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onClose}
          className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl
                        font-semibold text-white text-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-200
                        shadow-lg shadow-green-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Done
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-400 text-sm mt-4"
        >
          ✈️ Have a safe journey!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Main Payment Step Component
function Payment({ data, clientSecret, onBack, onPaymentSuccess, onComplete, isLoadingIntent }) {
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, success, error
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSuccess = (paymentIntent) => {
    setPaymentStatus("success");
    onPaymentSuccess(paymentIntent);
    setShowSuccessModal(true); // Show success modal
  };

  const handleError = (error) => {
    console.error("Payment error:", error);
    setPaymentStatus("error");
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Call onComplete to reset and go back to Step 1
    if (onComplete) {
      onComplete();
    }
  };

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#2563eb",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "12px",
    },
  };

  const pricing = data.selectedVehicle?.pricing;
  const totalAmount = pricing?.totalPrice || 0;

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard size={24} className="text-blue-600" />
                  Order Summary
                </h2>

                {/* Journey Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Pickup</p>
                      <p className="font-medium text-gray-900 text-sm">{data.pickup || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Dropoff</p>
                      <p className="font-medium text-gray-900 text-sm">{data.dropoff || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Date/Time & Vehicle */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <Calendar size={16} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900 text-sm">{formatDate(data.pickupDate)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <Clock size={16} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900 text-sm">{data.pickupTime || "—"}</p>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                  <Car size={24} className="text-gray-400" />
                  <div>
                    <p className="font-bold text-gray-900">{data.selectedVehicle?.categoryName}</p>
                    <p className="text-sm text-gray-500">{data.selectedVehicle?.categoryDetails}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Fare</span>
                    <span>£{pricing?.basePrice?.toFixed(2) || "0.00"}</span>
                  </div>
                  {pricing?.airportCharges > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Airport Charges</span>
                      <span>£{pricing?.airportCharges?.toFixed(2)}</span>
                    </div>
                  )}
                  {pricing?.congestionCharge > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Congestion Charge</span>
                      <span>£{pricing?.congestionCharge?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>VAT ({pricing?.vatRate || 20}%)</span>
                    <span>£{pricing?.tax?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">£{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Summary
              </button>
            </motion.div>

            {/* Right: Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Lock size={24} className="text-green-600" />
                  Secure Payment
                </h2>
                <p className="text-gray-500 mb-6">Enter your card details to complete the booking</p>

                {isLoadingIntent ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-500">Initializing secure payment...</p>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance,
                    }}
                  >
                    <PaymentForm
                      onSuccess={handleSuccess}
                      onError={handleError}
                      amount={totalAmount}
                    />
                  </Elements>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-red-500">
                    <AlertCircle size={40} className="mb-4" />
                    <p>Failed to initialize payment. Please go back and try again.</p>
                  </div>
                )}
              </div>

              {/* Test Card Info */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-800 text-sm font-medium">🧪 Test Mode</p>
                <p className="text-amber-700 text-sm mt-1">
                  Use card <code className="bg-amber-100 px-1 rounded">4242 4242 4242 4242</code> with any future date and CVC.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;