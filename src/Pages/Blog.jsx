import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight, Calendar, User, ArrowRight } from 'lucide-react';
import { blogAPI } from '../Utils/api';

function Blog() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileDisplayCount, setMobileDisplayCount] = useState(6);
    const ITEMS_PER_PAGE = 9;

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['blogs', currentPage],
        queryFn: () => blogAPI.getAll(currentPage, ITEMS_PER_PAGE),
    });

    const blogs = data?.blogs || [];
    const totalPages = data?.totalPages || 1;
    const displayedBlogs = isMobile ? blogs.slice(0, mobileDisplayCount) : blogs;

    const getImageSrc = (blog) => {
        const url = blog.heroImage?.url || blog.heroImageUrl;
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE}${url}`;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleLoadMore = () => {
        setMobileDisplayCount((prev) => prev + 6);
    };

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section className="pt-36 md:pt-44 pb-12 md:pb-16 px-4 md:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-4"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Our Blog
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5"
                    >
                        Latest News & Insights
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl mx-auto text-base md:text-lg"
                    >
                        Stay updated with the latest from JK Executive Chauffeurs — events, tips, and luxury travel insights.
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="w-24 h-0.5 mx-auto mt-8"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                </div>
            </section>

            {/* Blog Cards Grid */}
            <section className="pb-16 md:pb-24 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="text-center py-20">
                            <p className="text-white/50 text-lg">Unable to load blog posts. Please try again later.</p>
                        </div>
                    )}

                    {/* Blog Grid */}
                    {!isLoading && displayedBlogs.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {displayedBlogs.map((blog, index) => (
                                    <motion.div
                                        key={blog._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                    >
                                        <Link to={`/blog/${blog.slug}`} className="block h-full group">
                                            <div
                                                className="h-full rounded-2xl overflow-hidden transition-all duration-500 flex flex-col"
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.border = '1px solid rgba(215,183,94,0.3)';
                                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                {/* Image */}
                                                <div className="relative aspect-[16/10] overflow-hidden">
                                                    {getImageSrc(blog) ? (
                                                        <img
                                                            src={getImageSrc(blog)}
                                                            alt={blog.heroImage?.alt || blog.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full flex items-center justify-center"
                                                            style={{ background: 'linear-gradient(135deg, rgba(40,40,40,1), rgba(60,50,30,1))' }}
                                                        >
                                                            <span className="text-white/20 text-5xl font-bold">JK</span>
                                                        </div>
                                                    )}

                                                    {/* Category Badge */}
                                                    {blog.category && (
                                                        <div
                                                            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                                                            style={{
                                                                backgroundColor: 'rgba(215,183,94,0.2)',
                                                                color: 'var(--color-primary)',
                                                                border: '1px solid rgba(215,183,94,0.3)',
                                                            }}
                                                        >
                                                            {blog.category}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 md:p-6 flex-1 flex flex-col">
                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 mb-3 text-xs text-white/40">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(blog.createdAt)}
                                                        </span>
                                                        {blog.author && (
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-3 h-3" />
                                                                {blog.author}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                                        {blog.title}
                                                    </h3>

                                                    {/* Excerpt */}
                                                    {blog.excerpt && (
                                                        <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                                            {blog.excerpt}
                                                        </p>
                                                    )}

                                                    {/* Read More */}
                                                    <div
                                                        className="flex items-center gap-2 text-sm font-medium mt-auto transition-all duration-300 group-hover:gap-3"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        Read More
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Desktop Pagination */}
                            {!isMobile && totalPages > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-12">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
                                            style={{
                                                backgroundColor: currentPage === i + 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                                color: currentPage === i + 1 ? 'var(--color-dark)' : 'white',
                                                border: currentPage === i + 1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* Mobile Load More */}
                            {isMobile && mobileDisplayCount < blogs.length && (
                                <div className="flex justify-center mt-10">
                                    <button
                                        onClick={handleLoadMore}
                                        className="px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 border"
                                        style={{
                                            borderColor: 'var(--color-primary)',
                                            color: 'var(--color-primary)',
                                        }}
                                    >
                                        View More
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && blogs.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-white/50 text-lg">No blog posts available yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Blog;
