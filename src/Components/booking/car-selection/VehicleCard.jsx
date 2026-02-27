import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, ChevronDown, ChevronUp, Check } from "lucide-react";

const VehicleCard = ({ vehicle, isSelected, onSelect, isDisabled }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const pricing = vehicle.pricing;

  // Auto-expand breakdown when card is selected, close when deselected
  React.useEffect(() => {
    setShowBreakdown(isSelected);
  }, [isSelected]);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageUrl = vehicle.image?.url
    ? `${API_BASE}/${vehicle.image.url.replace(/\\/g, "/")}`
    : "/placeholder-car.png";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onClick={() => !isDisabled && onSelect(vehicle)}
      className={`relative mb-4 w-full transition-all duration-300 overflow-hidden ${isDisabled ? "opacity-30 grayscale pointer-events-none" : "cursor-pointer"
        }`}
      style={{
        backgroundColor: "#111",
        borderRadius: "14px",
        border: isSelected ? "1.5px solid #c9a84c" : "1.5px solid #2e2e2e",
        boxShadow: isSelected ? "0 0 20px rgba(201, 168, 76, 0.15)" : "none",
      }}
    >
      {/* 1. TOP STRIP (Image + Brand Info) */}
      <div className="flex items-center gap-3 p-4 border-b border-[#222]" style={{ background: "#161616" }}>

        {/* Image — left side, smaller on mobile, larger on desktop */}
        <div className="w-24 h-16 md:w-40 md:h-[72px] shrink-0 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={vehicle.categoryName}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text block */}
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontSize: "clamp(8px, 2vw, 11px)",
              letterSpacing: "clamp(2px, 0.5vw, 4px)",
              color: "#c9a84c",
              textTransform: "uppercase",
              fontWeight: "700",
              fontFamily: "'Space Mono', monospace",
            }}
            className="md:text-[10px] md:tracking-[4px]"
          >
            {vehicle.vehicleType}
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(14px, 4vw, 20px)",
              color: "#fff",
              lineHeight: "1.2",
            }}
            className="md:text-[22px]"
          >
            {vehicle.categoryName}
          </div>
          <div
            style={{
              fontSize: "clamp(10px, 2.5vw, 14px)",
              color: "#777"
            }}
            className="md:text-[13px]"
          >
            {vehicle.categoryDetails}
          </div>
        </div>

        {/* Chevron button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            if (!isSelected) {
              onSelect(vehicle);
            }
            setShowBreakdown(!showBreakdown);
          }}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1.5px solid #c9a84c",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
          className="hover:bg-[#c9a84c] hover:text-black transition-all duration-200"
        >
          <motion.div
            animate={{ rotate: showBreakdown ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={18} style={{ color: "#c9a84c" }} />
          </motion.div>
        </motion.button>

      </div>

      {/* 2. BOTTOM STRIP (Specs + Price) */}
      <div className="flex items-center justify-between p-4 px-5 md:p-6 md:px-8">
        <div className="flex items-center gap-4 md:gap-10">
          {/* Passengers Group */}
          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="w-6 h-6 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "rgba(201, 168, 76, 0.1)",
                border: "1px solid rgba(201, 168, 76, 0.2)"
              }}
            >
              <Users className="w-3 h-3 md:w-5 md:h-5" style={{ color: "#c9a84c" }} />
            </div>
            <div className="flex flex-col justify-center">
              <p
                className="text-[8px] md:text-[10px] leading-none mb-1"
                style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}
              >
                Passengers
              </p>
              <span className="text-xs md:text-sm leading-none" style={{ color: "#fff", fontWeight: "700" }}>
                {vehicle.numberOfPassengers}
              </span>
            </div>
          </div>

          {/* Luggage Group */}
          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="w-6 h-6 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "rgba(201, 168, 76, 0.1)",
                border: "1px solid rgba(201, 168, 76, 0.2)"
              }}
            >
              <Briefcase className="w-3 h-3 md:w-5 md:h-5" style={{ color: "#c9a84c" }} />
            </div>
            <div className="flex flex-col justify-center">
              <p
                className="text-[8px] md:text-[10px] leading-none mb-1"
                style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}
              >
                Luggage
              </p>
              <span className="text-xs md:text-sm leading-none" style={{ color: "#fff", fontWeight: "700" }}>
                {vehicle.numberOfBigLuggage}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[9px] md:text-[10px]" style={{ color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "700" }}>
            Total Price
          </p>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: "800",
              fontSize: "clamp(18px, 5vw, 26px)",
              color: "#c9a84c",
              textShadow: "0 0 20px rgba(201, 168, 76, 0.3)",
            }}
          >
            £{pricing?.totalPrice?.toFixed(2)}
          </div>
        </div>
      </div>


      {/* 4. EXPANDABLE SECTION (Maintains Editorial Logic) */}
      <AnimatePresence>
        {showBreakdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[#222] bg-[#0d0d0d]"
          >
            <div className="p-5 space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span style={{ color: "white" }}>BASE FARE</span>
                  <span style={{ color: "#aaa" }}>£{(pricing?.totalPrice * 0.8).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span style={{ color: "white" }}>TAX / VAT</span>
                  <span style={{ color: "#aaa" }}>£{(pricing?.totalPrice * 0.2).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#222] flex justify-between text-[12px] font-bold">
                  <span style={{ color: "#c9a84c" }}>GRAND TOTAL</span>
                  <span style={{ color: "#fff" }}>£{pricing?.totalPrice?.toFixed(2)}</span>
                </div>
              </div>

              {/* Company Features */}
              {vehicle.companyFeatures?.length > 0 && (
                <div className="pt-3 border-t border-[#222]">
                  <p className="text-[9px] font-black uppercase text-[#c9a84c] tracking-widest mb-2">
                    Included Features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.companyFeatures.slice(0, 4).map((feat, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "rgba(201, 168, 76, 0.08)",
                          color: "#c9a84c",
                          border: "1px solid rgba(201, 168, 76, 0.15)",
                        }}
                      >
                        <Check size={10} style={{ color: "#c9a84c" }} /> {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VehicleCard;
