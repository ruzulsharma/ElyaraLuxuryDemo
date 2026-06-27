// src/components/layout/SearchModal.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Close the modal and navigate to the search results page
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for items..."
            className="w-full border-b border-gray-300 focus:outline-none py-2"
          />
          <button type="submit" className="mt-4 text-sm underline">Search</button>
        </form>
        <button onClick={onClose} className="mt-2 text-xs text-gray-500">Close</button>
      </div>
    </div>
  );
}