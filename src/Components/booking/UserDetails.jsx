import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  User,
  Mail,
  Phone,
  Users,
  Briefcase,
  Plane,
  UserPlus,
  MessageSquare,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Country codes data with flags
const countryCodes = [
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+353", country: "IE", flag: "🇮🇪" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+92", country: "PK", flag: "🇵🇰" },
  { code: "+880", country: "BD", flag: "🇧🇩" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+234", country: "NG", flag: "🇳🇬" },
];

// Country Code Dropdown Component
const CountryCodeDropdown = ({ value, onChange, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCountry = countryCodes.find((c) => c.code === value) || countryCodes[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-3.5 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-700 hover:bg-gray-100 transition-colors min-w-[90px]"
      >
        <span className="text-xl">{selectedCountry.flag}</span>
        <span className="text-sm font-medium">{selectedCountry.code}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 w-48 max-h-60 overflow-y-auto"
          >
            {countryCodes.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors
                  ${value === country.code ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
              >
                <span className="text-xl">{country.flag}</span>
                <span className="font-medium">{country.code}</span>
                <span className="text-gray-400 text-sm">({country.country})</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, label, icon: Icon }) => (
  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group">
    <div className="flex items-center gap-3">
      {Icon && <Icon size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />}
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    <div
      className={`relative w-12 h-6 rounded-full transition-colors duration-300
        ${checked ? "bg-blue-500" : "bg-gray-300"}`}
      onClick={() => onChange(!checked)}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
        animate={{ left: checked ? "28px" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  </label>
);

// Input Field Component with optional filtering
const InputField = ({
  label,
  icon: Icon,
  required,
  error,
  className = "",
  filterType, // 'name' for letters only, 'phone' for digits only
  onChange,
  ...props
}) => {
  // Handle input with optional filtering
  const handleChange = (e) => {
    let value = e.target.value;

    if (filterType === 'name') {
      // Remove digits and special chars (allow letters, spaces, hyphens, apostrophes)
      value = value.replace(/[^A-Za-z\s\-']/g, '');
    } else if (filterType === 'phone') {
      // Remove non-digits
      value = value.replace(/\D/g, '');
    }

    // Create a synthetic event with filtered value
    const syntheticEvent = { ...e, target: { ...e.target, value } };
    onChange?.(syntheticEvent);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon size={16} className="text-gray-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        onChange={handleChange}
        className={`w-full px-4 py-3.5 border rounded-xl outline-none transition-all duration-200
          ${error
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          }
          placeholder:text-gray-400`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Select Field Component
const SelectField = ({ label, icon: Icon, required, options, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {Icon && <Icon size={16} className="text-gray-400" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none appearance-none bg-white
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

// Phone Input Component
const PhoneInput = ({ countryCode, onCountryCodeChange, phone, onPhoneChange, label, required, error }) => {
  // Filter to only allow digits
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    onPhoneChange(digitsOnly);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Phone size={16} className="text-gray-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <CountryCodeDropdown value={countryCode} onChange={onCountryCodeChange} />
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Enter phone number"
          inputMode="numeric"
          pattern="[0-9]*"
          className={`flex-1 px-4 py-3.5 border border-gray-200 rounded-r-xl outline-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
            ${error ? "border-red-300 bg-red-50" : ""}`}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Main UserDetails Component
function UserDetails({ data, updateData, onNext, onBack, isLoading = false }) {
  // Form state
  const [formData, setFormData] = useState({
    firstName: data?.passengerDetails?.firstName || "",
    lastName: data?.passengerDetails?.lastName || "",
    email: data?.passengerDetails?.email || "",
    countryCode: data?.passengerDetails?.countryCode || "+44",
    phone: data?.passengerDetails?.phone || "",
    numberOfPassengers: data?.passengerDetails?.numberOfPassengers || 1,
    numberOfSuitcases: data?.passengerDetails?.numberOfSuitcases || 0,
    isBookingForSomeoneElse: data?.passengerDetails?.isBookingForSomeoneElse || false,
    guestFirstName: data?.passengerDetails?.guestFirstName || "",
    guestLastName: data?.passengerDetails?.guestLastName || "",
    guestCountryCode: data?.passengerDetails?.guestCountryCode || "+44",
    guestPhone: data?.passengerDetails?.guestPhone || "",
    guestEmail: data?.passengerDetails?.guestEmail || "",
    isAirportPickup: data?.flightDetails?.isAirportPickup || false,
    flightNumber: data?.flightDetails?.flightNumber || "",
    nameBoard: data?.flightDetails?.nameBoard || "",
    additionalRequirements: data?.specialInstructions || "",
  });

  const [errors, setErrors] = useState({});

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Regex patterns
    const namePattern = /^[A-Za-z\s\-']+$/; // Letters, spaces, hyphens, apostrophes only
    const phonePattern = /^\d+$/; // Digits only
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!namePattern.test(formData.firstName.trim())) {
      newErrors.firstName = "First name can only contain letters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!namePattern.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phonePattern.test(formData.phone.trim())) {
      newErrors.phone = "Phone number can only contain digits";
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = "Phone number is too short";
    }

    // Guest validation (when booking for someone else)
    if (formData.isBookingForSomeoneElse) {
      // Guest first name
      if (!formData.guestFirstName.trim()) {
        newErrors.guestFirstName = "Passenger's first name is required";
      } else if (!namePattern.test(formData.guestFirstName.trim())) {
        newErrors.guestFirstName = "First name can only contain letters";
      }

      // Guest last name
      if (!formData.guestLastName.trim()) {
        newErrors.guestLastName = "Passenger's last name is required";
      } else if (!namePattern.test(formData.guestLastName.trim())) {
        newErrors.guestLastName = "Last name can only contain letters";
      }

      // Guest email
      if (!formData.guestEmail.trim()) {
        newErrors.guestEmail = "Passenger's email is required";
      } else if (!emailPattern.test(formData.guestEmail)) {
        newErrors.guestEmail = "Please enter a valid email address";
      }

      // Guest phone (if provided, must be valid)
      if (formData.guestPhone.trim() && !phonePattern.test(formData.guestPhone.trim())) {
        newErrors.guestPhone = "Phone number can only contain digits";
      }
    }

    // Airport pickup validation
    if (formData.isAirportPickup) {
      if (!formData.flightNumber.trim()) newErrors.flightNumber = "Flight number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    // Prepare the data objects
    const passengerDetailsData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      countryCode: formData.countryCode,
      phone: formData.phone,
      numberOfPassengers: formData.numberOfPassengers,
      numberOfSuitcases: formData.numberOfSuitcases,
      isBookingForSomeoneElse: formData.isBookingForSomeoneElse,
      guestFirstName: formData.guestFirstName,
      guestLastName: formData.guestLastName,
      guestCountryCode: formData.guestCountryCode,
      guestPhone: formData.guestPhone,
      guestEmail: formData.guestEmail,
    };

    const flightDetailsData = {
      isAirportPickup: formData.isAirportPickup,
      flightNumber: formData.flightNumber,
      nameBoard: formData.nameBoard,
    };

    const specialInstructionsData = formData.additionalRequirements;

    // Update parent data
    updateData("passengerDetails", passengerDetailsData);
    updateData("flightDetails", flightDetailsData);
    updateData("specialInstructions", specialInstructionsData);

    // Pass the form data directly to onNext to avoid race condition with state updates
    onNext({
      passengerDetails: passengerDetailsData,
      flightDetails: flightDetailsData,
      specialInstructions: specialInstructionsData,
    });
  };

  // Generate passenger/suitcase options
  const passengerOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} ${i === 0 ? "Passenger" : "Passengers"}`,
  }));

  const suitcaseOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: `${i} ${i === 1 ? "Suitcase" : "Suitcases"}`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <User size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Details</h1>
          <p className="text-gray-500 mt-2">Please provide your contact information</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 space-y-6"
        >
          {/* Personal Information Section */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
              Personal Information
            </h2>

            {/* Name Fields - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                icon={User}
                required
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                error={errors.firstName}
                filterType="name"
              />
              <InputField
                label="Last Name"
                icon={User}
                required
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                error={errors.lastName}
                filterType="name"
              />
            </div>

            {/* Phone with Country Code */}
            <PhoneInput
              countryCode={formData.countryCode}
              onCountryCodeChange={(code) => updateField("countryCode", code)}
              phone={formData.phone}
              onPhoneChange={(phone) => updateField("phone", phone)}
              label="Contact Number"
              required
              error={errors.phone}
            />

            {/* Email */}
            <InputField
              label="Email Address"
              icon={Mail}
              required
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
            />

            {/* Passengers & Suitcases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Number of Passengers"
                icon={Users}
                required
                value={formData.numberOfPassengers}
                onChange={(e) => updateField("numberOfPassengers", parseInt(e.target.value))}
                options={passengerOptions}
              />
              <SelectField
                label="Number of Suitcases"
                icon={Briefcase}
                required
                value={formData.numberOfSuitcases}
                onChange={(e) => updateField("numberOfSuitcases", parseInt(e.target.value))}
                options={suitcaseOptions}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Toggle Options */}
          <div className="space-y-3">
            <ToggleSwitch
              checked={formData.isBookingForSomeoneElse}
              onChange={(checked) => updateField("isBookingForSomeoneElse", checked)}
              label="Booking for someone else?"
              icon={UserPlus}
            />

            <ToggleSwitch
              checked={formData.isAirportPickup}
              onChange={(checked) => updateField("isAirportPickup", checked)}
              label="Airport Pickup?"
              icon={Plane}
            />
          </div>

          {/* Conditional: Guest Details */}
          <AnimatePresence>
            {formData.isBookingForSomeoneElse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 space-y-4 border border-purple-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <UserPlus size={18} className="text-purple-500" />
                    Passenger Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Passenger's First Name"
                      required
                      placeholder="Enter first name"
                      value={formData.guestFirstName}
                      onChange={(e) => updateField("guestFirstName", e.target.value)}
                      error={errors.guestFirstName}
                      filterType="name"
                    />
                    <InputField
                      label="Passenger's Last Name"
                      required
                      placeholder="Enter last name"
                      value={formData.guestLastName}
                      onChange={(e) => updateField("guestLastName", e.target.value)}
                      error={errors.guestLastName}
                      filterType="name"
                    />
                  </div>

                  <PhoneInput
                    countryCode={formData.guestCountryCode}
                    onCountryCodeChange={(code) => updateField("guestCountryCode", code)}
                    phone={formData.guestPhone}
                    onPhoneChange={(phone) => updateField("guestPhone", phone)}
                    label="Passenger's Contact Number"
                    error={errors.guestPhone}
                  />

                  <InputField
                    label="Passenger's Email"
                    icon={Mail}
                    required
                    type="email"
                    placeholder="Enter passenger's email"
                    value={formData.guestEmail}
                    onChange={(e) => updateField("guestEmail", e.target.value)}
                    error={errors.guestEmail}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conditional: Airport Pickup Details */}
          <AnimatePresence>
            {formData.isAirportPickup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl p-5 space-y-4 border border-sky-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Plane size={18} className="text-sky-500" />
                    Flight Details
                  </h3>

                  <InputField
                    label="Flight Number"
                    icon={Plane}
                    required
                    placeholder="e.g., BA1234"
                    value={formData.flightNumber}
                    onChange={(e) => updateField("flightNumber", e.target.value.toUpperCase())}
                    error={errors.flightNumber}
                  />

                  <InputField
                    label="Name Board"
                    placeholder="Name to display on board"
                    value={formData.nameBoard}
                    onChange={(e) => updateField("nameBoard", e.target.value)}
                  />

                  <p className="text-sm text-sky-600 bg-sky-100 px-4 py-2 rounded-lg">
                    💡 Don't worry! Even if your flight is delayed, we'll monitor your flight and arrive on time, every time.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Additional Requirements */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare size={16} className="text-gray-400" />
              Additional Requirements
            </label>
            <textarea
              placeholder="Enter any special requirements or notes..."
              rows={3}
              value={formData.additionalRequirements}
              onChange={(e) => updateField("additionalRequirements", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none resize-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mt-8"
        >
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 border-2 border-gray-200 rounded-2xl
              font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <ArrowLeft size={20} />
            Back to Cars
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl
              font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-600'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Proceed
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default UserDetails;