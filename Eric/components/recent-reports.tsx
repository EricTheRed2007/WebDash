"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Calendar, Users } from "lucide-react"
import type { FloodSurvey } from "@/lib/types"
import { formatDistanceToNow, format } from "date-fns"

interface RecentReportsProps {
  surveys: FloodSurvey[]
}

const severityColors = {
  minor: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  moderate: "bg-primary/10 text-primary border-primary/30",
  severe: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
}

const statusColors = {
  pending: "bg-muted text-muted-foreground",
  reviewed: "bg-accent/10 text-accent",
  verified: "bg-primary/10 text-primary",
  resolved: "bg-chart-2/10 text-chart-2",
}

export function RecentReports({ surveys }: RecentReportsProps) {
  if (surveys.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Reports</CardTitle>
          <CardDescription>No reports submitted yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Submit a survey to see reports here
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Recent Reports</CardTitle>
        <CardDescription>Latest flood surveys from affected areas</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {surveys.map((survey) => (
              <div key={survey.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{survey.area_name}</h4>
                      <Badge variant="outline" className={severityColors[survey.severity_level]}>
                        {survey.severity_level}
                      </Badge>
                      <Badge variant="secondary" className={statusColors[survey.status]}>
                        {survey.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{survey.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(survey.flood_date), "MMM d, yyyy")}</span>
                      </div>
                      {survey.people_affected && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          <span>{survey.people_affected} affected</span>
                        </div>
                      )}
                    </div>

                    {survey.disadvantages_description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {survey.disadvantages_description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {survey.property_damage && <Badge variant="secondary" className="text-xs">Property Damage</Badge>}
                      {survey.evacuation_required && <Badge variant="secondary" className="text-xs">Evacuation</Badge>}
                      {survey.loss_of_income && <Badge variant="secondary" className="text-xs">Income Loss</Badge>}
                      {survey.health_issues && <Badge variant="secondary" className="text-xs">Health Issues</Badge>}
                      {survey.contaminated_water && <Badge variant="secondary" className="text-xs">Water Contamination</Badge>}
                    </div>
                  </div>

                  <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(survey.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
