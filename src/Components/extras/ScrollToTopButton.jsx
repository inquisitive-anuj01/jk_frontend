import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { getLenisInstance } from '../../App';

function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    const handleScroll = useCallback(() => {
        setVisible(window.scrollY > 400);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToTop = () => {
        const lenis = getLenisInstance();
        if (lenis) {
            // Use Lenis's scrollTo for smooth, conflict-free scroll
            lenis.scrollTo(0, { duration: 1 });
        } else {
            // Fallback if Lenis not available
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    id="scroll-to-top-btn"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="scroll-to-top-btn"
                    aria-label="Scroll to top"
                    title="Back to top"
                >
                    <span className="scroll-to-top-icon">
                        <ArrowUp size={20} strokeWidth={2.5} />
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}

export default ScrollToTopButton;
