import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { serviceAPI } from '../Utils/api';

// Responsive config
const DESKTOP_PER_PAGE = 9;   // 3 cols × 3 rows
const MOBILE_INITIAL = 5;     // Show 5 cards first on mobile
const MOBILE_LOAD_MORE = 5;   // Load 5 more each time

function Services() {
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_INITIAL);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch ALL active services (no server pagination, we handle layout on frontend)
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['services-all'],
        queryFn: () => serviceAPI.getAllServices(1, 100),
    });

    const allServices = data?.services || [];

    // --- Desktop pagination logic ---
    const totalPages = Math.ceil(allServices.length / DESKTOP_PER_PAGE);
    const desktopServices = allServices.slice(
        (currentPage - 1) * DESKTOP_PER_PAGE,
        currentPage * DESKTOP_PER_PAGE
    );

    // --- Mobile "view more" logic ---
    const mobileServices = allServices.slice(0, mobileVisibleCount);
    const hasMoreMobile = mobileVisibleCount < allServices.length;

    // Reset mobile count on page change
    useEffect(() => {
        setMobileVisibleCount(MOBILE_INITIAL);
    }, []);

    // Which services to display
    const displayedServices = isMobile ? mobileServices : desktopServices;

    // Page numbers for desktop
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
        return pages;
    };

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
            {/* Hero Banner */}
            <div
                className="relative pt-36 pb-16 md:pt-44 md:pb-20"
                style={{
                    background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, var(--color-dark) 100%)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-sm font-medium tracking-[0.25em] uppercase mb-4"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        What We Offer
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-light text-white"
                    >
                        Our <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Services</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/60 mt-4 max-w-2xl mx-auto text-lg"
                    >
                        Tailor-made luxury chauffeur solutions designed for every occasion
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-8 mx-auto w-24 h-0.5"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="text-center py-32">
                        <p className="text-white/60 text-lg">Failed to load services.</p>
                        <p className="text-white/40 text-sm mt-2">{error?.message}</p>
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !isError && allServices.length === 0 && (
                    <div className="text-center py-32">
                        <p className="text-white/60 text-lg">No services available at the moment.</p>
                    </div>
                )}

                {/* Cards Grid */}
                {!isLoading && displayedServices.length > 0 && (
                    <>
                        {/*
                          Responsive grid:
                          - Mobile:  1 column
                          - Tablet:  2 columns
                          - Desktop: 3 columns
                        */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {displayedServices.map((service, index) => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <Link to={`/services/${service.slug}`} className="block h-full">
                                        <div className="group cursor-pointer h-full transition-transform duration-500 hover:-translate-y-2">
                                            {/* Image */}
                                            <div className="relative aspect-[16/10] rounded-t-xl overflow-hidden">
                                                <img
                                                    src={service.image?.url}
                                                    alt={service.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                                                {service.priority <= 3 && service.priority > 0 && (
                                                    <div
                                                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                                                        style={{
                                                            backgroundColor: 'var(--color-primary)',
                                                            color: 'var(--color-dark)',
                                                        }}
                                                    >
                                                        Popular
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div
                                                className="p-5 rounded-b-xl space-y-3"
                                                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                            >
                                                <p
                                                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                                                    style={{ color: 'var(--color-primary)' }}
                                                >
                                                    {service.subtitle}
                                                </p>
                                                <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                                                    {service.title}
                                                </h3>
                                                <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                                                    {service.description}
                                                </p>

                                                {/* Features preview */}
                                                {service.features && service.features.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-1">
                                                        {service.features.slice(0, 3).map((feat, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-xs px-2.5 py-1 rounded-full border"
                                                                style={{
                                                                    borderColor: 'rgba(215,183,94,0.2)',
                                                                    color: 'var(--color-primary)',
                                                                    backgroundColor: 'rgba(215,183,94,0.05)',
                                                                }}
                                                            >
                                                                {feat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* View Service */}
                                                <div className="inline-flex items-center gap-2 text-sm font-medium pt-2 group/link">
                                                    <span
                                                        className="group-hover/link:underline transition-all"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        VIEW SERVICE
                                                    </span>
                                                    <ArrowRight
                                                        className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* ===== MOBILE: View More Button ===== */}
                        {isMobile && hasMoreMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center mt-10"
                            >
                                <button
                                    onClick={() => setMobileVisibleCount((prev) => prev + MOBILE_LOAD_MORE)}
                                    className="px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 border"
                                    style={{
                                        borderColor: 'var(--color-primary)',
                                        color: 'var(--color-primary)',
                                        backgroundColor: 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                        e.currentTarget.style.color = 'var(--color-dark)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--color-primary)';
                                    }}
                                >
                                    View More Services
                                </button>
                            </motion.div>
                        )}

                        {/* Mobile count info */}
                        {isMobile && (
                            <p className="text-center text-white/30 text-sm mt-4">
                                Showing {Math.min(mobileVisibleCount, allServices.length)} of {allServices.length} services
                            </p>
                        )}

                        {/* ===== DESKTOP/TABLET: Pagination ===== */}
                        {!isMobile && totalPages > 1 && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center justify-center gap-2 mt-14"
                                >
                                    {/* Previous */}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                                        style={{
                                            borderColor: currentPage > 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                            color: currentPage > 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                            cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    {/* Page Numbers */}
                                    {getPageNumbers().map((page, i) =>
                                        page === '...' ? (
                                            <span key={`dots-${i}`} className="px-2 text-white/30">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className="w-10 h-10 rounded-full text-sm font-medium transition-all duration-300"
                                                style={{
                                                    backgroundColor: currentPage === page ? 'var(--color-primary)' : 'transparent',
                                                    color: currentPage === page ? 'var(--color-dark)' : 'rgba(255,255,255,0.6)',
                                                    border: currentPage === page ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                                }}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    {/* Next */}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                                        style={{
                                            borderColor: currentPage < totalPages ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                            color: currentPage < totalPages ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                            cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </motion.div>

                                <p className="text-center text-white/30 text-sm mt-4">
                                    Page {currentPage} of {totalPages} ({allServices.length} services)
                                </p>
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default Services;
