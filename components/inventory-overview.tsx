import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const inventoryItems = [
  { category: "Main PA", count: 4 },
  { category: "Monitors", count: 8 },
  { category: "Microphones", count: 20 },
  { category: "DI Boxes", count: 10 },
  { category: "Cables", count: 50 },
  { category: "Stands", count: 15 },
]

export function InventoryOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {inventoryItems.map((item) => (
        <Card key={item.category} className="bg-card-gradient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{item.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.count}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

