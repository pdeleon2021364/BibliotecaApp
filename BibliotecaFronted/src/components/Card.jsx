export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-madera-200 rounded-xl shadow-warm-sm p-6 ${className}`}>
      {children}
    </div>
  )
}
