import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Car,
    DollarSign,
    Clock,
    Users,
    LogOut,
    Menu,
    X,
    TrendingUp,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    ChevronRight,
    Settings,
    MapPin,
} from "lucide-react";
import { adminAPI } from "../Utils/api";

// Sidebar Navigation Items
const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/admin-dashboard" },
    { id: "bookings", icon: Calendar, label: "All Bookings", path: "/admin/bookings" },
    { id: "p2p-pricing", icon: DollarSign, label: "Set P2P Pricing", path: "/admin/p2p-pricing" },
    { id: "hourly-pricing", icon: Clock, label: "Set Hourly Pricing", path: "/admin/hourly-pricing" },
    { id: "vehicles", icon: Car, label: "All Cars", path: "/admin/vehicles" },
];

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, trend, bgGradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl transition-all duration-300`}
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${bgGradient}`}>
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <span className={`text-sm font-medium flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
);

// Recent Booking Row
const RecentBookingRow = ({ booking }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin size={18} className="text-blue-600" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">
                        {booking.passengerDetails?.firstName} {booking.passengerDetails?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {booking.pickup?.address?.substring(0, 30)}...
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-gray-900">£{booking.pricing?.totalPrice?.toFixed(2) || '0.00'}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                </span>
            </div>
        </div>
    );
};

function AdminDashboard() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeNav, setActiveNav] = useState("dashboard");
    const [isLoading, setIsLoading] = useState(true);
    const [adminInfo, setAdminInfo] = useState(null);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    // Load admin info and stats on mount
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // Check if logged in
                const adminData = localStorage.getItem("adminInfo");
                if (!adminData) {
                    navigate("/login-admin");
                    return;
                }
                setAdminInfo(JSON.parse(adminData));

                // Verify token and get stats
                await adminAPI.verify();
                const statsResponse = await adminAPI.getStats();

                if (statsResponse.success) {
                    setStats(statsResponse.data);
                }
            } catch (err) {
                console.error("Dashboard error:", err);
                if (err.response?.status === 401) {
                    // Token expired or invalid
                    adminAPI.logout();
                    navigate("/login-admin");
                } else {
                    setError("Failed to load dashboard data");
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);

    const handleLogout = () => {
        adminAPI.logout();
        navigate("/login-admin");
    };

    const handleNavClick = (item) => {
        setActiveNav(item.id);
        navigate(item.path);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: isSidebarOpen ? 0 : -280 }}
                className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white z-40 shadow-2xl"
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Car size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">JK Chauffeur</h1>
                            <p className="text-slate-400 text-xs">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${activeNav === item.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                            {activeNav === item.id && <ChevronRight size={16} className="ml-auto" />}
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-0"}`}>
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Welcome back, {adminInfo?.name || "Admin"}! 👋</h2>
                                <p className="text-gray-500 text-sm">Here's what's happening with your business today.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6">
                    {error ? (
                        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl mb-6">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    ) : null}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Calendar}
                            label="Total Bookings"
                            value={stats?.bookings?.total || 0}
                            bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                        <StatCard
                            icon={Clock}
                            label="Pending Bookings"
                            value={stats?.bookings?.pending || 0}
                            bgGradient="bg-gradient-to-br from-yellow-500 to-orange-500"
                        />
                        <StatCard
                            icon={CheckCircle}
                            label="Completed"
                            value={stats?.bookings?.completed || 0}
                            bgGradient="bg-gradient-to-br from-green-500 to-emerald-600"
                        />
                        <StatCard
                            icon={XCircle}
                            label="Cancelled"
                            value={stats?.bookings?.cancelled || 0}
                            bgGradient="bg-gradient-to-br from-red-500 to-rose-600"
                        />
                    </div>

                    {/* Second Row Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            icon={DollarSign}
                            label="Total Earnings"
                            value={`£${stats?.totalEarnings?.toFixed(2) || '0.00'}`}
                            bgGradient="bg-gradient-to-br from-purple-500 to-indigo-600"
                        />
                        <StatCard
                            icon={Car}
                            label="Active Vehicles"
                            value={stats?.totalVehicles || 0}
                            bgGradient="bg-gradient-to-br from-cyan-500 to-blue-600"
                        />
                        <StatCard
                            icon={Users}
                            label="Confirmed Bookings"
                            value={stats?.bookings?.confirmed || 0}
                            bgGradient="bg-gradient-to-br from-pink-500 to-rose-600"
                        />
                    </div>

                    {/* Recent Bookings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
                            <button
                                onClick={() => navigate('/admin/bookings')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                                View All <ChevronRight size={16} />
                            </button>
                        </div>

                        {stats?.recentBookings?.length > 0 ? (
                            <div>
                                {stats.recentBookings.map((booking, index) => (
                                    <RecentBookingRow key={booking._id || index} booking={booking} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                                <p>No bookings yet</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
