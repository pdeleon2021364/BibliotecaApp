import Card from "./Card"

const iconBgMap = {
  madera: "bg-amber-50 text-amber-600",
  bosque: "bg-emerald-50 text-emerald-600",
  maderaLight: "bg-sky-50 text-sky-500",
  maderaDark: "bg-violet-50 text-violet-600",
}

export default function StatsCard({ title, value, icon: Icon, color = "madera" }) {
  return (
    <Card className="flex items-center gap-4 hover:shadow-warm transition-shadow duration-300">
      <div className={`p-3 rounded-xl ${iconBgMap[color]}`}>
        <Icon className="text-2xl" />
      </div>
      <div>
        <p className="text-xs text-madera-500 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-madera-800">{value}</p>
      </div>
    </Card>
  )
}
