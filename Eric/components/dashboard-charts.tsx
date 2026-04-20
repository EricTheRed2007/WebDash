"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import type { DashboardStats } from "@/lib/types"

interface DashboardChartsProps {
  stats: DashboardStats
}

const SEVERITY_COLORS = {
  minor: "hsl(var(--chart-4))",
  moderate: "hsl(var(--chart-1))",
  severe: "hsl(var(--chart-5))",
  critical: "hsl(var(--destructive))",
}

const DISADVANTAGE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--destructive))",
]

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const severityData = stats.severityBreakdown.map((item) => ({
    name: item.severity.charAt(0).toUpperCase() + item.severity.slice(1),
    value: item.count,
    fill: SEVERITY_COLORS[item.severity as keyof typeof SEVERITY_COLORS] || "hsl(var(--muted))",
  }))

  const disadvantagesData = stats.disadvantagesBreakdown
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((item, index) => ({
      name: formatDisadvantageName(item.type),
      count: item.count,
      fill: DISADVANTAGE_COLORS[index % DISADVANTAGE_COLORS.length],
    }))

  const areaData = stats.areaBreakdown
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((item) => ({
      name: item.area.length > 12 ? item.area.substring(0, 12) + "..." : item.area,
      reports: item.count,
    }))

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Severity Distribution */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Severity Distribution</CardTitle>
          <CardDescription>Breakdown of flood incidents by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, "Reports"]}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Disadvantages Faced */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Disadvantages Faced</CardTitle>
          <CardDescription>Most common impacts reported by affected communities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disadvantagesData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100} 
                  tick={{ fontSize: 11 }} 
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  formatter={(value: number) => [value, "Reports"]}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {disadvantagesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Affected Areas */}
      <Card className="border-border/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Top Affected Areas</CardTitle>
          <CardDescription>Neighborhoods with the most flood reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  stroke="hsl(var(--muted-foreground))"
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  formatter={(value: number) => [value, "Reports"]}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="reports" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatDisadvantageName(key: string): string {
  const names: Record<string, string> = {
    loss_of_income: "Loss of Income",
    health_issues: "Health Issues",
    displacement: "Displacement",
    infrastructure_damage: "Infrastructure",
    contaminated_water: "Water Contamination",
    power_outage: "Power Outage",
    road_blockage: "Road Blockage",
    crop_damage: "Crop Damage",
  }
  return names[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}
