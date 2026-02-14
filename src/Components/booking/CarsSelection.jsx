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
  MapPin,
  Clock,
  Route,
  Shield,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { vehicleAPI } from "../../Utils/api";

/* ─────────────────────────────────────────────
   COMPACT VEHICLE CARD
   ───────────────────────────────────────────── */
const VehicleCard = ({ vehicle, isSelected, onSelect, isDisabled }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const pricing = vehicle.pricing;
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const imageUrl = vehicle.image?.url
    ? `${API_BASE}/${vehicle.image.url.replace(/\\/g, "/")}`
    : "/placeholder-car.png";

  // Type badge color mapping
  const typeBadge = {
    Luxury: { bg: "rgba(215,183,94,0.15)", text: "var(--color-primary)", label: "LUXURY" },
    Executive: { bg: "rgba(147,130,220,0.12)", text: "#9382dc", label: "EXECUTIVE" },
    Business: { bg: "rgba(59,130,246,0.12)", text: "#60a5fa", label: "BUSINESS" },
    Standard: { bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.5)", label: "STANDARD" },
  };
  const badge = typeBadge[vehicle.vehicleType] || typeBadge.Standard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => !isDisabled && onSelect(vehicle)}
      className={`relative rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group
        ${isDisabled ? "opacity-35 grayscale pointer-events-none" : ""}`}
      style={{
        backgroundColor: isSelected ? "rgba(215,183,94,0.06)" : "rgba(255,255,255,0.03)",
        border: isSelected
          ? "1.5px solid var(--color-primary)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isSelected ? "0 0 30px rgba(215,183,94,0.1)" : "none",
      }}
    >
      {/* Main Content */}
      <div className="flex items-center gap-5 p-5">
        {/* Vehicle Image - LARGER */}
        <div
          className="w-36 h-24 md:w-44 md:h-28 shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          <img
            src={imageUrl}
            alt={vehicle.categoryName}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/176x112?text=Car";
            }}
          />
        </div>

        {/* Info - LARGER TEXT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-lg md:text-xl font-bold text-white">
              {vehicle.categoryName}
            </h3>
          </div>
          <p
            className="text-sm mb-3"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {vehicle.categoryDetails}
          </p>
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <Users size={16} style={{ color: "var(--color-primary)" }} />
              <span className="font-semibold">{vehicle.numberOfPassengers}</span>
            </div>
            <div
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <Briefcase size={16} style={{ color: "var(--color-primary)" }} />
              <span className="font-semibold">{vehicle.numberOfBigLuggage}</span>
            </div>
          </div>
        </div>

        {/* Price + Action - LARGER */}
        <div className="shrink-0 text-right flex flex-col items-end gap-3">
          <div>
            <span
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              £{pricing?.totalPrice?.toFixed(2) || "—"}
            </span>
            {pricing?.vatInclusive && (
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                incl. VAT
              </p>
            )}
          </div>

          {/* Select Indicator / Button - LARGER */}
          {isSelected ? (
            <span
              className="flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-lg"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-dark)",
              }}
            >
              <Check size={18} /> SELECTED
            </span>
          ) : (
            <button
              className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(215,183,94,0.12)";
                e.currentTarget.style.color = "var(--color-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) onSelect(vehicle);
              }}
            >
              SELECT <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Price Breakdown Toggle - LARGER */}
      {pricing && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBreakdown(!showBreakdown);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.35)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            {showBreakdown ? "Hide" : "Price"} Breakdown
            {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="px-6 pb-5 pt-3 space-y-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {/* Price rows */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span>Base fare</span>
                      <span className="text-white font-semibold">£{pricing.basePrice?.toFixed(2)}</span>
                    </div>
                    {pricing.congestionCharge > 0 && (
                      <div className="flex justify-between text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                        <span>Congestion charge</span>
                        <span className="text-white font-semibold">£{pricing.congestionCharge?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span>Tax ({pricing.vatRate}%)</span>
                      <span className="text-white font-semibold">£{pricing.tax?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <span style={{ color: "var(--color-primary)" }}>Total</span>
                      <span style={{ color: "var(--color-primary)" }}>£{pricing.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Features */}
                  {vehicle.companyFeatures?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {vehicle.companyFeatures.slice(0, 4).map((feat, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                          style={{
                            backgroundColor: "rgba(215,183,94,0.08)",
                            color: "var(--color-primary)",
                          }}
                        >
                          <Check size={12} /> {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   FILTER DROPDOWN (compact)
   ───────────────────────────────────────────── */
const FilterDropdown = ({ label, value, onChange, options, icon: Icon }) => (
  <div>
    <label
      className="block text-[10px] font-bold mb-1 uppercase tracking-widest"
      style={{ color: "var(--color-primary)" }}
    >
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.35)" }}>
        <Icon size={15} />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none rounded-lg pl-9 pr-8 py-2.5 text-sm font-medium focus:outline-none cursor-pointer"
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#fff",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
function CarsSelection({ data, updateData, onNext, onBack }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [passengerFilter, setPassengerFilter] = useState(1);
  const [luggageFilter, setLuggageFilter] = useState(1);

  // Prepare search data for API
  const searchData = useMemo(() => {
    const dropoffAddress =
      data.serviceType === "hourly" ? data.pickup : data.dropoff;
    return {
      pickupAddress: data.pickup || "",
      dropoffAddress: dropoffAddress || "",
      pickupDate:
        data.pickupDate instanceof Date
          ? data.pickupDate.toISOString().split("T")[0]
          : "",
      pickupTime: data.pickupTime || "12:00",
      bookingType: data.serviceType === "hourly" ? "hourly" : "p2p",
      hours: data.serviceType === "hourly" ? data.hours || 2 : undefined,
    };
  }, [data]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vehicles", searchData],
    queryFn: () => vehicleAPI.searchVehiclesWithFare(searchData),
    enabled:
      data.serviceType === "hourly"
        ? !!data.pickup
        : !!(data.pickup && data.dropoff),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const vehicles = response?.data || [];
  const journeyInfo = response?.journey || {};

  const filteredVehicles = useMemo(
    () =>
      vehicles.map((v) => ({
        ...v,
        isDisabled:
          v.numberOfPassengers < passengerFilter ||
          v.numberOfBigLuggage < luggageFilter,
      })),
    [vehicles, passengerFilter, luggageFilter]
  );

  const sortedVehicles = useMemo(
    () => [...filteredVehicles].sort((a, b) => (a.isDisabled === b.isDisabled ? 0 : a.isDisabled ? 1 : -1)),
    [filteredVehicles]
  );

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

  const maxPassengers = Math.max(...vehicles.map((v) => v.numberOfPassengers), 1);
  const maxLuggage = Math.max(...vehicles.map((v) => v.numberOfBigLuggage), 1);
  const passengerOptions = Array.from({ length: maxPassengers }, (_, i) => i + 1);
  const luggageOptions = Array.from({ length: maxLuggage }, (_, i) => i + 1);

  const isHourly = data.serviceType === "hourly";

  /* ────── LOADING ────── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 size={44} className="animate-spin mb-4" style={{ color: "var(--color-primary)" }} />
        <p className="font-medium text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Finding the best vehicles for you…
        </p>
      </div>
    );
  }

  /* ────── ERROR ────── */
  if (isError) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <AlertCircle size={44} className="mx-auto mb-3" style={{ color: "#ef4444" }} />
        <h3 className="font-bold mb-2 text-red-400">Something went wrong</h3>
        <p className="text-red-300 text-sm mb-4">{error?.message || "Failed to load vehicles"}</p>
        <button onClick={() => refetch()} className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  /* ────── MAIN LAYOUT ────── */
  return (
    <div className="space-y-5">
      {/* ══════ TWO‑COLUMN LAYOUT (desktop) ══════ */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* ── LEFT SIDEBAR ── */}
        <div className="lg:w-56 xl:w-60 shrink-0 space-y-4 lg:sticky lg:top-36 lg:self-start">
          {/* Journey Card */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl p-4 overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(215,183,94,0.10) 0%, rgba(215,183,94,0.03) 100%)",
              border: "1px solid rgba(215,183,94,0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Car size={18} style={{ color: "var(--color-primary)" }} />
              <h3 className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>
                {isHourly ? "Hourly Booking" : "Your Journey"}
              </h3>
            </div>

            {/* Route */}
            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2">
                <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "var(--color-primary)" }} />
                <p className="text-xs text-white leading-snug">
                  {journeyInfo?.pickup?.address?.split(",")[0] || data.pickup?.split(",")[0] || "—"}
                </p>
              </div>
              {!isHourly && (
                <div className="flex items-start gap-2">
                  <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
                  <p className="text-xs text-white leading-snug">
                    {journeyInfo?.dropoff?.address?.split(",")[0] || data.dropoff?.split(",")[0] || "—"}
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div
              className="flex items-stretch divide-x rounded-lg overflow-hidden"
              style={{ backgroundColor: "rgba(0,0,0,0.2)", divideColor: "rgba(255,255,255,0.06)" }}
            >
              {isHourly ? (
                <div className="flex-1 text-center py-2.5">
                  <p className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                    {data.hours || 2}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Hours
                  </p>
                </div>
              ) : (
                <>
                  {journeyInfo?.distanceMiles && (
                    <div className="flex-1 text-center py-2.5">
                      <p className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                        {journeyInfo.distanceMiles.toFixed(1)}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Miles
                      </p>
                    </div>
                  )}
                  {journeyInfo?.durationMins && (
                    <div className="flex-1 text-center py-2.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <p className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                        {journeyInfo.durationMins}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Mins
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Filters Card */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl p-4"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter size={14} style={{ color: "var(--color-primary)" }} />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Filters
              </span>
            </div>
            <div className="space-y-3">
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

          {/* Back button (desktop only) */}
          <button
            onClick={onBack}
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium transition-colors w-full justify-center py-2"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <ArrowLeft size={14} /> Back to Locations
          </button>
        </div>

        {/* ── RIGHT: VEHICLE LIST ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Select Your Vehicle
            </h2>
            <span
              className="text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {sortedVehicles.filter((v) => !v.isDisabled).length} available
            </span>
          </div>

          {sortedVehicles.length === 0 ? (
            <div className="text-center py-16">
              <Car size={44} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No vehicles available for this route</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedVehicles.map((vehicle, i) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  isSelected={selectedVehicle?._id === vehicle._id}
                  onSelect={handleSelectVehicle}
                  isDisabled={vehicle.isDisabled}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════ BOTTOM NAVIGATION ══════ */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={onBack}
          className="lg:hidden flex-1 py-3.5 border rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <ArrowLeft size={16} /> BACK
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedVehicle}
          className="flex-1 py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
          style={
            selectedVehicle
              ? {
                backgroundColor: "var(--color-primary)",
                color: "var(--color-dark)",
                boxShadow: "0 4px 20px rgba(215,183,94,0.25)",
              }
              : {
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.2)",
                cursor: "not-allowed",
              }
          }
        >
          CONTINUE
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default CarsSelection;
