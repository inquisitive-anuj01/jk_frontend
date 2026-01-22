import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    loadStripe
} from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import {
    X,
    CreditCard,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_TEST_KEY);

// Payment Form Component (inside Elements provider)
const PaymentForm = ({ onSuccess, onError, amount, bookingData }) => {
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
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard size={20} />
                        Pay £{amount?.toFixed(2)}
                    </>
                )}
            </button>
        </form>
    );
};

// Success Modal Component
const SuccessModal = ({ onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
    >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle size={40} className="text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-500 mb-6">
            Your booking has been confirmed. We'll notify you shortly with the details.
        </p>
        <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl
        font-semibold text-white hover:from-green-700 hover:to-emerald-600 transition-all duration-200"
        >
            Done
        </button>
    </motion.div>
);

// Main Payment Modal Component
function PaymentModal({
    isOpen,
    onClose,
    clientSecret,
    amount,
    bookingData,
    onPaymentSuccess,
}) {
    const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, success, error

    const handleSuccess = (paymentIntent) => {
        setPaymentStatus("success");
        onPaymentSuccess(paymentIntent);
    };

    const handleError = (error) => {
        console.error("Payment error:", error);
        setPaymentStatus("error");
    };

    const handleClose = () => {
        setPaymentStatus("pending");
        onClose();
    };

    if (!isOpen) return null;

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

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    {paymentStatus !== "success" && (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Complete Payment</h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-blue-100">Total Amount</span>
                                <span className="text-3xl font-bold">£{amount?.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {paymentStatus === "success" ? (
                            <SuccessModal onClose={handleClose} />
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
                                    amount={amount}
                                    bookingData={bookingData}
                                />
                            </Elements>
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={32} className="animate-spin text-blue-600" />
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default PaymentModal;
