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
import { Calendar, HardHat, IndianRupee, Phone, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { WorkerSkill } from "../backend.d";
import type { WorkerProfile } from "../backend.d";
import { useAddWorker, useAllWorkers } from "../hooks/useQueries";

const SKILL_BADGE: Record<string, string> = {
  [WorkerSkill.plowing]: "bg-amber-100 text-amber-800",
  [WorkerSkill.irrigation]: "bg-blue-100 text-blue-700",
  [WorkerSkill.harvesting]: "bg-green-100 text-green-700",
  [WorkerSkill.spraying]: "bg-purple-100 text-purple-700",
  [WorkerSkill.general]: "bg-gray-100 text-gray-700",
};

export default function Workers() {
  const { data: workers, isLoading } = useAllWorkers();
  const addWorker = useAddWorker();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    dailyWage: "",
    skill: WorkerSkill.general,
    joiningDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.dailyWage) return;
    const joiningTs = form.joiningDate
      ? BigInt(new Date(form.joiningDate).getTime()) * BigInt(1_000_000)
      : BigInt(Date.now()) * BigInt(1_000_000);
    try {
      await addWorker.mutateAsync({
        name: form.name,
        contact: form.contact || undefined,
        dailyWage: Number.parseFloat(form.dailyWage),
        skill: form.skill as WorkerSkill,
        joiningDate: joiningTs,
      });
      toast.success("Worker added successfully");
      setOpen(false);
      setForm({
        name: "",
        contact: "",
        dailyWage: "",
        skill: WorkerSkill.general,
        joiningDate: "",
      });
    } catch {
      toast.error("Failed to add worker");
    }
  };

  return (
    <div data-ocid="workers.page" className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage farm workers and their assignments
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="workers.add.open_modal_button" className="gap-2">
              <Plus className="w-4 h-4" /> Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="workers.add.dialog">
            <DialogHeader>
              <DialogTitle>Add New Worker</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input
                  data-ocid="workers.name.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Suresh Patel"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Contact</Label>
                <Input
                  data-ocid="workers.contact.input"
                  value={form.contact}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contact: e.target.value }))
                  }
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Daily Wage (₹) *</Label>
                <Input
                  data-ocid="workers.wage.input"
                  type="number"
                  value={form.dailyWage}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dailyWage: e.target.value }))
                  }
                  placeholder="350"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Skill</Label>
                <Select
                  value={form.skill}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, skill: v as WorkerSkill }))
                  }
                >
                  <SelectTrigger data-ocid="workers.skill.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(WorkerSkill).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Joining Date</Label>
                <Input
                  data-ocid="workers.date.input"
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, joiningDate: e.target.value }))
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="workers.add.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="workers.add.submit_button"
                  disabled={addWorker.isPending}
                >
                  {addWorker.isPending ? "Saving..." : "Add Worker"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          data-ocid="workers.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      ) : !workers?.length ? (
        <div
          data-ocid="workers.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <HardHat className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No workers added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker: WorkerProfile, i) => {
            const joinDate = worker.joiningDate
              ? new Date(
                  Number(worker.joiningDate / BigInt(1_000_000)),
                ).toLocaleDateString("en-IN")
              : "N/A";
            return (
              <Card
                data-ocid={`workers.item.${i + 1}`}
                key={worker.name}
                className="shadow-card"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                        <HardHat className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">
                          {worker.name}
                        </h3>
                        {worker.contact && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {worker.contact}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={SKILL_BADGE[worker.skill] || ""}>
                      {worker.skill}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {worker.dailyWage}/day
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {joinDate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
