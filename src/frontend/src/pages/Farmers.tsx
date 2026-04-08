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
import { MapPin, Phone, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FarmerProfile } from "../backend.d";
import { useAllFarmers, useCreateFarmer } from "../hooks/useQueries";

function FarmerCard({
  farmer,
  index,
}: { farmer: FarmerProfile; index: number }) {
  const regDate = farmer.registrationDate
    ? new Date(
        Number(farmer.registrationDate / BigInt(1_000_000)),
      ).toLocaleDateString("en-IN")
    : "N/A";
  return (
    <Card
      data-ocid={`farmers.item.${index + 1}`}
      className="shadow-card hover:shadow-md transition-shadow"
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {farmer.name}
            </h3>
            <div className="mt-1.5 space-y-1">
              {farmer.contact && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  {farmer.contact}
                </div>
              )}
              {farmer.village && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {farmer.village}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-medium">
                  {farmer.landAreaAcres} acres
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Registered: {regDate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Farmers() {
  const { data: farmers, isLoading } = useAllFarmers();
  const createFarmer = useCreateFarmer();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    landAreaAcres: "",
    village: "",
    registrationDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.landAreaAcres) return;
    const regTs = form.registrationDate
      ? BigInt(new Date(form.registrationDate).getTime()) * BigInt(1_000_000)
      : BigInt(Date.now()) * BigInt(1_000_000);
    try {
      await createFarmer.mutateAsync({
        name: form.name,
        contact: form.contact || undefined,
        village: form.village || undefined,
        landAreaAcres: Number.parseFloat(form.landAreaAcres),
        registrationDate: regTs,
      });
      toast.success("Farmer registered successfully");
      setOpen(false);
      setForm({
        name: "",
        contact: "",
        landAreaAcres: "",
        village: "",
        registrationDate: "",
      });
    } catch {
      toast.error("Failed to register farmer");
    }
  };

  return (
    <div data-ocid="farmers.page" className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Registered farmer profiles
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="farmers.add.open_modal_button" className="gap-2">
              <Plus className="w-4 h-4" /> Add Farmer
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="farmers.add.dialog">
            <DialogHeader>
              <DialogTitle>Register New Farmer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input
                  data-ocid="farmers.name.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Ramesh Kumar"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Number</Label>
                <Input
                  data-ocid="farmers.contact.input"
                  value={form.contact}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contact: e.target.value }))
                  }
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Land Area (Acres) *</Label>
                <Input
                  data-ocid="farmers.land.input"
                  type="number"
                  step="0.1"
                  value={form.landAreaAcres}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, landAreaAcres: e.target.value }))
                  }
                  placeholder="5.5"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Village</Label>
                <Input
                  data-ocid="farmers.village.input"
                  value={form.village}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, village: e.target.value }))
                  }
                  placeholder="Aamlipada"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Registration Date</Label>
                <Input
                  data-ocid="farmers.date.input"
                  type="date"
                  value={form.registrationDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, registrationDate: e.target.value }))
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="farmers.add.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="farmers.add.submit_button"
                  disabled={createFarmer.isPending}
                >
                  {createFarmer.isPending ? "Saving..." : "Register Farmer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          data-ocid="farmers.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      ) : !farmers?.length ? (
        <div
          data-ocid="farmers.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No farmers registered yet</p>
          <p className="text-sm mt-1">
            Click &ldquo;Add Farmer&rdquo; to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmers.map((farmer: FarmerProfile, i) => (
            <FarmerCard key={farmer.name} farmer={farmer} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
