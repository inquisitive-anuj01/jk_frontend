import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGoogleMaps } from '../../Context/GoogleMapsContext';
// import heroImage from '../../assets/heroImage.png';
// Import WebP version after you convert it (heroImage.webp)
import heroImageWebp from '../../assets/heroImage.webp';
import Analytics from '../../Utils/analytics';
import { useBooking } from '../../Context/BookingContext';
import Locations from '../booking/Locations';
import BookingFormSkeleton from '../booking/BookingFormSkeleton';

// Libraries are managed globally via GoogleMapsProvider in App.jsx

// Rotating text options
const ROTATING_TEXTS = [
    'Airport Transfer',
    'Business Travel',
    'Wedding Services',
    'Event Services',
];

function HeroSection() {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const navigate = useNavigate();
    const { bookingData, updateBooking, markAsFromHero } = useBooking();

    const { isLoaded } = useGoogleMaps();

    // Rotate text every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Handle navigation to booking page with pre-filled data
    const handleHeroSubmit = () => {
        markAsFromHero();
        navigate('/booking', { state: { startStep: 2 } });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden">
            {/* Image Background */}
            <div className="absolute inset-0 z-0">
                <picture>
                    {/* WebP format loading */}
                    <source srcSet={heroImageWebp} type="image/webp" />
                    <img
                        src={heroImageWebp}
                        alt="Luxury Chauffeur Service Hero Background"
                        className="w-full h-full object-cover"
                        fetchPriority="high"
                        loading="eager"
                        decoding="async"
                    />
                </picture>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />
                {/* Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Content - aligned with header (max-w-7xl px-4 md:px-8) */}
            <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-24 w-full">
                {/* Two-column layout: Left content + Right booking form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* LEFT: Hero Content */}
                    <div className="text-left">
                        {/* Small Tagline - positioned left above Chauffeur */}
                        <motion.p
                            className="font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-2"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Distinguished Business & Private Travel
                        </motion.p>

                        {/* Main Heading with Rotating Text */}
                        <motion.div
                            className="mb-8"
                        >
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-tight">
                                <span className="block mb-1 font-semi-bold">Executive Car Hire &amp;</span>
                                <span
                                    className="block pl-2 sm:pl-4 md:pl-8 font-semibold whitespace-nowrap"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    Chauffeur Service London
                                </span>
                            </h1>
                        </motion.div>

                        {/* Subheading */}
                        <motion.div
                            className="max-w-xl mb-4"
                        >
                            <p className="text-sm md:text-base text-white mb-1 leading-snug">
                                Executive Travel for Airports, Corporate Meetings &amp; Special Events
                            </p>
                            <p className="text-sm md:text-base text-white/75 leading-relaxed">
                                Experience unrivalled reliability and multi-award-winning service with your personal chauffeur, available 24/7 across London and beyond.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row items-start gap-4"
                        >
                            <Link
                                to="/booking"
                                onClick={() => Analytics.trackBookingClick('hero_get_a_quote')}
                                className="hidden sm:flex group items-center gap-2 px-8 py-4 text-black font-bold uppercase tracking-wider rounded transition-all duration-300"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    boxShadow: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(var(--color-primary-rgb), 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Get a Quote
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={() => {
                                    Analytics.trackCallClick('hero_speak_to_us');
                                    window.open('tel:+442034759906', '_self');
                                }}
                                className="px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-medium uppercase tracking-wider rounded transition-all duration-300 hover:bg-white/5"
                            >
                                Speak to Us
                            </button>
                        </motion.div>

                        {/* TfL Licence */}
                        <motion.div
                            className="mt-8 flex items-center gap-3 text-white/70 text-xs md:text-sm font-medium tracking-wider uppercase"
                        >
                            <span className="w-8 h-[2px] bg-[var(--color-primary)]"></span>
                            TfL Licence No — <span className="text-white">010468</span>
                        </motion.div>
                    </div>

                    {/* RIGHT: Booking Form - Desktop only */}
                    <div className="hidden lg:block relative z-[50]">
                        {isLoaded ? (
                            <Locations
                                data={bookingData}
                                updateData={updateBooking}
                                onNext={handleHeroSubmit}
                                isOnHome={true}
                            />
                        ) : (
                            <BookingFormSkeleton isOnHome={true} />
                        )}
                    </div>
                </div>

                {/* Mobile Booking Form - shown under content */}
                <div className="lg:hidden mt-8 pb-8 relative z-[50]">
                    {isLoaded ? (
                        <Locations
                            data={bookingData}
                            updateData={updateBooking}
                            onNext={handleHeroSubmit}
                            isOnHome={true}
                        />
                    ) : (
                        <BookingFormSkeleton isOnHome={true} />
                    )}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
