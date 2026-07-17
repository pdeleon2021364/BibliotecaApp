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
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-madera-300 bg-pergamino-50 text-madera-800 placeholder-madera-400 focus:outline-none focus:border-bosque-500 focus:ring-2 focus:ring-bosque-100 transition-all text-sm"
      />
    </div>
  )
}
