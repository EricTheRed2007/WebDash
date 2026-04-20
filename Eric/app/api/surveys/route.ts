import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { DashboardStats, FloodSurvey } from "@/lib/types"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all surveys
    const { data: surveys, error } = await supabase
      .from("flood_surveys")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching surveys:", error)
      return NextResponse.json({ error: "Failed to fetch surveys" }, { status: 500 })
    }

    const typedSurveys = (surveys || []) as FloodSurvey[]

    // Calculate statistics
    const stats: DashboardStats = {
      totalSurveys: typedSurveys.length,
      totalAffected: typedSurveys.reduce((sum, s) => sum + (s.people_affected || 0), 0),
      totalDamage: typedSurveys.reduce((sum, s) => sum + (Number(s.damage_estimate_usd) || 0), 0),
      criticalCases: typedSurveys.filter((s) => s.severity_level === "critical").length,
      
      // Area breakdown
      areaBreakdown: Object.entries(
        typedSurveys.reduce((acc, s) => {
          acc[s.area_name] = (acc[s.area_name] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([area, count]) => ({ area, count })),
      
      // Severity breakdown
      severityBreakdown: ["minor", "moderate", "severe", "critical"].map((severity) => ({
        severity,
        count: typedSurveys.filter((s) => s.severity_level === severity).length,
      })),
      
      // Disadvantages breakdown
      disadvantagesBreakdown: [
        { type: "loss_of_income", count: typedSurveys.filter((s) => s.loss_of_income).length },
        { type: "health_issues", count: typedSurveys.filter((s) => s.health_issues).length },
        { type: "displacement", count: typedSurveys.filter((s) => s.displacement).length },
        { type: "infrastructure_damage", count: typedSurveys.filter((s) => s.infrastructure_damage).length },
        { type: "contaminated_water", count: typedSurveys.filter((s) => s.contaminated_water).length },
        { type: "power_outage", count: typedSurveys.filter((s) => s.power_outage).length },
        { type: "road_blockage", count: typedSurveys.filter((s) => s.road_blockage).length },
        { type: "crop_damage", count: typedSurveys.filter((s) => s.crop_damage).length },
      ],
      
      // Recent surveys (last 10)
      recentSurveys: typedSurveys.slice(0, 10),
    }

    return NextResponse.json(stats)
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
