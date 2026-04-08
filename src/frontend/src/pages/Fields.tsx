import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FieldStatus, SoilType } from "../backend.d";
import type { Field } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllFields, useCreateField } from "../hooks/useQueries";

const STATUS_BADGE: Record<string, string> = {
  [FieldStatus.idle]: "bg-gray-100 text-gray-700",
  [FieldStatus.planted]: "bg-emerald-100 text-emerald-700",
  [FieldStatus.harvesting]: "bg-amber-100 text-amber-700",
};

export default function Fields() {
  const { data: fields, isLoading } = useAllFields();
  const createField = useCreateField();
  const { identity } = useInternetIdentity();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    areaAcres: "",
    soilType: SoilType.loamy,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login first");
      return;
    }
    if (!form.name || !form.areaAcres) return;
    try {
      await createField.mutateAsync({
        name: form.name,
        areaAcres: Number.parseFloat(form.areaAcres),
        soilType: form.soilType as SoilType,
        ownerId: identity.getPrincipal(),
      });
      toast.success("Field added successfully");
      setOpen(false);
      setForm({ name: "", areaAcres: "", soilType: SoilType.loamy });
    } catch {
      toast.error("Failed to add field");
    }
  };

  return (
    <div data-ocid="fields.page" className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage your agricultural land parcels
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="fields.add.open_modal_button" className="gap-2">
              <Plus className="w-4 h-4" /> Add Field
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="fields.add.dialog">
            <DialogHeader>
              <DialogTitle>Add New Field</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Field Name *</Label>
                <Input
                  data-ocid="fields.name.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="North Farm Block A"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Area (Acres) *</Label>
                <Input
                  data-ocid="fields.area.input"
                  type="number"
                  step="0.1"
                  value={form.areaAcres}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, areaAcres: e.target.value }))
                  }
                  placeholder="3.5"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Soil Type</Label>
                <Select
                  value={form.soilType}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, soilType: v as SoilType }))
                  }
                >
                  <SelectTrigger data-ocid="fields.soil.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SoilType).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="fields.add.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="fields.add.submit_button"
                  disabled={createField.isPending}
                >
                  {createField.isPending ? "Saving..." : "Add Field"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          data-ocid="fields.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : !fields?.length ? (
        <div
          data-ocid="fields.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No fields added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field: Field, i) => (
            <Card
              data-ocid={`fields.item.${i + 1}`}
              key={field.name}
              className="shadow-card"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {field.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {field.areaAcres} acres • {field.soilType} soil
                    </p>
                  </div>
                  <Badge className={STATUS_BADGE[field.status] || ""}>
                    {field.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
