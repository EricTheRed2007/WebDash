"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, CheckCircle2, Droplets } from "lucide-react"

const surveySchema = z.object({
  area_name: z.string().min(2, "Area name is required"),
  address: z.string().optional(),
  city: z.string().min(2, "City is required"),
  postal_code: z.string().optional(),
  flood_date: z.string().min(1, "Flood date is required"),
  water_level_cm: z.number().min(0).optional(),
  flood_duration_hours: z.number().min(0).optional(),
  flood_frequency: z.enum(["first_time", "yearly", "multiple_yearly", "monthly"]).optional(),
  property_damage: z.boolean().default(false),
  damage_estimate_usd: z.number().min(0).optional(),
  people_affected: z.number().min(0).optional(),
  evacuation_required: z.boolean().default(false),
  loss_of_income: z.boolean().default(false),
  health_issues: z.boolean().default(false),
  displacement: z.boolean().default(false),
  infrastructure_damage: z.boolean().default(false),
  contaminated_water: z.boolean().default(false),
  power_outage: z.boolean().default(false),
  road_blockage: z.boolean().default(false),
  crop_damage: z.boolean().default(false),
  disadvantages_description: z.string().optional(),
  support_received: z.string().optional(),
  immediate_needs: z.string().optional(),
  respondent_name: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  severity_level: z.enum(["minor", "moderate", "severe", "critical"]).default("moderate"),
})

type SurveyFormData = z.infer<typeof surveySchema>

interface SurveyFormProps {
  onSuccess?: () => void
}

