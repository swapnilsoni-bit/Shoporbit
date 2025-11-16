'use client';

import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100"
        >
          {/* Image Skeleton */}
          <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
          
          {/* Content Skeleton */}
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-slate-200 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

