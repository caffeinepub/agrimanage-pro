import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, PawPrint, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface LivestockProps {
  isAdmin?: boolean;
}

type HealthStatus = "Healthy" | "Sick" | "Under Treatment";

interface Animal {
  id: number;
  type: string;
  count: number;
  health: HealthStatus;
  lastCheckup: string;
  notes: string;
}

const INITIAL_ANIMALS: Animal[] = [
  {
    id: 1,
    type: "Cattle",
    count: 24,
    health: "Healthy",
    lastCheckup: "2026-03-20",
    notes: "All vaccinated. Milking 3x daily.",
  },
  {
    id: 2,
    type: "Buffalo",
    count: 8,
    health: "Healthy",
    lastCheckup: "2026-03-18",
    notes: "Two recently calved. High milk production.",
  },
  {
    id: 3,
    type: "Poultry",
    count: 350,
    health: "Under Treatment",
    lastCheckup: "2026-03-24",
    notes:
      "Respiratory infection detected in 15 birds. Antibiotics course started.",
  },
  {
    id: 4,
    type: "Goats",
    count: 42,
    health: "Healthy",
    lastCheckup: "2026-03-15",
    notes: "Ready for market in 3 weeks.",
  },
  {
    id: 5,
    type: "Sheep",
    count: 18,
    health: "Sick",
    lastCheckup: "2026-03-22",
    notes: "Foot-and-mouth symptoms in 3 sheep. Isolated and under vet care.",
  },
];

const HEALTH_BADGE: Record<HealthStatus, string> = {
  Healthy:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Sick: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Under Treatment":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

const EMPTY_FORM: Omit<Animal, "id"> = {
  type: "",
  count: 0,
  health: "Healthy",
  lastCheckup: new Date().toISOString().split("T")[0],
  notes: "",
};

export default function Livestock({ isAdmin }: LivestockProps) {
  const [animals, setAnimals] = useState<Animal[]>(INITIAL_ANIMALS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Animal | null>(null);
  const [form, setForm] = useState<Omit<Animal, "id">>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (a: Animal) => {
    setEditTarget(a);
    setForm({
      type: a.type,
      count: a.count,
      health: a.health,
      lastCheckup: a.lastCheckup,
      notes: a.notes,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.type.trim()) return;
    if (editTarget) {
      setAnimals((prev) =>
        prev.map((a) => (a.id === editTarget.id ? { ...a, ...form } : a)),
      );
    } else {
      setAnimals((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setAnimals((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  const totalAnimals = animals.reduce((s, a) => s + a.count, 0);
  const healthyCount = animals.filter((a) => a.health === "Healthy").length;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Species", value: animals.length },
          { label: "Total Animals", value: totalAnimals },
          { label: "Healthy Species", value: healthyCount },
          { label: "Need Attention", value: animals.length - healthyCount },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <PawPrint className="w-4 h-4 mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Livestock Records</CardTitle>
            {isAdmin && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    onClick={openAdd}
                    data-ocid="livestock.open_modal_button"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Animal
                  </Button>
                </DialogTrigger>
                <DialogContent data-ocid="livestock.dialog">
                  <DialogHeader>
                    <DialogTitle>
                      {editTarget ? "Edit Animal" : "Add Animal"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <Label>Animal Type</Label>
                      <Input
                        data-ocid="livestock.input"
                        placeholder="e.g. Cattle, Goats..."
                        value={form.type}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, type: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Count</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form.count}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            count: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Health Status</Label>
                      <Select
                        value={form.health}
                        onValueChange={(v) =>
                          setForm((p) => ({ ...p, health: v as HealthStatus }))
                        }
                      >
                        <SelectTrigger data-ocid="livestock.select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Healthy">Healthy</SelectItem>
                          <SelectItem value="Sick">Sick</SelectItem>
                          <SelectItem value="Under Treatment">
                            Under Treatment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Last Checkup Date</Label>
                      <Input
                        type="date"
                        value={form.lastCheckup}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            lastCheckup: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Notes</Label>
                      <Textarea
                        data-ocid="livestock.textarea"
                        placeholder="Any relevant notes..."
                        value={form.notes}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, notes: e.target.value }))
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      data-ocid="livestock.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      data-ocid="livestock.save_button"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Health Status</TableHead>
                <TableHead>Last Checkup</TableHead>
                <TableHead>Notes</TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals.map((animal, idx) => (
                <TableRow
                  key={animal.id}
                  data-ocid={`livestock.item.${idx + 1}`}
                >
                  <TableCell className="font-medium">{animal.type}</TableCell>
                  <TableCell>{animal.count}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs font-medium ${HEALTH_BADGE[animal.health]}`}
                    >
                      {animal.health}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {animal.lastCheckup}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {animal.notes}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(animal)}
                          data-ocid={`livestock.edit_button.${idx + 1}`}
                          className="h-7 w-7 p-0"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Dialog
                          open={deleteId === animal.id}
                          onOpenChange={(o) => !o && setDeleteId(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(animal.id)}
                              data-ocid={`livestock.delete_button.${idx + 1}`}
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent data-ocid="livestock.dialog">
                            <DialogHeader>
                              <DialogTitle>Delete {animal.type}?</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">
                              This action cannot be undone.
                            </p>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setDeleteId(null)}
                                data-ocid="livestock.cancel_button"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(animal.id)}
                                data-ocid="livestock.confirm_button"
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
