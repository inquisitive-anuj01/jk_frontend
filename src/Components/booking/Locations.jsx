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
  Timer,
} from "lucide-react";

// --- 1. CSS FOR GOOGLE MAPS AUTOCOMPLETE STYLING (DARK THEME) ---
const googleMapsStyles = `
  .pac-container {
    border-radius: 12px;
    margin-top: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.1);
    background-color: #1a1a1a !important;
    font-family: inherit;
    z-index: 9999 !important;
  }
  .pac-item {
    padding: 12px 16px;
    font-size: 16px;
    cursor: pointer;
    border-top: 1px solid rgba(255,255,255,0.05);
    line-height: 1.5;
    color: #e5e5e5 !important;
    background-color: #1a1a1a !important;
  }
  .pac-item:first-child {
    border-top: none;
  }
  .pac-item:hover {
    background-color: #2a2a2a !important;
  }
  .pac-item-query {
    font-size: 16px;
    color: #ffffff !important;
    font-weight: 500;
  }
  .pac-icon {
    margin-top: 4px;
    filter: brightness(2);
  }
  .pac-item-selected {
    background-color: #2a2a2a !important;
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

// --- CUSTOM TIME PICKER COMPONENT (DARK) ---
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
    "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55",
  ];

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-full right-0 mb-3 w-80 shadow-2xl rounded-xl z-50 p-5"
      style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="absolute -bottom-2 right-8 w-5 h-5 transform rotate-45" style={{ backgroundColor: '#1a1a1a', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>

      <div className="flex justify-between text-center mb-4 font-semibold text-sm tracking-wide uppercase" style={{ color: 'var(--color-primary)' }}>
        <span className="w-1/3">Hour</span>
        <span className="w-1/3">Min</span>
        <span className="w-1/3">Session</span>
      </div>

      <div className="flex justify-between h-40 overflow-hidden relative py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Hours */}
        <div className="w-1/3 overflow-y-auto scrollbar-hide text-center snap-y">
          {hoursArr.map((h) => (
            <div
              key={h}
              onClick={() => setHours(h)}
              className={`py-2 cursor-pointer transition-colors snap-center ${hours === h
                ? "font-bold text-2xl"
                : "text-lg"
                }`}
              style={{ color: hours === h ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)' }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Minutes */}
        <div className="w-1/3 overflow-y-auto scrollbar-hide text-center snap-y" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          {minutesArr.map((m) => (
            <div
              key={m}
              onClick={() => setMinutes(m)}
              className={`py-2 cursor-pointer transition-colors snap-center ${minutes === m
                ? "font-bold text-2xl"
                : "text-lg"
                }`}
              style={{ color: minutes === m ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)' }}
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
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={
                ampm === p
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }
                  : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full mt-5 font-bold py-3 rounded-lg shadow-md transition-transform active:scale-95"
        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
      >
        Set Pickup Time
      </button>
    </div>
  );
};

// --- CUSTOM DATE PICKER COMPONENT (DARK) ---
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
    if (year === today.getFullYear() && month === today.getMonth()) return;
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    const selectedDate = new Date(year, month, day);
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-full right-0 mb-3 w-[340px] shadow-2xl rounded-xl z-50 p-5"
      style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="absolute -bottom-2 right-8 w-5 h-5 transform rotate-45" style={{ backgroundColor: '#1a1a1a', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>

      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <span className="font-bold text-xl text-white">
          {monthNames[month]} {year}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            disabled={isPrevDisabled}
            className={`p-2 rounded-full transition-colors ${isPrevDisabled
              ? "cursor-not-allowed"
              : "hover:bg-white/10"
              }`}
            style={{ color: isPrevDisabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
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
              className="h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200"
              style={
                selected
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', fontWeight: 'bold', cursor: 'pointer' }
                  : !selected && todayItem
                    ? { border: '1px solid var(--color-primary)', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer' }
                    : disabled
                      ? { color: 'rgba(255,255,255,0.15)', cursor: 'default' }
                      : { color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }
              }
              onMouseEnter={(e) => {
                if (!disabled && !selected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                if (!disabled && !selected) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- CUSTOM DURATION PICKER COMPONENT (DARK) ---
const CustomDurationPicker = ({ value, onChange, onClose }) => {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, onClose);

  const hoursOptions = Array.from({ length: 23 }, (_, i) => i + 2);

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-full right-0 mb-3 w-64 shadow-2xl rounded-xl z-50 p-4 max-h-80 overflow-hidden"
      style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="absolute -bottom-2 right-8 w-5 h-5 transform rotate-45" style={{ backgroundColor: '#1a1a1a', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>

      <h4 className="font-semibold mb-3 text-center" style={{ color: 'var(--color-primary)' }}>Select Duration</h4>

      <div className="overflow-y-auto max-h-52 scrollbar-hide">
        {hoursOptions.map((hour) => (
          <div
            key={hour}
            onClick={() => {
              onChange(hour);
              onClose();
            }}
            className="py-3 px-4 cursor-pointer transition-all rounded-lg mb-1 text-center"
            style={
              value === hour
                ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', fontWeight: 'bold' }
                : { color: 'rgba(255,255,255,0.7)' }
            }
            onMouseEnter={(e) => {
              if (value !== hour) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              if (value !== hour) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {hour} hours
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
function Locations({ data, updateData, onNext }) {
  const [serviceType, setServiceType] = useState(data.serviceType || "oneway");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [errors, setErrors] = useState({});

  // Refs for Google Autocomplete
  const pickupAutocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);
  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);

  // Handle pickup place selection
  const handlePickupPlaceChanged = () => {
    if (pickupAutocompleteRef.current) {
      const place = pickupAutocompleteRef.current.getPlace();

      let fullAddress = "";

      if (place?.name && place?.formatted_address) {
        if (place.formatted_address.includes(place.name)) {
          fullAddress = place.formatted_address;
        } else {
          fullAddress = `${place.name}, ${place.formatted_address}`;
        }
      } else if (place?.formatted_address) {
        fullAddress = place.formatted_address;
      } else if (place?.name) {
        fullAddress = place.name;
      }

      if (fullAddress) {
        updateData("pickup", fullAddress);
        clearError("pickup");
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

      let fullAddress = "";

      if (place?.name && place?.formatted_address) {
        if (place.formatted_address.includes(place.name)) {
          fullAddress = place.formatted_address;
        } else {
          fullAddress = `${place.name}, ${place.formatted_address}`;
        }
      } else if (place?.formatted_address) {
        fullAddress = place.formatted_address;
      } else if (place?.name) {
        fullAddress = place.name;
      }

      if (fullAddress) {
        updateData("dropoff", fullAddress);
        clearError("dropoff");
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

    if (type === "hourly" && !data.hours) {
      updateData("hours", 2);
    }

    if (type === "hourly") {
      updateData("dropoff", "");
      if (dropoffInputRef.current) {
        dropoffInputRef.current.value = "";
      }
    }
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

  // Clear error when user types
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate form before proceeding
  const validateAndProceed = () => {
    const newErrors = {};

    if (!data.pickup || !data.pickup.trim()) {
      newErrors.pickup = "Pickup location is required";
    }

    if (serviceType === "oneway" && (!data.dropoff || !data.dropoff.trim())) {
      newErrors.dropoff = "Drop-off location is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <>
      <style>{googleMapsStyles}</style>

      <div className="rounded-xl shadow-2xl overflow-hidden relative" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl overflow-hidden shadow-sm" style={{ backgroundColor: 'rgba(215,183,94,0.1)', border: '1px solid rgba(215,183,94,0.2)' }}>
            🇬🇧
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
            Get a Price & Book
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex px-6 mt-4 gap-4">
          <button
            onClick={() => handleServiceTypeChange("oneway")}
            className="flex-1 py-3 text-center font-medium text-sm md:text-base rounded transition-all"
            style={
              serviceType === "oneway"
                ? { border: '1px solid var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'rgba(215,183,94,0.08)' }
                : { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
            }
          >
            One way
          </button>
          <button
            onClick={() => handleServiceTypeChange("hourly")}
            className="flex-1 py-3 text-center font-medium text-sm md:text-base rounded transition-all"
            style={
              serviceType === "hourly"
                ? { border: '1px solid var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'rgba(215,183,94,0.08)' }
                : { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
            }
          >
            By the hour
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* LOCATIONS */}
          <div className="relative">

            {/* PICKUP */}
            <div className="mb-4 relative z-10">
              <label className="block text-xs font-bold mb-1 ml-1" style={{ color: 'var(--color-primary)' }}>
                Where from?
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-4 z-10">
                  <div className="w-3 h-3 rounded-full border-2 bg-transparent" style={{ borderColor: 'var(--color-primary)' }}></div>
                </div>
                <Autocomplete
                  className="w-full"
                  onLoad={(autocomplete) => {
                    pickupAutocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePickupPlaceChanged}
                  options={{
                    componentRestrictions: { country: "gb" },
                    types: ["geocode", "establishment"],
                  }}
                >
                  <input
                    ref={pickupInputRef}
                    type="text"
                    placeholder="Enter pick-up location"
                    className="w-full pl-12 pr-10 py-4 rounded font-medium transition-shadow outline-none"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: errors.pickup ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  />
                </Autocomplete>
                <div className="absolute right-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <MapPin size={20} />
                </div>
              </div>
              {errors.pickup && (
                <p className="text-sm text-red-400 mt-1 ml-1">{errors.pickup}</p>
              )}
            </div>

            {/* DROPOFF - Only show for one-way booking */}
            {serviceType === "oneway" && (
              <div className="relative z-10">
                <label className="block text-xs font-bold mb-1 ml-1" style={{ color: 'var(--color-primary)' }}>
                  Where to?
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 z-10">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                  </div>
                  <Autocomplete
                    className="w-full"
                    onLoad={(autocomplete) => {
                      dropoffAutocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={handleDropoffPlaceChanged}
                    options={{
                      componentRestrictions: { country: "gb" },
                      types: ["geocode", "establishment"],
                    }}
                  >
                    <input
                      ref={dropoffInputRef}
                      type="text"
                      placeholder="Enter destination"
                      className="w-full pl-12 pr-10 py-4 rounded font-medium transition-shadow outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: errors.dropoff ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                      }}
                    />
                  </Autocomplete>
                  <div className="absolute right-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <Flag size={20} />
                  </div>
                </div>
                {errors.dropoff && (
                  <p className="text-sm text-red-400 mt-1 ml-1">{errors.dropoff}</p>
                )}
              </div>
            )}

            {/* DURATION - Only show for hourly booking */}
            {serviceType === "hourly" && (
              <div className="relative z-10">
                <label className="block text-xs font-bold mb-1 ml-1" style={{ color: 'var(--color-primary)' }}>
                  Duration
                </label>
                <div
                  className="relative w-full rounded px-4 py-4 cursor-pointer flex items-center justify-between transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDurationPicker(!showDurationPicker);
                    setShowDatePicker(false);
                    setShowTimePicker(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Timer size={18} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-white font-medium">
                      {data.hours || 2} hours
                    </span>
                  </div>
                  <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>

                {showDurationPicker && (
                  <CustomDurationPicker
                    value={data.hours || 2}
                    onChange={(h) => updateData("hours", h)}
                    onClose={() => setShowDurationPicker(false)}
                  />
                )}
              </div>
            )}
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* DATE */}
            <div className="relative">
              <label className="block text-xs font-bold mb-1 ml-1" style={{ color: 'var(--color-primary)' }}>
                Date
              </label>
              <div
                className="relative w-full rounded px-4 py-3 cursor-pointer flex items-center justify-between transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDatePicker(!showDatePicker);
                  setShowTimePicker(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-white font-medium">
                    {formatDateDisplay(data.pickupDate)}
                  </span>
                </div>
                <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
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
              <label className="block text-xs font-bold mb-1 ml-1" style={{ color: 'var(--color-primary)' }}>
                Pickup time
              </label>
              <div
                className="relative w-full rounded px-4 py-3 cursor-pointer flex items-center justify-between transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTimePicker(!showTimePicker);
                  setShowDatePicker(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-white font-medium">{data.pickupTime}</span>
                </div>
                <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
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

          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {serviceType === "hourly"
              ? "Hourly bookings include chauffeur at your disposal for the selected duration."
              : "Chauffeur will wait 15 minutes free of charge."}
          </p>

          <button
            onClick={validateAndProceed}
            className="w-full mt-6 font-bold py-4 rounded shadow-lg flex items-center justify-center gap-3 px-6 transition-transform transform active:scale-[0.99]"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
          >
            <span>GET MY PRICES</span>
            <ArrowRight size={20} />
          </button>

          <div className="text-center mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Need more help? Call Us</p>
            <p className="font-bold flex items-center justify-center gap-2 mt-1" style={{ color: 'var(--color-primary)' }}>
              🇬🇧 +44 (0) 203 475 9906
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Locations;
