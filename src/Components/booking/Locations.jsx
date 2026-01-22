import React, { useState, useEffect, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import {
  MapPin,
  Flag,
  Calendar,
  Clock,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- 1. CSS FOR GOOGLE MAPS AUTOCOMPLETE STYLING ---
// We inject this style to override the default Google Maps dropdown look.
const googleMapsStyles = `
  .pac-container {
    border-radius: 8px;
    margin-top: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    border: 1px solid #e5e7eb;
    font-family: inherit;
    z-index: 9999 !important; /* Ensure it sits above everything */
  }
  .pac-item {
    padding: 12px 16px;
    font-size: 16px; /* Bigger font */
    cursor: pointer;
    border-top: 1px solid #f3f4f6;
    line-height: 1.5;
  }
  .pac-item:first-child {
    border-top: none;
  }
  .pac-item:hover {
    background-color: #f9fafb;
  }
  .pac-item-query {
    font-size: 16px;
    color: #111827;
    font-weight: 500;
  }
  .pac-icon {
    margin-top: 4px;
  }
`;

// --- HELPER: CLICK OUTSIDE HOOK ---
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// --- CUSTOM TIME PICKER COMPONENT ---
const CustomTimePicker = ({ value, onChange, onClose }) => {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, onClose);

  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("00");
  const [ampm, setAmpm] = useState("PM");

  useEffect(() => {
    if (value) {
      const [time, period] = value.split(" ");
      const [h, m] = time.split(":");
      setHours(h);
      setMinutes(m);
      setAmpm(period);
    }
  }, [value]);

  const handleConfirm = () => {
    onChange(`${hours}:${minutes} ${ampm}`);
    onClose();
  };

  const hoursArr = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutesArr = [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
  ];

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-full right-0 mb-3 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 p-5"
    >
      <div className="absolute -bottom-2 right-8 w-5 h-5 bg-white transform rotate-45 border-r border-b border-gray-200"></div>

      <div className="flex justify-between text-center mb-4 font-semibold text-gray-500 text-sm tracking-wide uppercase">
        <span className="w-1/3">Hour</span>
        <span className="w-1/3">Min</span>
        <span className="w-1/3">Session</span>
      </div>

      <div className="flex justify-between h-40 overflow-hidden relative border-t border-b border-gray-100 py-2">
        {/* Hours */}
        <div className="w-1/3 overflow-y-auto scrollbar-hide text-center snap-y">
          {hoursArr.map((h) => (
            <div
              key={h}
              onClick={() => setHours(h)}
              className={`py-2 cursor-pointer transition-colors snap-center ${hours === h
                ? "font-bold text-2xl text-black"
                : "text-gray-300 text-lg"
                }`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Minutes */}
        <div className="w-1/3 overflow-y-auto scrollbar-hide text-center snap-y border-l border-r border-gray-100">
          {minutesArr.map((m) => (
            <div
              key={m}
              onClick={() => setMinutes(m)}
              className={`py-2 cursor-pointer transition-colors snap-center ${minutes === m
                ? "font-bold text-2xl text-black"
                : "text-gray-300 text-lg"
                }`}
            >
              {m}
            </div>
          ))}
        </div>

        {/* AM/PM */}
        <div className="w-1/3 flex flex-col justify-center items-center gap-3">
          {["AM", "PM"].map((p) => (
            <button
              key={p}
              onClick={() => setAmpm(p)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${ampm === p
                ? "bg-black text-white shadow-md"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full mt-5 bg-[#ff5e14] hover:bg-[#e04f0d] text-white font-bold py-3 rounded-lg shadow-md transition-transform active:scale-95"
      >
        Set Pickup Time
      </button>
    </div>
  );
};

// --- CUSTOM DATE PICKER COMPONENT (Fully Functional) ---
const CustomDatePicker = ({ value, onChange, onClose }) => {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, onClose);

  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  const today = new Date();

  // Normalize today to start of day for comparison
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Navigation Logic
  const prevMonth = () => {
    // Prevent going back if current month is today's month
    if (year === today.getFullYear() && month === today.getMonth()) return;
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    const selectedDate = new Date(year, month, day);
    // Prevent selecting past days
    if (selectedDate < today) return;

    onChange(selectedDate);
    onClose();
  };

  const isToday = (day) => {
    return (
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!value) return false;
    return (
      day === value.getDate() &&
      month === value.getMonth() &&
      year === value.getFullYear()
    );
  };

  const isPast = (day) => {
    const target = new Date(year, month, day);
    return target < today;
  };

  const isPrevDisabled =
    year === today.getFullYear() && month === today.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-full right-0 mb-3 w-[340px] bg-white shadow-2xl rounded-xl border border-gray-200 z-50 p-5"
    >
      <div className="absolute -bottom-2 right-8 w-5 h-5 bg-white transform rotate-45 border-r border-b border-gray-200"></div>

      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <span className="font-bold text-xl text-gray-800">
          {monthNames[month]} {year}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            disabled={isPrevDisabled}
            className={`p-2 rounded-full transition-colors ${isPrevDisabled
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center text-sm gap-y-2 gap-x-1">
        {/* Empty slots for previous month days */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Actual Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isPast(day);
          const selected = isSelected(day);
          const todayItem = isToday(day);

          return (
            <div
              key={day}
              onClick={() => !disabled && handleDayClick(day)}
              className={`
                h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200
                ${disabled
                  ? "text-gray-300 cursor-default"
                  : "cursor-pointer hover:bg-gray-100 text-gray-700"
                }
                ${selected
                  ? "bg-black text-white font-bold hover:bg-gray-800 shadow-md transform scale-105"
                  : ""
                }
                ${!selected && todayItem
                  ? "border border-blue-500 text-blue-600 font-bold"
                  : ""
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
function Locations({ data, updateData, onNext }) {
  const [serviceType, setServiceType] = useState("oneway");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Refs for Google Autocomplete
  const pickupAutocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);
  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);

  // Handle pickup place selection
  const handlePickupPlaceChanged = () => {
    if (pickupAutocompleteRef.current) {
      const place = pickupAutocompleteRef.current.getPlace();

      // For places like airports, use "name, formatted_address" format
      // This gives us "Heathrow Airport (LHR), Hounslow, UK" instead of just "Hounslow, UK"
      let fullAddress = "";

      if (place?.name && place?.formatted_address) {
        // Check if the name is already part of formatted_address
        if (place.formatted_address.includes(place.name)) {
          fullAddress = place.formatted_address;
        } else {
          // Combine name + formatted_address for places like airports
          fullAddress = `${place.name}, ${place.formatted_address}`;
        }
      } else if (place?.formatted_address) {
        fullAddress = place.formatted_address;
      } else if (place?.name) {
        fullAddress = place.name;
      }

      if (fullAddress) {
        updateData("pickup", fullAddress);
        if (pickupInputRef.current) {
          pickupInputRef.current.value = fullAddress;
        }
      }
    }
  };

  // Handle dropoff place selection
  const handleDropoffPlaceChanged = () => {
    if (dropoffAutocompleteRef.current) {
      const place = dropoffAutocompleteRef.current.getPlace();

      // For places like airports, use "name, formatted_address" format
      let fullAddress = "";

      if (place?.name && place?.formatted_address) {
        // Check if the name is already part of formatted_address
        if (place.formatted_address.includes(place.name)) {
          fullAddress = place.formatted_address;
        } else {
          // Combine name + formatted_address for places like airports
          fullAddress = `${place.name}, ${place.formatted_address}`;
        }
      } else if (place?.formatted_address) {
        fullAddress = place.formatted_address;
      } else if (place?.name) {
        fullAddress = place.name;
      }

      if (fullAddress) {
        updateData("dropoff", fullAddress);
        if (dropoffInputRef.current) {
          dropoffInputRef.current.value = fullAddress;
        }
      }
    }
  };

  // Update service type when tab changes
  const handleServiceTypeChange = (type) => {
    setServiceType(type);
    updateData("serviceType", type);
  };

  // Formatting Date
  const formatDateDisplay = (dateObj) => {
    if (!dateObj) return "";
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return dateObj.toLocaleDateString("en-US", options);
  };

  return (
    <>
      <style>{googleMapsStyles}</style>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 relative">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xl overflow-hidden shadow-sm border border-gray-200">
            🇬🇧
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide">
            Get a Price & Book
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex px-6 mt-4 gap-4">
          <button
            onClick={() => setServiceType("oneway")}
            className={`flex-1 py-3 text-center font-medium text-sm md:text-base border rounded transition-all ${serviceType === "oneway"
              ? "border-blue-500 text-blue-600 bg-blue-50/50 shadow-inner"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
          >
            One way
          </button>
          <button
            onClick={() => setServiceType("hourly")}
            className={`flex-1 py-3 text-center font-medium text-sm md:text-base border rounded transition-all ${serviceType === "hourly"
              ? "border-blue-500 text-blue-600 bg-blue-50/50 shadow-inner"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
          >
            By the hour
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* LOCATIONS */}
          <div className="relative">
            <div className="absolute left-[1.65rem] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-gray-300 z-0"></div>

            {/* PICKUP */}
            <div className="mb-4 relative z-10">
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                Where from?
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-4 z-10 text-gray-500">
                  <div className="w-3 h-3 rounded-full border-2 border-gray-600 bg-white"></div>
                </div>
                <Autocomplete
                  className="w-full"
                  onLoad={(autocomplete) => {
                    pickupAutocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePickupPlaceChanged}
                  options={{
                    componentRestrictions: { country: "gb" }, // UK only
                    types: ["geocode", "establishment"], // Addresses and places
                  }}
                >
                  <input
                    ref={pickupInputRef}
                    type="text"
                    placeholder="Enter pick-up location"
                    className="w-full pl-12 pr-10 py-4 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 font-medium transition-shadow"
                  />
                </Autocomplete>
                <div className="absolute right-4 text-gray-400">
                  <MapPin size={20} />
                </div>
              </div>
            </div>

            {/* DROPOFF */}
            <div className="relative z-10">
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                Where to?
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 z-10 text-gray-500">
                  <div className="w-3 h-3 rounded-full border-2 border-black bg-black"></div>
                </div>
                <Autocomplete
                  className="w-full"
                  onLoad={(autocomplete) => {
                    dropoffAutocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handleDropoffPlaceChanged}
                  options={{
                    componentRestrictions: { country: "gb" }, // UK only
                    types: ["geocode", "establishment"], // Addresses and places
                  }}
                >
                  <input
                    ref={dropoffInputRef}
                    type="text"
                    placeholder="Enter destination"
                    className="w-full pl-12 pr-10 py-4 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 font-medium transition-shadow"
                  />
                </Autocomplete>
                <div className="absolute right-4 text-gray-400">
                  <Flag size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* DATE */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                Date
              </label>
              <div
                className="relative w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 cursor-pointer hover:border-blue-400 flex items-center justify-between transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDatePicker(!showDatePicker);
                  setShowTimePicker(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-500" />
                  <span className="text-gray-800 font-medium">
                    {formatDateDisplay(data.pickupDate)}
                  </span>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>

              {showDatePicker && (
                <CustomDatePicker
                  value={data.pickupDate}
                  onChange={(d) => updateData("pickupDate", d)}
                  onClose={() => setShowDatePicker(false)}
                />
              )}
            </div>

            {/* TIME */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">
                Pickup time
              </label>
              <div
                className="relative w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 cursor-pointer hover:border-blue-400 flex items-center justify-between transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTimePicker(!showTimePicker);
                  setShowDatePicker(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-500" />
                  <span className="text-gray-800 font-medium">{data.pickupTime}</span>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>

              {showTimePicker && (
                <CustomTimePicker
                  value={data.pickupTime}
                  onChange={(t) => updateData("pickupTime", t)}
                  onClose={() => setShowTimePicker(false)}
                />
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Chauffeur will wait 15 minutes free of charge.
          </p>

          <button
            onClick={onNext}
            className="w-full mt-6 bg-[#1a73e8] hover:bg-[#155db5] text-white font-bold py-4 rounded shadow-lg flex items-center justify-center gap-3 px-6 transition-transform transform active:scale-[0.99]"
          >
            <span>GET MY PRICES</span>
            <ArrowRight size={20} />
          </button>

          <div className="text-center mt-6 border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-sm">Need more help? Call Us</p>
            <p className="font-bold text-gray-800 flex items-center justify-center gap-2 mt-1">
              🇬🇧 +44 (0) 203 475 9906
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Locations;
