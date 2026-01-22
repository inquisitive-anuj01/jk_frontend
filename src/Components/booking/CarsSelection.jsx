import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Car,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { vehicleAPI } from "../../Utils/api";

// Vehicle Card Component with expandable price breakdown
const VehicleCard = ({ vehicle, isSelected, onSelect, isDisabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pricing = vehicle.pricing;
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const imageUrl = vehicle.image?.url
    ? `${API_BASE}/${vehicle.image.url.replace(/\\/g, "/")}`
    : "/placeholder-car.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden group
        ${isDisabled ? "opacity-40 grayscale pointer-events-none" : ""}
        ${isSelected
          ? "border-blue-500 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/30"
          : "border-gray-100 hover:border-gray-300 hover:shadow-lg"
        }`}
    >
      {/* Premium Badge */}
      {vehicle.vehicleType === "Luxury" && (
        <div className="absolute top-4 left-4 z-10 bg-linear-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Sparkles size={12} />
          LUXURY
        </div>
      )}

      {/* Disabled Overlay */}
      {isDisabled && (
        <div className="absolute inset-0 z-20 bg-gray-900/10 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <p className="text-sm font-semibold text-gray-600">
              Not available for your requirements
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-5">
        <div className="flex gap-5">
          {/* Vehicle Image */}
          <div className="w-32 h-20 md:w-40 md:h-24 shrink-0 relative overflow-hidden rounded-xl bg-linear-to-br from-gray-50 to-gray-100">
            <img
              src={imageUrl}
              alt={vehicle.categoryName}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/160x100?text=Vehicle";
              }}
            />
          </div>

          {/* Vehicle Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                  {vehicle.categoryName}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                  {vehicle.categoryDetails}
                </p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">
                    £{pricing?.totalPrice?.toFixed(2) || "—"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    className="ml-1 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
                {pricing?.vatInclusive && (
                  <p className="text-xs text-gray-400 mt-0.5">incl. VAT</p>
                )}
              </div>
            </div>

            {/* Capacity Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                <Users size={15} className="text-blue-500" />
                <span className="text-sm font-medium">
                  {vehicle.numberOfPassengers}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                <Briefcase size={15} className="text-amber-500" />
                <span className="text-sm font-medium">
                  {vehicle.numberOfBigLuggage}
                </span>
              </div>
              {vehicle.vehicleType && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                  {vehicle.vehicleType}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Features & Price Breakdown */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100">
                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {vehicle.companyFeatures
                    ?.slice(0, 4)
                    .map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <Check
                          size={14}
                          className="text-green-500 flex-shrink-0"
                        />
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                </div>

                {/* Price Breakdown */}
                {pricing && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 mt-3">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Shield size={14} className="text-blue-500" />
                      Price Breakdown
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Base fare</span>
                        <span className="font-medium">
                          £{pricing.basePrice?.toFixed(2)}
                        </span>
                      </div>
                      {pricing.congestionCharge > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Congestion charge</span>
                          <span className="font-medium">
                            £{pricing.congestionCharge?.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>Estimated tax ({pricing.vatRate}%)</span>
                        <span className="font-medium">
                          £{pricing.tax?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900">
                        <span>Total</span>
                        <span>£{pricing.totalPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Select Button */}
        <button
          onClick={() => !isDisabled && onSelect(vehicle)}
          disabled={isDisabled}
          className={`w-full mt-4 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-300
            ${isSelected
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : isDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg"
            }`}
        >
          {isSelected ? (
            <>
              <Check size={18} />
              SELECTED
            </>
          ) : (
            <>
              SELECT THIS VEHICLE
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({ label, value, onChange, options, icon: Icon }) => {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={18} />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-300"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
};

// Main CarsSelection Component
function CarsSelection({ data, updateData, onNext, onBack }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [passengerFilter, setPassengerFilter] = useState(1);
  const [luggageFilter, setLuggageFilter] = useState(1);

  // DEBUG: Log incoming data
  console.log("=== CarsSelection DEBUG ===");
  console.log("data.pickup:", data.pickup);
  console.log("data.dropoff:", data.dropoff);
  console.log("data.pickupDate:", data.pickupDate);
  console.log("data.pickupTime:", data.pickupTime);
  console.log("data.serviceType:", data.serviceType);

  // Prepare search data for API
  const searchData = useMemo(() => {
    const payload = {
      pickupAddress: data.pickup || "",
      dropoffAddress: data.dropoff || "",
      pickupDate: data.pickupDate instanceof Date ? data.pickupDate.toISOString().split("T")[0] : "",
      pickupTime: data.pickupTime || "12:00",
      bookingType: data.serviceType === "hourly" ? "hourly" : "p2p",
      hours: data.serviceType === "hourly" ? 4 : undefined,
    };
    console.log("=== API PAYLOAD being sent ===", payload);
    return payload;
  }, [data]);

  // TanStack Query for fetching vehicles
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vehicles", searchData],
    queryFn: async () => {
      console.log("=== Making API call with ===", searchData);
      return vehicleAPI.searchVehiclesWithFare(searchData);
    },
    enabled: !!(data.pickup && data.dropoff),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const vehicles = response?.data || [];
  const journeyInfo = response?.journey || {};

  // Filter vehicles in frontend
  const filteredVehicles = useMemo(() => {
    return vehicles.map((vehicle) => ({
      ...vehicle,
      isDisabled:
        vehicle.numberOfPassengers < passengerFilter ||
        vehicle.numberOfBigLuggage < luggageFilter,
    }));
  }, [vehicles, passengerFilter, luggageFilter]);

  // Sort: Available first, then disabled
  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      if (a.isDisabled === b.isDisabled) return 0;
      return a.isDisabled ? 1 : -1;
    });
  }, [filteredVehicles]);

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    updateData("selectedVehicle", vehicle);
  };

  const handleContinue = () => {
    if (selectedVehicle) {
      updateData("journeyInfo", journeyInfo);
      onNext();
    }
  };

  // Generate filter options
  const maxPassengers = Math.max(
    ...vehicles.map((v) => v.numberOfPassengers),
    1
  );
  const maxLuggage = Math.max(...vehicles.map((v) => v.numberOfBigLuggage), 1);
  const passengerOptions = Array.from(
    { length: maxPassengers },
    (_, i) => i + 1
  );
  const luggageOptions = Array.from({ length: maxLuggage }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Journey Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-xl shadow-blue-500/20"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Car size={24} />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Your Journey</p>
              <p className="font-bold text-lg line-clamp-1">
                {journeyInfo?.pickup?.address?.split(",")[0] ||
                  data.pickup?.split(",")[0]}{" "}
                →{" "}
                {journeyInfo?.dropoff?.address?.split(",")[0] ||
                  data.dropoff?.split(",")[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {journeyInfo?.distanceMiles && (
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {journeyInfo.distanceMiles.toFixed(1)}
                </p>
                <p className="text-blue-200 text-xs uppercase tracking-wide">
                  Miles
                </p>
              </div>
            )}
            {journeyInfo?.durationMins && (
              <div className="text-center">
                <p className="text-3xl font-bold">{journeyInfo.durationMins}</p>
                <p className="text-blue-200 text-xs uppercase tracking-wide">
                  Mins
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-500" />
          <h3 className="font-bold text-gray-800">Filter Vehicles</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FilterDropdown
            label="Passengers"
            value={passengerFilter}
            onChange={setPassengerFilter}
            options={passengerOptions}
            icon={Users}
          />
          <FilterDropdown
            label="Luggage"
            value={luggageFilter}
            onChange={setLuggageFilter}
            options={luggageOptions}
            icon={Briefcase}
          />
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">
            Finding the best vehicles for you...
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-3" />
          <h3 className="font-bold text-red-800 mb-2">Something went wrong</h3>
          <p className="text-red-600 text-sm mb-4">
            {error?.message || "Failed to load vehicles"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Vehicle Cards */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          {sortedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              isSelected={selectedVehicle?._id === vehicle._id}
              onSelect={handleSelectVehicle}
              isDisabled={vehicle.isDisabled}
            />
          ))}

          {sortedVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No vehicles available for this route
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          BACK
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedVehicle}
          className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
            ${selectedVehicle
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          CONTINUE
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default CarsSelection;
