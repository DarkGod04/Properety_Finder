"use client";

export default function Filters({ filters, setFilters }: any) {
  
  
    return (
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm">
            <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="border rounded-md p-2"
            >
                <option value="">All Cities</option>
                <option value="riyadh">Riyadh</option>
                <option value="jeddah">Jeddah</option>
            </select>

            <select
                value={filters.order}
                onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                className="border rounded-md p-2"
            >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="price-asc">Price (Low → High)</option>
                <option value="price-desc">Price (High → Low)</option>
            </select>
        </div>
  );
}
