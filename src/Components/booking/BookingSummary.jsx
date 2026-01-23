import { motion } from "framer-motion";
import {
    ArrowLeft,
    CreditCard,
    MapPin,
    Calendar,
    Clock,
    Car,
    User,
    Phone,
    Mail,
    Plane,
    Users,
    Briefcase,
    MessageSquare,
    Check,
    Edit3,
    Loader2,
} from "lucide-react";

// Info Row Component
const InfoRow = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-start gap-3 py-2">
        <div className={`p-2 rounded-lg ${highlight ? "bg-blue-100" : "bg-gray-100"}`}>
            <Icon size={16} className={highlight ? "text-blue-600" : "text-gray-500"} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-900 break-words">{value || "—"}</p>
        </div>
    </div>
);

// Section Card Component
const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${className}`}
    >
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="p-2 bg-blue-100 rounded-lg">
                <Icon size={18} className="text-blue-600" />
            </div>
            {title}
        </h3>
        {children}
    </motion.div>
);

// Price Row Component
const PriceRow = ({ label, amount, isTotal = false }) => (
    <div className={`flex justify-between items-center py-2 ${isTotal ? "border-t-2 border-gray-200 mt-2 pt-3" : ""}`}>
        <span className={`${isTotal ? "text-lg font-bold text-gray-900" : "text-gray-600"}`}>
            {label}
        </span>
        <span className={`${isTotal ? "text-2xl font-bold text-blue-600" : "font-medium text-gray-900"}`}>
            £{typeof amount === "number" ? amount.toFixed(2) : amount}
        </span>
    </div>
);

function BookingSummary({ data, onEdit, onProceed, isLoading = false }) {
    const {
        pickup,
        dropoff,
        pickupDate,
        pickupTime,
        serviceType,
        hours,
        selectedVehicle,
        journeyInfo,
        passengerDetails,
        flightDetails,
        specialInstructions
    } = data;

    const isHourly = serviceType === "hourly";

    const pricing = selectedVehicle?.pricing;
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

    // Vehicle image URL
    const vehicleImageUrl = selectedVehicle?.image?.url
        ? `${API_BASE}/${selectedVehicle.image.url.replace(/\\/g, "/")}`
        : "/placeholder-car.png";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                        <Check size={32} className="text-green-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Review Your Booking</h1>
                    <p className="text-gray-500 mt-2">Please confirm your details before proceeding to payment</p>
                </motion.div>

                {/* Summary Cards */}
                <div className="space-y-4">
                    {/* Journey Details */}
                    <SectionCard title="Journey Details" icon={MapPin}>
                        <div className="space-y-4">
                            {/* Route Visual */}
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    {!isHourly && (
                                        <>
                                            <div className="w-0.5 h-12 bg-gradient-to-b from-green-500 to-blue-500" />
                                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                        </>
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pickup</p>
                                        <p className="font-medium text-gray-900 text-sm">{pickup || "—"}</p>
                                    </div>
                                    {!isHourly && dropoff && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Dropoff</p>
                                            <p className="font-medium text-gray-900 text-sm">{dropoff}</p>
                                        </div>
                                    )}
                                    {isHourly && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                                            <p className="font-medium text-purple-600 text-sm">{hours || journeyInfo?.hours || 2} Hours Booking</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Date/Time/Distance or Hours */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <Calendar size={18} className="mx-auto text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">Date</p>
                                    <p className="font-semibold text-gray-900 text-sm">{formatDate(pickupDate)}</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <Clock size={18} className="mx-auto text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">Time</p>
                                    <p className="font-semibold text-gray-900 text-sm">{pickupTime || "—"}</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    {isHourly ? (
                                        <>
                                            <Clock size={18} className="mx-auto text-purple-500 mb-1" />
                                            <p className="text-xs text-gray-500">Hours</p>
                                            <p className="font-semibold text-purple-600 text-sm">
                                                {hours || journeyInfo?.hours || 2}h
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <MapPin size={18} className="mx-auto text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-500">Distance</p>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {journeyInfo?.distanceMiles?.toFixed(1) || "—"} mi
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Vehicle */}
                    <SectionCard title="Selected Vehicle" icon={Car}>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-16 bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={vehicleImageUrl}
                                    alt={selectedVehicle?.categoryName}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/100x60?text=Car";
                                    }}
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{selectedVehicle?.categoryName || "—"}</h4>
                                <p className="text-sm text-gray-500">{selectedVehicle?.categoryDetails}</p>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} /> {selectedVehicle?.numberOfPassengers}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Briefcase size={14} /> {selectedVehicle?.numberOfBigLuggage}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Passenger Details */}
                    <SectionCard title="Passenger Details" icon={User}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <InfoRow
                                icon={User}
                                label="Name"
                                value={`${passengerDetails?.firstName || ""} ${passengerDetails?.lastName || ""}`}
                            />
                            <InfoRow
                                icon={Phone}
                                label="Phone"
                                value={`${passengerDetails?.countryCode || ""} ${passengerDetails?.phone || ""}`}
                            />
                            <InfoRow icon={Mail} label="Email" value={passengerDetails?.email} />
                            <InfoRow
                                icon={Users}
                                label="Passengers & Luggage"
                                value={`${passengerDetails?.numberOfPassengers || 1} passengers, ${passengerDetails?.numberOfSuitcases || 0} suitcases`}
                            />
                        </div>

                        {/* Guest Details */}
                        {passengerDetails?.isBookingForSomeoneElse && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm font-medium text-purple-600 mb-3">Booking for Someone Else</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <InfoRow
                                        icon={User}
                                        label="Passenger Name"
                                        value={`${passengerDetails?.guestFirstName || ""} ${passengerDetails?.guestLastName || ""}`}
                                        highlight
                                    />
                                    <InfoRow
                                        icon={Phone}
                                        label="Passenger Phone"
                                        value={`${passengerDetails?.guestCountryCode || ""} ${passengerDetails?.guestPhone || ""}`}
                                        highlight
                                    />
                                    <InfoRow icon={Mail} label="Passenger Email" value={passengerDetails?.guestEmail} highlight />
                                </div>
                            </div>
                        )}
                    </SectionCard>

                    {/* Flight Details (if airport pickup) */}
                    {flightDetails?.isAirportPickup && (
                        <SectionCard title="Flight Details" icon={Plane}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <InfoRow icon={Plane} label="Flight Number" value={flightDetails?.flightNumber} highlight />
                                <InfoRow
                                    icon={User}
                                    label="Name Board"
                                    value={flightDetails?.nameBoard || "—"}
                                />
                            </div>
                            <p className="text-sm text-sky-600 bg-sky-50 px-3 py-2 rounded-lg mt-3">
                                ✈️ We'll track your flight and adjust pickup time if needed
                            </p>
                        </SectionCard>
                    )}

                    {/* Special Instructions */}
                    {specialInstructions && (
                        <SectionCard title="Additional Requirements" icon={MessageSquare}>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-xl">{specialInstructions}</p>
                        </SectionCard>
                    )}

                    {/* Price Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl shadow-blue-500/25"
                    >
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <CreditCard size={20} />
                            Price Summary
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-blue-100">
                                <span>Base Fare</span>
                                <span>£{pricing?.basePrice?.toFixed(2) || "0.00"}</span>
                            </div>
                            {pricing?.airportCharges > 0 && (
                                <div className="flex justify-between text-blue-100">
                                    <span>Airport Charges</span>
                                    <span>£{pricing?.airportCharges?.toFixed(2)}</span>
                                </div>
                            )}
                            {pricing?.congestionCharge > 0 && (
                                <div className="flex justify-between text-blue-100">
                                    <span>Congestion Charge</span>
                                    <span>£{pricing?.congestionCharge?.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-blue-100">
                                <span>VAT ({pricing?.vatRate || 20}%)</span>
                                <span>£{pricing?.tax?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="border-t border-blue-400/30 my-3" />
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-3xl font-bold">£{pricing?.totalPrice?.toFixed(2) || "0.00"}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-4 mt-8"
                >
                    <button
                        onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-4 px-6 border-2 border-gray-200 rounded-2xl
              font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                        <Edit3 size={20} />
                        Edit Details
                    </button>

                    <button
                        onClick={onProceed}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl
              font-semibold text-white hover:from-green-700 hover:to-emerald-600 shadow-lg shadow-green-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard size={20} />
                                Proceed to Payment
                            </>
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default BookingSummary;
