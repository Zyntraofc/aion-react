import { Search } from 'lucide-react';

function SearchBar() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Buscar..."
        className="w-full rounded-full border border-gray-300 bg-gray-100 py-2 pl-10 pr-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default SearchBar;