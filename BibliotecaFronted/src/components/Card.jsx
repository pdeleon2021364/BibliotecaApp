export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-wood-card border-wood rounded-xl shadow-warm-sm p-6 ${className}`}>
      {children}
    </div>
  )
}
