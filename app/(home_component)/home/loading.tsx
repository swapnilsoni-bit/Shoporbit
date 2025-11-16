/**
 * Loading component for home page
 * Shows while data is being fetched (ISR revalidation)
 */

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-12 bg-blue-500/30 rounded-lg animate-pulse mb-4 max-w-2xl" />
          <div className="h-6 bg-blue-500/30 rounded-lg animate-pulse max-w-xl" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar Skeleton */}
        <div className="mb-6 max-w-3xl">
          <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-md animate-pulse">
              <div className="h-64 bg-slate-200 rounded-lg mb-4" />
              <div className="h-6 bg-slate-200 rounded mb-2" />
              <div className="h-4 bg-slate-200 rounded mb-4 w-2/3" />
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

