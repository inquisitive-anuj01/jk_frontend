import React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  Briefcase,
  ChevronLeft,
  Info
} from "lucide-react";

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
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const backLabel = STEP_BACK_LABELS[currentStep];
  const showBackButton = currentStep >= 2 && !!onGoBack && !!backLabel;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{
        backgroundColor: "#141414",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Header - Minimalist Route Path */}
      <div
        className="p-5"
        style={{
          background: `linear-gradient(180deg, ${goldColor}12 0%, transparent 100%)`,
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="relative flex flex-col gap-4">
          <div className="flex gap-4 items-start relative">
            <div className="flex flex-col items-center pt-1.5">
              <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: goldColor }} />
              <div className="w-[1px] h-8 bg-gradient-to-b from-[#c9a84c] to-white/10 my-1" />
              <div className="w-2.5 h-2.5 rounded-full border border-white/20 bg-white/10" />
            </div>

            <div className="flex flex-col gap-5 flex-1">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.15em] mb-0.5 text-white/40 font-medium">Pick-up</span>
                <p className="text-sm text-white/90 font-medium leading-snug">{from || "Not specified"}</p>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.15em] mb-0.5 text-white/40 font-medium">Drop-off</span>
                <p className="text-sm text-white/90 font-medium leading-snug">{to || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-6">

        {/* DateTime Group - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40">
              <Calendar size={14} style={{ color: goldColor }} />
              <span className="text-[10px] uppercase tracking-wider">Date</span>
            </div>
            <p className="text-sm text-white font-medium pl-5">{formatDate(date) || "—"}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40">
              <Clock size={14} style={{ color: goldColor }} />
              <span className="text-[10px] uppercase tracking-wider">Time</span>
            </div>
            <p className="text-sm text-white font-medium pl-5">{time || "—"}</p>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Car size={16} style={{ color: goldColor }} />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">Vehicle Details</span>
            </div>
            {vehicle?.class && (
              <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-white/60 uppercase">{vehicle.class}</span>
            )}
          </div>
          <p className="text-sm text-white font-medium mb-2">{vehicle?.name || "No vehicle selected"}</p>

          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-white/50">
              <Users size={13} />
              <span className="text-xs">{vehicle?.pax || 0} Pax</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <Briefcase size={13} />
              <span className="text-xs">{vehicle?.luggage || 0} Bags</span>
            </div>
          </div>
        </div>

        {/* Passenger & Extras */}
        {(passengerName || (extras && extras.length > 0)) && (
          <div className="space-y-4 pt-2">
            {passengerName && (
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Lead Passenger</span>
                <p className="text-sm text-white/90">{passengerName}</p>
              </div>
            )}

            {extras && extras.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {extras.map((extra, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded text-white/70">
                    {extra}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pricing Section */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/30">Total Estimate</span>
              <div className="flex items-center gap-1 text-[10px] text-green-500/80">
                <Info size={10} />
                <span>All-inclusive price</span>
              </div>
            </div>
            <div className="text-right">

              <span
                className="text-3xl font-bold tracking-tighter"
                style={{
                  color: goldColor,
                  fontFamily: 'Inter, system-ui, sans-serif', // Modern, clean sans
                  fontVariantNumeric: 'tabular-nums',        // Fixes digit alignment
                  textShadow: `0 0 20px ${goldColor}30`,      // Soft premium glow
                }}
              >
                £{vehicle?.price ? vehicle.price.toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {showBackButton && (
          <button
            onClick={onGoBack}
            className="group w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
            }}
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default StickyBookingSummary;