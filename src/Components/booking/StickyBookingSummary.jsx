import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  Briefcase,
  ChevronLeft,
} from "lucide-react";

// Maps "current step" → what clicking the back button does & what to label it
const STEP_BACK_LABELS = {
  2: "Edit Location",
  3: "Edit Vehicle",
  4: "Edit Details",
};

function StickyBookingSummary({
  from,
  to,
  date,
  time,
  vehicle,
  passengerName,
  extras,
  currentStep,
  onGoBack,
}) {
  const goldColor = "#c9a84c";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const backLabel = STEP_BACK_LABELS[currentStep];
  const showBackButton = currentStep >= 2 && !!onGoBack && !!backLabel;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Header - Route */}
      <div
        className="p-4"
        style={{
          background: `linear-gradient(135deg, ${goldColor}15, ${goldColor}08)`,
          borderBottom: `1px solid ${goldColor}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex flex-col items-center"
            style={{ color: goldColor }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: goldColor }}
            />
            <div
              className="w-0.5 h-10 my-1"
              style={{
                background: `linear-gradient(to bottom, ${goldColor}, rgba(255,255,255,0.3))`,
              }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
            />
          </div>
          <div className="flex-1">
            <div className="mb-2">
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: goldColor }}
              >
                From
              </p>
              <p className="font-semibold text-white text-sm break-words">
                {from || "—"}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                To
              </p>
              <p className="font-semibold text-white text-sm break-words">
                {to || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Rows */}
      <div className="p-4 space-y-3">
        {/* Date */}
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${goldColor}10` }}
          >
            <Calendar size={16} style={{ color: goldColor }} />
          </div>
          <div className="flex-1">
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Date
            </p>
            <p className="font-medium text-white text-sm">
              {formatDate(date) || "—"}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${goldColor}10` }}
          >
            <Clock size={16} style={{ color: goldColor }} />
          </div>
          <div className="flex-1">
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Time
            </p>
            <p className="font-medium text-white text-sm">{time || "—"}</p>
          </div>
        </div>

        {/* Vehicle */}
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${goldColor}10` }}
          >
            <Car size={16} style={{ color: goldColor }} />
          </div>
          <div className="flex-1">
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Vehicle
            </p>
            <p className="font-medium text-white text-sm">
              {vehicle?.name || "—"}
            </p>
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {vehicle?.class ? `${vehicle.class} Class` : ""}
            </p>
          </div>
          {vehicle?.price && (
            <div className="text-right">
              <p
                className="text-lg font-bold"
                style={{ color: goldColor }}
              >
                £{vehicle.price.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Capacity */}
        {(vehicle?.pax || vehicle?.luggage) && (
          <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div
              className="flex items-center gap-3"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {vehicle?.pax && (
                <span className="flex items-center gap-1.5 text-sm">
                  <Users size={14} style={{ color: goldColor }} />
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Pax:</span>
                  <span className="font-medium text-white">{vehicle.pax}</span>
                </span>
              )}
              {vehicle?.luggage && (
                <span className="flex items-center gap-1.5 text-sm">
                  <Briefcase size={14} style={{ color: goldColor }} />
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Luggage:</span>
                  <span className="font-medium text-white">{vehicle.luggage}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Passenger */}
        <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${goldColor}10` }}
          >
            <Users size={16} style={{ color: goldColor }} />
          </div>
          <div className="flex-1">
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Passenger
            </p>
            <p className="font-medium text-white text-sm">
              {passengerName || "—"}
            </p>
          </div>
        </div>

        {/* Extras */}
        {extras && extras.length > 0 && (
          <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p
              className="text-xs mb-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Extras
            </p>
            <div className="flex flex-wrap gap-2">
              {extras.map((extra, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${goldColor}15`,
                    color: goldColor,
                    border: `1px solid ${goldColor}30`,
                  }}
                >
                  {extra}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Total Price */}
        <div
          className="mt-4 py-2 rounded-xl px-3"
          style={{
            background: `linear-gradient(135deg, rgba(201, 168, 76, 0.12), rgba(201, 168, 76, 0.04))`,
            border: `1px solid ${goldColor}40`,
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                Total Price
              </span>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Including all taxes &amp; fees</p>
            </div>
            <span
              className="text-3xl font-bold"
              style={{ color: goldColor, textShadow: `0 0 20px ${goldColor}40` }}
            >
              £{vehicle?.price ? Math.round(vehicle.price).toFixed(0) : "0"}
            </span>
          </div>
        </div>

        {/* ── Edit Previous Step Button (desktop only) ── */}
        {showBackButton && (
          <button
            onClick={onGoBack}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.09)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
            }}
          >
            <ChevronLeft size={16} />
            {backLabel}
          </button>
        )}

      </div>
    </div>
  );
}

export default StickyBookingSummary;