export function SurveyForm({ onSuccess }: SurveyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      property_damage: false,
      evacuation_required: false,
      loss_of_income: false,
      health_issues: false,
      displacement: false,
      infrastructure_damage: false,
      contaminated_water: false,
      power_outage: false,
      road_blockage: false,
      crop_damage: false,
      severity_level: "moderate",
    },
  })

  const onSubmit = async (data: SurveyFormData) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const supabase = createClient()
      
      const { error } = await supabase.from("flood_surveys").insert({
        area_name: data.area_name,
        address: data.address || null,
        city: data.city,
        postal_code: data.postal_code || null,
        flood_date: data.flood_date,
        water_level_cm: data.water_level_cm || null,
        flood_duration_hours: data.flood_duration_hours || null,
        flood_frequency: data.flood_frequency || null,
        property_damage: data.property_damage,
        damage_estimate_usd: data.damage_estimate_usd || null,
        people_affected: data.people_affected || null,
        evacuation_required: data.evacuation_required,
        loss_of_income: data.loss_of_income,
        health_issues: data.health_issues,
        displacement: data.displacement,
        infrastructure_damage: data.infrastructure_damage,
        contaminated_water: data.contaminated_water,
        power_outage: data.power_outage,
        road_blockage: data.road_blockage,
        crop_damage: data.crop_damage,
        disadvantages_description: data.disadvantages_description || null,
        support_received: data.support_received || null,
        immediate_needs: data.immediate_needs || null,
        respondent_name: data.respondent_name || null,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        severity_level: data.severity_level,
        status: "pending",
      })

      if (error) throw error

      setSubmitStatus("success")
      reset()
      onSuccess?.()
    } catch (err) {
      setSubmitStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit survey")
    } finally {
      setIsSubmitting(false)
    }
  }

  const disadvantages = [
    { key: "loss_of_income", label: "Loss of Income" },
    { key: "health_issues", label: "Health Issues" },
    { key: "displacement", label: "Displacement" },
    { key: "infrastructure_damage", label: "Infrastructure Damage" },
    { key: "contaminated_water", label: "Contaminated Water" },
    { key: "power_outage", label: "Power Outage" },
    { key: "road_blockage", label: "Road Blockage" },
    { key: "crop_damage", label: "Crop/Agriculture Damage" },
  ] as const

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Flood Impact Survey</CardTitle>
            <CardDescription>Report flooding incidents and their impact on your community</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Location Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area_name">Area/Neighborhood Name *</Label>
                <Input id="area_name" {...register("area_name")} placeholder="e.g., Riverside District" />
                {errors.area_name && <p className="text-sm text-destructive">{errors.area_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register("city")} placeholder="e.g., Springfield" />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" {...register("address")} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input id="postal_code" {...register("postal_code")} placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* Flood Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Flood Details</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="flood_date">Date of Flooding *</Label>
                <Input id="flood_date" type="date" {...register("flood_date")} />
                {errors.flood_date && <p className="text-sm text-destructive">{errors.flood_date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="water_level_cm">Water Level (cm)</Label>
                <Input
                  id="water_level_cm"
                  type="number"
                  {...register("water_level_cm", { valueAsNumber: true })}
                  placeholder="e.g., 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flood_duration_hours">Duration (hours)</Label>
                <Input
                  id="flood_duration_hours"
                  type="number"
                  {...register("flood_duration_hours", { valueAsNumber: true })}
                  placeholder="e.g., 24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flood_frequency">Flood Frequency</Label>
                <Select onValueChange={(value) => setValue("flood_frequency", value as SurveyFormData["flood_frequency"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first_time">First Time</SelectItem>
                    <SelectItem value="yearly">Once a Year</SelectItem>
                    <SelectItem value="multiple_yearly">Multiple Times/Year</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Severity Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Severity Assessment</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="severity_level">Severity Level *</Label>
                <Select 
                  defaultValue="moderate"
                  onValueChange={(value) => setValue("severity_level", value as SurveyFormData["severity_level"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="people_affected">People Affected</Label>
                <Input
                  id="people_affected"
                  type="number"
                  {...register("people_affected", { valueAsNumber: true })}
                  placeholder="e.g., 100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="damage_estimate_usd">Estimated Damage ($)</Label>
                <Input
                  id="damage_estimate_usd"
                  type="number"
                  {...register("damage_estimate_usd", { valueAsNumber: true })}
                  placeholder="e.g., 50000"
                />
              </div>
              <div className="flex flex-col gap-3 pt-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="property_damage"
                    checked={watch("property_damage")}
                    onCheckedChange={(checked) => setValue("property_damage", checked === true)}
                  />
                  <Label htmlFor="property_damage" className="font-normal">Property Damage</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="evacuation_required"
                    checked={watch("evacuation_required")}
                    onCheckedChange={(checked) => setValue("evacuation_required", checked === true)}
                  />
                  <Label htmlFor="evacuation_required" className="font-normal">Evacuation Required</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Disadvantages Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Disadvantages Faced</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {disadvantages.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={watch(key)}
                    onCheckedChange={(checked) => setValue(key, checked === true)}
                  />
                  <Label htmlFor={key} className="font-normal">{label}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disadvantages_description">Additional Details</Label>
              <Textarea
                id="disadvantages_description"
                {...register("disadvantages_description")}
                placeholder="Describe other challenges or impacts faced..."
                rows={3}
              />
            </div>
          </div>

          {/* Needs Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Support & Needs</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="support_received">Support Received</Label>
                <Textarea
                  id="support_received"
                  {...register("support_received")}
                  placeholder="Describe any aid or support received..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="immediate_needs">Immediate Needs</Label>
                <Textarea
                  id="immediate_needs"
                  {...register("immediate_needs")}
                  placeholder="What help do you need right now?"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact Information (Optional)</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="respondent_name">Your Name</Label>
                <Input id="respondent_name" {...register("respondent_name")} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number</Label>
                <Input id="contact_phone" {...register("contact_phone")} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input id="contact_email" type="email" {...register("contact_email")} placeholder="Optional" />
                {errors.contact_email && <p className="text-sm text-destructive">{errors.contact_email.message}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-4 pt-4">
            {submitStatus === "success" && (
              <div className="flex items-center gap-2 rounded-lg border border-accent/50 bg-accent/10 p-4 text-accent-foreground">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Survey submitted successfully. Thank you for your report.</span>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{errorMessage}</span>
              </div>
            )}
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
