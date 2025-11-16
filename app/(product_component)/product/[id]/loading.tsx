/**
 * Loading component for product details page
 * Shows while product data is being fetched (ISR revalidation)
 */

export default function ProductDetailsLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-slate-200 rounded animate-pulse w-1/4" />
            <div className="h-12 bg-slate-200 rounded animate-pulse w-1/3" />
            <div className="h-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-12 bg-slate-200 rounded animate-pulse w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

