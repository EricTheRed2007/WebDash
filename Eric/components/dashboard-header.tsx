"use client"

import { Button } from "@/components/ui/button"
import { Droplets, Plus, BarChart3 } from "lucide-react"

interface DashboardHeaderProps {
  showForm: boolean
  onToggleForm: () => void
}

export function DashboardHeader({ showForm, onToggleForm }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl text-balance">
                Flood Survey Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Community flood impact assessment and data collection
              </p>
            </div>
          </div>
          <Button onClick={onToggleForm} variant={showForm ? "secondary" : "default"}>
            {showForm ? (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Dashboard
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
