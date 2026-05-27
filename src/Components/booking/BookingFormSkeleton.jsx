import React from 'react';
import { MapPin, Flag, Calendar, Clock, ArrowRight, Phone } from 'lucide-react';

function BookingFormSkeleton({ isOnHome = false }) {
  return (
    <div className="max-w-3xl mx-auto font-sans text-slate-200 pb-4 sm:pb-8">
      <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden animate-pulse">
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-white/5 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-48 bg-white/10 rounded" />
          </div>

          {/* Service Toggle Placeholder */}
          <div className="flex justify-center sm:justify-end p-1 bg-white/5 rounded-lg border border-white/10 w-full sm:w-auto gap-1">
            <div className="h-7 w-20 bg-white/10 rounded" />
            <div className="h-7 w-20 bg-white/5 rounded" />
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Main Input Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Pickup */}
            <div className="space-y-1.5">
              <div className="h-3 w-28 bg-[var(--color-primary)]/20 rounded ml-1" />
              <div className="relative">
                <div className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-4 h-12" />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/40" size={16} />
              </div>
            </div>

            {/* Dropoff */}
            <div className="space-y-1.5">
              <div className="h-3 w-24 bg-[var(--color-primary)]/20 rounded ml-1" />
              <div className="relative">
                <div className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-4 h-12" />
                <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/40" size={16} />
              </div>
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-3 w-12 bg-[var(--color-primary)]/20 rounded ml-1" />
              <div className="relative">
                <div className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-4 h-12" />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/40" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-3 w-12 bg-[var(--color-primary)]/20 rounded ml-1" />
              <div className="relative">
                <div className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-4 h-12" />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/40" size={16} />
              </div>
            </div>
          </div>

          {/* CTA Button Placeholder */}
          <div className="pt-1">
            <div className="w-full h-12 rounded-lg bg-[var(--color-primary)]/40 flex items-center justify-center gap-2">
              <div className="h-4 w-32 bg-black/20 rounded animate-pulse" />
              <ArrowRight size={18} className="text-black/20" />
            </div>
          </div>

          {/* Footer Assistance Placeholder */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-white/5 gap-2">
            <div className="h-3 w-3/4 bg-white/5 rounded" />
            <div className="h-3 w-28 bg-[var(--color-primary)]/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingFormSkeleton;
