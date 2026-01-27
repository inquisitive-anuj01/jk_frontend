import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    ArrowLeft,
    Car,
    Search,
    MapPin,
    Clock,
    Edit3,
    Trash2,
    Loader2,
    AlertTriangle,
    X,
    Check,
    RefreshCw,
    Plus,
    Filter,
} from "lucide-react";
import { pricingAPI, vehicleAPI } from "../../Utils/api";

// Status Badge
const StatusBadge = ({ status }) => (
    <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
    >
        {status === "active" ? "Active" : "Inactive"}
    </span>
);

// Tab Button
const TabButton = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 font-semibold text-sm rounded-lg transition-all ${active
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
    >
        {label}
    </button>
);

// Delete Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, vehicleName, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={28} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Pricing?</h3>
                    <p className="text-gray-500 text-sm mb-5">
                        Delete pricing configuration for <span className="font-semibold text-gray-700">{vehicleName}</span>?
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            Delete
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Pricing Card (for each vehicle's pricing)
const PricingCard = ({ pricing, pricingType, onEdit, onDelete }) => {
    const vehicleName = pricing.vehicle?.categoryName || "Unknown Vehicle";
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const imageUrl = pricing.vehicle?.image?.url
        ? `${API_BASE}/${pricing.vehicle.image.url.replace(/\\/g, "/")}`
        : null;

    const tiers = pricingType === "p2p" ? pricing.pointToPoint?.distanceTiers : [];
    const afterThreshold = pricing.pointToPoint?.afterDistanceThreshold;
    const afterRate = pricing.pointToPoint?.afterDistancePricePerMile;
    const hourlyData = pricing.hourly;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {imageUrl ? (
                            <img src={imageUrl} alt={vehicleName} className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Car size={20} className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 capitalize">{vehicleName}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <StatusBadge status={pricing.status} />
                            <span className="text-xs text-gray-500">{pricing.coverageZone}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(pricing)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(pricing)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {pricingType === "p2p" ? (
                    <div className="space-y-3">
                        {/* Distance Tiers Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 uppercase">
                                        <th className="pb-2 pr-3">From</th>
                                        <th className="pb-2 pr-3">To</th>
                                        <th className="pb-2">Charge</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {tiers?.map((tier, idx) => (
                                        <tr key={idx}>
                                            <td className="py-2 pr-3 text-gray-700">{tier.fromDistance} mi</td>
                                            <td className="py-2 pr-3 text-gray-700">{tier.toDistance} mi</td>
                                            <td className="py-2 font-semibold text-gray-900">
                                                £{tier.price}
                                                {tier.type === "per_mile" && <span className="text-xs text-gray-500">/mi</span>}
                                                {tier.type === "fixed" && idx === 0 && (
                                                    <span className="ml-1 text-xs text-blue-600">(Min)</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {afterThreshold && (
                                        <tr className="text-gray-500 italic">
                                            <td className="py-2 pr-3" colSpan={2}>After {afterThreshold} miles</td>
                                            <td className="py-2 font-semibold text-gray-700">£{afterRate}/mi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Additional Charges */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Extra Stop</span>
                                <span className="font-semibold text-gray-700">£{pricing.extras?.extraStopPrice || 0}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Child Seat</span>
                                <span className="font-semibold text-gray-700">£{pricing.extras?.childSeatPrice || 0}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Congestion</span>
                                <span className="font-semibold text-gray-700">£{pricing.extras?.congestionCharge || 0}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Parking Inc.</span>
                                <span className="font-semibold text-gray-700">
                                    {pricing.extras?.parkingIncluded ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Hourly Pricing Display
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg text-center">
                                <p className="text-xs text-blue-600 mb-1">Hourly Rate</p>
                                <p className="text-lg font-bold text-gray-900">£{hourlyData?.hourlyRate || 0}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-center">
                                <p className="text-xs text-green-600 mb-1">Min Hours</p>
                                <p className="text-lg font-bold text-gray-900">{hourlyData?.minimumHours || 0}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Additional Hour</span>
                                <span className="font-semibold">£{hourlyData?.additionalHourCharge || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Miles Included</span>
                                <span className="font-semibold">{hourlyData?.milesIncluded || 0} mi</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Excess Mileage</span>
                                <span className="font-semibold">£{hourlyData?.excessMileageCharge || 0}/mi</span>
                            </div>
                        </div>

                        {/* Additional Charges */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Extra Stop</span>
                                <span className="font-semibold text-gray-700">£{pricing.extras?.extraStopPrice || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Child Seat</span>
                                <span className="font-semibold text-gray-700">£{pricing.extras?.childSeatPrice || 0}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
                <span className={`flex items-center gap-1 ${pricing.displayVATInclusive ? "text-green-600" : ""}`}>
                    {pricing.displayVATInclusive ? <Check size={12} /> : <X size={12} />}
                    VAT Inc.
                </span>
                <span className={`flex items-center gap-1 ${pricing.priceRoundOff ? "text-green-600" : ""}`}>
                    {pricing.priceRoundOff ? <Check size={12} /> : <X size={12} />}
                    Round Off
                </span>
            </div>
        </motion.div>
    );
};

// Main Component
function AdminAllPricing() {
    const navigate = useNavigate();
    const [pricingList, setPricingList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("p2p"); // p2p or hourly
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, pricing: null });
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch all pricing
    const fetchPricing = async () => {
        setIsLoading(true);
        try {
            const response = await pricingAPI.getAllPricing({ pricingType: activeTab });
            if (response.success) {
                setPricingList(response.data);
                setFilteredList(response.data);
            }
        } catch (err) {
            console.error("Error fetching pricing:", err);
            toast.error("Failed to load pricing data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPricing();
    }, [activeTab]);

    // Filter by search
    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            setFilteredList(
                pricingList.filter(
                    (p) =>
                        p.vehicle?.categoryName?.toLowerCase().includes(query) ||
                        p.coverageZone?.toLowerCase().includes(query)
                )
            );
        } else {
            setFilteredList(pricingList);
        }
    }, [searchQuery, pricingList]);

    // Handle Edit
    const handleEdit = (pricing) => {
        navigate("/admin/pricing", { state: { vehicleId: pricing.vehicle?._id, tab: activeTab } });
    };

    // Handle Delete
    const handleDelete = async () => {
        if (!deleteModal.pricing) return;

        setIsDeleting(true);
        try {
            await pricingAPI.deletePricing(deleteModal.pricing._id);
            toast.success("Pricing deleted successfully");
            setPricingList((prev) => prev.filter((p) => p._id !== deleteModal.pricing._id));
            setDeleteModal({ isOpen: false, pricing: null });
        } catch (err) {
            console.error("Error deleting:", err);
            toast.error("Failed to delete pricing");
        } finally {
            setIsDeleting(false);
        }
    };

    // Stats
    const activePricing = pricingList.filter((p) => p.status === "active").length;
    const inactivePricing = pricingList.filter((p) => p.status !== "active").length;

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-center" autoClose={2000} />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/admin-dashboard")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">All Pricing</h1>
                                <p className="text-gray-500 text-xs md:text-sm hidden sm:block">
                                    View all vehicle pricing configurations
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/admin/pricing")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Pricing</span>
                        </button>
                    </div>

                    {/* Tabs and Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                        {/* Tabs */}
                        <div className="flex gap-2">
                            <TabButton
                                active={activeTab === "p2p"}
                                label="P2P"
                                onClick={() => setActiveTab("p2p")}
                            />
                            <TabButton
                                active={activeTab === "hourly"}
                                label="Hourly"
                                onClick={() => setActiveTab("hourly")}
                            />
                        </div>

                        {/* Search + Stats */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-44 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="hidden sm:flex gap-2 text-sm">
                                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium">
                                    Active: {activePricing}
                                </span>
                                <span className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg font-medium">
                                    Inactive: {inactivePricing}
                                </span>
                            </div>
                            <button
                                onClick={fetchPricing}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 size={40} className="text-blue-500 animate-spin mb-3" />
                        <p className="text-gray-500">Loading pricing data...</p>
                    </div>
                ) : filteredList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {filteredList.map((pricing) => (
                                <PricingCard
                                    key={pricing._id}
                                    pricing={pricing}
                                    pricingType={activeTab}
                                    onEdit={handleEdit}
                                    onDelete={(p) => setDeleteModal({ isOpen: true, pricing: p })}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {activeTab === "p2p" ? (
                                <MapPin size={28} className="text-gray-400" />
                            ) : (
                                <Clock size={28} className="text-gray-400" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No {activeTab === "p2p" ? "P2P" : "Hourly"} Pricing Found
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {searchQuery
                                ? "Try adjusting your search"
                                : "Start by adding pricing for your vehicles"}
                        </p>
                        <button
                            onClick={() => navigate("/admin/pricing")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Add Pricing
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, pricing: null })}
                    onConfirm={handleDelete}
                    vehicleName={deleteModal.pricing?.vehicle?.categoryName || "Unknown"}
                    isDeleting={isDeleting}
                />
            </AnimatePresence>
        </div>
    );
}

export default AdminAllPricing;
