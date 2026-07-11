export default function AdminLoading() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto" aria-busy="true">
      {/* Header skeleton */}
      <div className="space-y-2 border-b border-[#e8e0d0] pb-5">
        <div className="h-3 w-24 bg-[#e8e0d0] rounded animate-pulse" />
        <div className="h-7 w-48 bg-[#e8e0d0] rounded animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-[#e8e0d0] p-5 space-y-3">
            <div className="h-6 w-6 bg-[#e8e0d0] rounded animate-pulse" />
            <div className="h-8 w-20 bg-[#e8e0d0] rounded animate-pulse" />
            <div className="h-3 w-28 bg-[#e8e0d0] rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white border border-[#e8e0d0] divide-y divide-[#e8e0d0]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="px-4 py-4 flex gap-4">
            <div className="h-4 w-24 bg-[#e8e0d0] rounded animate-pulse" />
            <div className="h-4 w-36 bg-[#e8e0d0] rounded animate-pulse" />
            <div className="h-4 w-20 bg-[#e8e0d0] rounded animate-pulse ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
