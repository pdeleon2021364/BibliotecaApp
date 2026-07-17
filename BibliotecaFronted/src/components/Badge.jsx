const variants = {
  success: "bg-bosque-100 text-bosque-700",
  warning: "bg-pergamino-200 text-madera-700",
  danger: "bg-peligro-100 text-peligro-600",
  info: "bg-madera-100 text-madera-600",
}

export default function Badge({ variant = "info", children }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
