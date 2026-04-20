"use client"

import { useState } from "react"
import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { SurveyForm } from "@/components/survey-form"
import { StatsCards } from "@/components/stats-cards"
import { DashboardCharts } from "@/components/dashboard-charts"
import { RecentReports } from "@/components/recent-reports"
import { Spinner } from "@/components/ui/spinner"
import type { DashboardStats } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const emptyStats: DashboardStats = {
  totalSurveys: 0,
  totalAffected: 0,
  totalDamage: 0,
  criticalCases: 0,
  areaBreakdown: [],
  severityBreakdown: [
    { severity: "minor", count: 0 },
    { severity: "moderate", count: 0 },
    { severity: "severe", count: 0 },
    { severity: "critical", count: 0 },
  ],
  disadvantagesBreakdown: [],
  recentSurveys: [],
}

export function DashboardContent() {
  const [showForm, setShowForm] = useState(false)
  const { data: stats, error, isLoading, mutate } = useSWR<DashboardStats>("/api/surveys", fetcher, {
    refreshInterval: 30000, // Auto-refresh every 30 seconds
  })

  const handleFormSuccess = () => {
    mutate() // Refresh data after submission
    setTimeout(() => setShowForm(false), 2000) // Switch to dashboard after success
  }

  const displayStats = stats || emptyStats

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader showForm={showForm} onToggleForm={() => setShowForm(!showForm)} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showForm ? (
          <div className="mx-auto max-w-4xl">
            <SurveyForm onSuccess={handleFormSuccess} />
          </div>
        ) : (
          <div className="space-y-8">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Spinner className="h-8 w-8 text-primary" />
              </div>
            ) : error ? (
              <div className="flex h-64 items-center justify-center text-destructive">
                Failed to load dashboard data. Please try again.
              </div>
            ) : (
              <>
                <StatsCards stats={displayStats} />
                <DashboardCharts stats={displayStats} />
                <RecentReports surveys={displayStats.recentSurveys} />
              </>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          Flood Survey Dashboard - Helping communities document and respond to flooding impacts
        </div>
      </footer>
    </div>
  )
}
