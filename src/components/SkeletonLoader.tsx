import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="bg-white/70 dark:bg-slate-900/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card mb-6">
        
        {/* Header line */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>

        {/* Big Temp and Icon */}
        <div className="flex justify-between items-center pb-8 border-b border-slate-100 dark:border-slate-800/80">
          <div className="space-y-2">
            <div className="h-16 w-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>

        {/* 8 Metric Tiles Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="bg-white/70 dark:bg-slate-900/70 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card mb-6">
        <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="min-w-[76px] h-28 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 shrink-0" />
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="bg-white/70 dark:bg-slate-900/70 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100/80 dark:bg-slate-800/40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
