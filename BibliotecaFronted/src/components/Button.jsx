const variants = {
  primary: "bg-madera-800 hover:bg-madera-700 text-white",
  accent: "bg-bosque-700 hover:bg-bosque-600 text-white",
  danger: "bg-peligro-600 hover:opacity-90 text-white",
  ghost: "bg-transparent hover:bg-madera-100 text-madera-700",
  outline: "border border-madera-300 text-madera-700 hover:bg-madera-100",
}

export default function Button({ variant = "primary", icon: Icon, children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="text-lg" />}
      {children}
    </button>
  )
}
