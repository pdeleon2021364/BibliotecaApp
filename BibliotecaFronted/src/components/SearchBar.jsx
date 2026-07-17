import { MdSearch } from "react-icons/md"

export default function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="relative">
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-madera-400 text-xl" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-madera-200 bg-white text-madera-800 placeholder-madera-400 focus:outline-none focus:border-madera-400 focus:ring-2 focus:ring-madera-200 transition-all text-sm"
      />
    </div>
  )
}
