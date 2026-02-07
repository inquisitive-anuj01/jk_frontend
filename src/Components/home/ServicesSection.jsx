import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// Services data - all your chauffeur services
const SERVICES = [
    {
        id: 1,
        title: 'Airport Transfers',
        subtitle: 'Meet and Greet',
        description: 'Expect high-flying service and style with our all inclusive airport meet and greet service.',
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    },
    {
        id: 2,
        title: 'Corporate Service',
        subtitle: 'Business Travel',
        description: 'The perfect choice for business clients. Whether you have an important meeting or a special outing, our chauffeurs make travel stress-free.',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    },
    {
        id: 3,
        title: 'Hourly Hire',
        subtitle: 'As Directed',
        description: 'Transparent hourly pricing with no hidden extras keeps you in control. Available for an entire day or hourly basis.',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    },
    {
        id: 4,
        title: 'Wedding Service',
        subtitle: 'Special Occasions',
        description: 'We have classy, well-designed, and elegant cars for your wedding day. Our chauffeurs are professional, licensed and fully trained.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    },
    {
        id: 5,
        title: 'Events Service',
        subtitle: 'Corporate & Private',
        description: 'Reputed and reliable chauffeur hire for events. We have a team of 120 chauffeurs along with premium vehicles.',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    },
    {
        id: 6,
        title: 'School Transfers',
        subtitle: 'Safe & Reliable',
        description: 'Safe transportation for your children to and from school. Safety is our prime concern with professional chauffeurs.',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    },
    {
        id: 7,
        title: 'Intercity Travel',
        subtitle: 'Long Distance',
        description: 'Book in advance and save on intercity rides. Prioritizing safety, comfort, and privacy at competitive rates.',
        image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
    },
    {
        id: 8,
        title: 'Private Aviation',
        subtitle: 'VIP Service',
        description: 'Working closely with private airline operators for providing VIP chauffeur service with the highest levels of reliability.',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    },
];

function ServicesSection() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Check scroll position
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            scrollEl.addEventListener('scroll', checkScroll);
            return () => scrollEl.removeEventListener('scroll', checkScroll);
        }
    }, []);

    // Scroll by cards - original smooth behavior
    const scroll = (direction) => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.querySelector('.service-card')?.offsetWidth || 400;
            const gap = 24; // gap-6 = 24px
            // Scroll 2 cards at a time on desktop
            const scrollAmount = (cardWidth + gap) * 2;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-dark)' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            What We Offer
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
                        >
                            OUR <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>SERVICES</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 mt-3 max-w-xl"
                        >
                            Tailor made travel solutions just for you
                        </motion.p>
                    </div>

                    {/* Navigation Arrows - Desktop Only - Circle buttons with yellow color */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                            style={{
                                borderColor: canScrollLeft ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                color: canScrollLeft ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                                cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                                backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (canScrollLeft) {
                                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            aria-label="Previous services"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                            style={{
                                borderColor: canScrollRight ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                color: canScrollRight ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                                cursor: canScrollRight ? 'pointer' : 'not-allowed',
                                backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (canScrollRight) {
                                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            aria-label="Next services"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Services Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {SERVICES.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="service-card flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(33.333%-16px)] snap-center"
                        >
                            {/* Card with image on top, text content with bg on bottom - lifts up on hover */}
                            <div className="group cursor-pointer h-full transition-transform duration-500 hover:-translate-y-2">
                                {/* Image Container - no background */}
                                <div className="relative aspect-[16/10] rounded-t-xl overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                                </div>

                                {/* Content with background - bottom half */}
                                <div
                                    className="p-4 rounded-b-xl space-y-2"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                >
                                    <p
                                        className="text-sm font-medium uppercase tracking-wider"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        {service.subtitle}
                                    </p>
                                    <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                                        {service.description}
                                    </p>

                                    {/* Learn More Link */}
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 text-sm font-medium pt-2 group/link"
                                    >
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
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Scroll Indicator */}

            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Bottom Border - gradient fade (Desktop only, brighter in center) */}
            <div className="hidden md:flex justify-center mt-8">
                <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
        </section>
    );
}

export default ServicesSection;
