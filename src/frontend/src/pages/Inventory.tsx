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
import { AlertTriangle, Package, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ItemCategory } from "../backend.d";
import type { InventoryItem } from "../backend.d";
import { useAddInventoryItem, useAllInventory } from "../hooks/useQueries";

const CATEGORY_BADGE: Record<string, string> = {
  [ItemCategory.seeds]: "bg-green-100 text-green-700",
  [ItemCategory.fertilizer]: "bg-lime-100 text-lime-700",
  [ItemCategory.pesticide]: "bg-red-100 text-red-700",
  [ItemCategory.equipment]: "bg-blue-100 text-blue-700",
  [ItemCategory.other]: "bg-gray-100 text-gray-600",
};

export default function Inventory() {
  const { data: items, isLoading } = useAllInventory();
  const addItem = useAddInventoryItem();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: ItemCategory.seeds,
    quantity: "",
    unit: "",
    lowStockThreshold: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.unit) return;
    try {
      await addItem.mutateAsync({
        name: form.name,
        category: form.category as ItemCategory,
        quantity: Number.parseFloat(form.quantity),
        unit: form.unit,
        lowStockThreshold: Number.parseFloat(form.lowStockThreshold || "5"),
        lastUpdated: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success("Inventory item added");
      setOpen(false);
      setForm({
        name: "",
        category: ItemCategory.seeds,
        quantity: "",
        unit: "",
        lowStockThreshold: "",
      });
    } catch {
      toast.error("Failed to add item");
    }
  };

  const lowStockCount =
    items?.filter((i) => i.quantity <= i.lowStockThreshold).length ?? 0;

  return (
    <div data-ocid="inventory.page" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Track seeds, fertilizers, pesticides &amp; equipment
          </p>
          {lowStockCount > 0 && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" />
              {lowStockCount} item(s) running low
            </p>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="inventory.add.open_modal_button"
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="inventory.add.dialog">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Item Name *</Label>
                <Input
                  data-ocid="inventory.name.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Urea Fertilizer"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, category: v as ItemCategory }))
                  }
                >
                  <SelectTrigger data-ocid="inventory.category.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ItemCategory).map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Quantity *</Label>
                  <Input
                    data-ocid="inventory.quantity.input"
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, quantity: e.target.value }))
                    }
                    placeholder="100"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Unit *</Label>
                  <Input
                    data-ocid="inventory.unit.input"
                    value={form.unit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, unit: e.target.value }))
                    }
                    placeholder="kg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Low Stock Threshold</Label>
                <Input
                  data-ocid="inventory.threshold.input"
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      lowStockThreshold: e.target.value,
                    }))
                  }
                  placeholder="10"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="inventory.add.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="inventory.add.submit_button"
                  disabled={addItem.isPending}
                >
                  {addItem.isPending ? "Saving..." : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          data-ocid="inventory.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : !items?.length ? (
        <div
          data-ocid="inventory.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No inventory items yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item: InventoryItem, i) => {
            const isLow = item.quantity <= item.lowStockThreshold;
            return (
              <Card
                data-ocid={`inventory.item.${i + 1}`}
                key={item.name}
                className={`shadow-card ${isLow ? "border-destructive/40" : ""}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-sm">
                      {item.name}
                    </h3>
                    <Badge className={CATEGORY_BADGE[item.category] || ""}>
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">
                      {item.quantity}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        {item.unit}
                      </span>
                    </p>
                    {isLow && (
                      <div className="flex items-center gap-1 text-xs text-destructive font-medium">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </div>
                    )}
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
