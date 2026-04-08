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
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Plus, TrendingDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExpenseCategory } from "../backend.d";
import type { Expense } from "../backend.d";
import { useAddExpense, useAllExpenses } from "../hooks/useQueries";

const CATEGORY_BADGE: Record<string, string> = {
  [ExpenseCategory.seeds]: "bg-green-100 text-green-700",
  [ExpenseCategory.labour]: "bg-blue-100 text-blue-700",
  [ExpenseCategory.equipment]: "bg-purple-100 text-purple-700",
  [ExpenseCategory.irrigation]: "bg-cyan-100 text-cyan-700",
  [ExpenseCategory.transport]: "bg-orange-100 text-orange-700",
  [ExpenseCategory.other]: "bg-gray-100 text-gray-600",
};

export default function Expenses() {
  const { data: expenses, isLoading } = useAllExpenses();
  const addExpense = useAddExpense();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: ExpenseCategory.other,
    notes: "",
    date: "",
  });

  const total = expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0;

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!form.title || !form.amount) return;
    const dateTs = form.date
      ? BigInt(new Date(form.date).getTime()) * BigInt(1_000_000)
      : BigInt(Date.now()) * BigInt(1_000_000);
    try {
      await addExpense.mutateAsync({
        title: form.title,
        amount: Number.parseFloat(form.amount),
        category: form.category as ExpenseCategory,
        notes: form.notes || undefined,
        date: dateTs,
      });
      toast.success("Expense logged");
      setOpen(false);
      setForm({
        title: "",
        amount: "",
        category: ExpenseCategory.other,
        notes: "",
        date: "",
      });
    } catch {
      toast.error("Failed to log expense");
    }
  };

  return (
    <div data-ocid="expenses.page" className="space-y-5">
      {/* Summary card */}
      <Card className="bg-primary text-primary-foreground border-0 shadow-card">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-primary-foreground/80 text-sm">
              Total Expenses Recorded
            </p>
            <p className="text-2xl font-bold">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Track all farm expenditures
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="expenses.add.open_modal_button"
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Log Expense
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="expenses.add.dialog">
            <DialogHeader>
              <DialogTitle>Log New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  data-ocid="expenses.title.input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Fertilizer Purchase"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Amount (₹) *</Label>
                  <Input
                    data-ocid="expenses.amount.input"
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    placeholder="2500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, category: v as ExpenseCategory }))
                    }
                  >
                    <SelectTrigger data-ocid="expenses.category.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ExpenseCategory).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input
                  data-ocid="expenses.date.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea
                  data-ocid="expenses.notes.textarea"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Additional details..."
                  rows={2}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="expenses.add.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="expenses.add.submit_button"
                  disabled={addExpense.isPending}
                >
                  {addExpense.isPending ? "Saving..." : "Log Expense"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div data-ocid="expenses.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : !expenses?.length ? (
        <div
          data-ocid="expenses.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No expenses logged yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((exp: Expense, i) => {
            const date = exp.date
              ? new Date(
                  Number(exp.date / BigInt(1_000_000)),
                ).toLocaleDateString("en-IN")
              : "N/A";
            return (
              <Card
                data-ocid={`expenses.item.${i + 1}`}
                key={exp.title}
                className="shadow-card"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground text-sm">
                          {exp.title}
                        </h3>
                        <Badge className={CATEGORY_BADGE[exp.category] || ""}>
                          {exp.category}
                        </Badge>
                      </div>
                      {exp.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {exp.notes}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {date}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-foreground flex-shrink-0">
                      ₹{exp.amount.toLocaleString("en-IN")}
                    </p>
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
