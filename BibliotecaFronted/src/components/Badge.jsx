const variants = {
  success: "bg-bosque-100 text-bosque-700",
  warning: "bg-madera-200 text-madera-700",
  danger: "bg-peligro-100 text-peligro-600",
  info: "bg-blue-100 text-blue-700",
}

export default function Badge({ variant = "info", children }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  )
}
