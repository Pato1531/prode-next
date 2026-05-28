import { prisma } from "@/lib/prisma"
import { adminUpdateSettingsAction, adminExportRankingsAction, adminResetTournamentAction } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Settings, Download, AlertTriangle, RefreshCw } from "lucide-react"

export const dynamic = "force-dynamic"

// void wrappers
async function exportRankings() { "use server"; await adminExportRankingsAction() }
async function resetTournament() { "use server"; await adminResetTournamentAction() }
async function updateSettings(formData: FormData) {
  "use server"
  await adminUpdateSettingsAction({
    registrationOpen: formData.get("registrationOpen") === "on",
    predictionsEnabled: formData.get("predictionsEnabled") === "on",
    maxParticipants: Number(formData.get("maxParticipants") ?? 0),
  })
}

export default async function AdminSettingsPage() {
  const settings = await prisma.adminSettings.findUnique({ where: { id: "singleton" } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">Ajustes globales del torneo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            Parámetros del torneo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSettings} className="space-y-5">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="registrationOpen" className="font-medium">Registro abierto</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Permitir que nuevos usuarios se registren</p>
              </div>
              <Switch
                id="registrationOpen"
                name="registrationOpen"
                defaultChecked={settings?.registrationOpen ?? true}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="predictionsEnabled" className="font-medium">Predicciones habilitadas</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Permitir guardar predicciones</p>
              </div>
              <Switch
                id="predictionsEnabled"
                name="predictionsEnabled"
                defaultChecked={settings?.predictionsEnabled ?? true}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Límite de participantes (0 = sin límite)</Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min={0}
                defaultValue={settings?.maxParticipants ?? 0}
                className="max-w-xs"
              />
            </div>
            <Button type="submit">Guardar cambios</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="h-4 w-4" />
            Exportar datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={exportRankings}>
            <Button type="submit" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Descargar ranking CSV
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Zona peligrosa
          </CardTitle>
          <CardDescription>Estas acciones son irreversibles</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={resetTournament}>
            <Button type="submit" variant="destructive" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Resetear torneo completo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
