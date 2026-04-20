"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, DollarSign, AlertTriangle } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Reports",
      value: stats.totalSurveys.toLocaleString(),
      icon: FileText,
      description: "Flood surveys collected",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "People Affected",
      value: stats.totalAffected.toLocaleString(),
      icon: Users,
      description: "Across all reported areas",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Estimated Damage",
      value: `$${(stats.totalDamage / 1000).toFixed(0)}K`,
      icon: DollarSign,
      description: "Total reported damage",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Critical Cases",
      value: stats.criticalCases.toLocaleString(),
      icon: AlertTriangle,
      description: "Require immediate attention",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
