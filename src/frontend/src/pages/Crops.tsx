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
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Plus, Sprout } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CropStage } from "../backend.d";
import type { CropRecord } from "../backend.d";
import { useAllCrops, usePlantCrop } from "../hooks/useQueries";

const STAGE_BADGE: Record<string, string> = {
  [CropStage.sowing]: "bg-yellow-100 text-yellow-700",
  [CropStage.germination]: "bg-lime-100 text-lime-700",
  [CropStage.vegetative]: "bg-green-100 text-green-700",
  [CropStage.flowering]: "bg-pink-100 text-pink-700",
  [CropStage.harvesting]: "bg-amber-100 text-amber-700",
  [CropStage.completed]: "bg-gray-100 text-gray-600",
};

function fmtDate(ts: bigint) {
  return new Date(Number(ts / BigInt(1_000_000))).toLocaleDateString("en-IN");
}

export default function Crops() {
  const { data: crops, isLoading } = useAllCrops();
  const plantCrop = usePlantCrop();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    variety: "",
    fieldId: "",
    expectedHarvestDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.fieldId || !form.expectedHarvestDate) return;
    const harvestTs =
      BigInt(new Date(form.expectedHarvestDate).getTime()) * BigInt(1_000_000);
    try {
      await plantCrop.mutateAsync({
        name: form.name,
        variety: form.variety || null,
        fieldId: form.fieldId,
        expectedHarvestDate: harvestTs,
      });
      toast.success("Crop planted successfully");
      setOpen(false);
      setForm({ name: "", variety: "", fieldId: "", expectedHarvestDate: "" });
    } catch {
      toast.error("Failed to plant crop");
    }
  };

  return (
    <div data-ocid="crops.page" className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Track all planted crops and their growth stages
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="crops.add.open_modal_button" className="gap-2">
              <Plus className="w-4 h-4" /> Plant Crop
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="crops.add.dialog">
            <DialogHeader>
              <DialogTitle>Plant New Crop</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Crop Name *</Label>
                <Input
                  data-ocid="crops.name.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Wheat"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Variety</Label>
                <Input
                  data-ocid="crops.variety.input"
                  value={form.variety}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, variety: e.target.value }))
                  }
                  placeholder="HD-2967"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Field ID *</Label>
                <Input
                  data-ocid="crops.field.input"
                  value={form.fieldId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fieldId: e.target.value }))
                  }
                  placeholder="field-001"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Expected Harvest Date *</Label>
                <Input
                  data-ocid="crops.harvest.input"
                  type="date"
                  value={form.expectedHarvestDate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      expectedHarvestDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="crops.add.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="crops.add.submit_button"
                  disabled={plantCrop.isPending}
                >
                  {plantCrop.isPending ? "Planting..." : "Plant Crop"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          data-ocid="crops.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : !crops?.length ? (
        <div
          data-ocid="crops.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Sprout className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No crops planted yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop: CropRecord, i) => (
            <Card
              data-ocid={`crops.item.${i + 1}`}
              key={crop.name}
              className="shadow-card"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {crop.name}
                    </h3>
                    {crop.variety && (
                      <p className="text-xs text-muted-foreground">
                        {crop.variety}
                      </p>
                    )}
                  </div>
                  <Badge className={STAGE_BADGE[crop.growthStage] || ""}>
                    {crop.growthStage}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Planted: {fmtDate(crop.plantingDate)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Harvest: {fmtDate(crop.expectedHarvestDate)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
