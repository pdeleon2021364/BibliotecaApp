import Card from "./Card"

const colorMap = {
  madera: "bg-madera-600",
  bosque: "bg-bosque-700",
  maderaLight: "bg-madera-400",
  maderaDark: "bg-madera-800",
}

const iconBgMap = {
  madera: "bg-madera-100 text-madera-600",
  bosque: "bg-bosque-100 text-bosque-700",
  maderaLight: "bg-madera-100 text-madera-400",
  maderaDark: "bg-madera-200 text-madera-800",
}

export default function StatsCard({ title, value, icon: Icon, color = "madera" }) {
  return (
    <Card className="flex items-center gap-4 hover:shadow-warm transition-shadow duration-300">
      <div className={`p-3 rounded-xl ${iconBgMap[color]}`}>
        <Icon className="text-2xl" />
      </div>
      <div>
        <p className="text-sm text-madera-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-madera-900">{value}</p>
      </div>
    </Card>
  )
}
