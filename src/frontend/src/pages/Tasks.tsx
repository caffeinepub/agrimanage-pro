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
import { Calendar, CheckCircle2, ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TaskPriority, TaskStatus } from "../backend.d";
import type { Task } from "../backend.d";
import {
  useAllTasks,
  useCreateTask,
  useUpdateTaskStatus,
} from "../hooks/useQueries";

const PRIORITY_BADGE: Record<string, string> = {
  [TaskPriority.low]: "bg-gray-100 text-gray-600",
  [TaskPriority.medium]: "bg-yellow-100 text-yellow-700",
  [TaskPriority.high]: "bg-red-100 text-red-700",
};

const STATUS_BADGE: Record<string, string> = {
  [TaskStatus.pending]: "bg-orange-100 text-orange-700",
  [TaskStatus.inProgress]: "bg-blue-100 text-blue-700",
  [TaskStatus.completed]: "bg-green-100 text-green-700",
};

export default function Tasks() {
  const { data: tasks, isLoading } = useAllTasks();
  const createTask = useCreateTask();
  const updateStatus = useUpdateTaskStatus();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedWorker: "",
    fieldId: "",
    dueDate: "",
    priority: TaskPriority.medium,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate) return;
    const dueTs = BigInt(new Date(form.dueDate).getTime()) * BigInt(1_000_000);
    try {
      await createTask.mutateAsync({
        title: form.title,
        description: form.description || undefined,
        assignedWorker: form.assignedWorker,
        fieldId: form.fieldId,
        dueDate: dueTs,
        priority: form.priority as TaskPriority,
        status: TaskStatus.pending,
      });
      toast.success("Task created");
      setOpen(false);
      setForm({
        title: "",
        description: "",
        assignedWorker: "",
        fieldId: "",
        dueDate: "",
        priority: TaskPriority.medium,
      });
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleStatusUpdate = async (taskId: string, status: TaskStatus) => {
    try {
      await updateStatus.mutateAsync({ taskId, status });
      toast.success("Task status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div data-ocid="tasks.page" className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage and track farm tasks
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="tasks.add.open_modal_button" className="gap-2">
              <Plus className="w-4 h-4" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="tasks.add.dialog">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Task Title *</Label>
                <Input
                  data-ocid="tasks.title.input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Irrigate North Field"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  data-ocid="tasks.description.textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Task details..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Worker ID</Label>
                  <Input
                    data-ocid="tasks.worker.input"
                    value={form.assignedWorker}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, assignedWorker: e.target.value }))
                    }
                    placeholder="worker-001"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Field ID</Label>
                  <Input
                    data-ocid="tasks.field.input"
                    value={form.fieldId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fieldId: e.target.value }))
                    }
                    placeholder="field-001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Due Date *</Label>
                  <Input
                    data-ocid="tasks.due.input"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dueDate: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, priority: v as TaskPriority }))
                    }
                  >
                    <SelectTrigger data-ocid="tasks.priority.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TaskPriority).map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="tasks.add.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="tasks.add.submit_button"
                  disabled={createTask.isPending}
                >
                  {createTask.isPending ? "Saving..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div data-ocid="tasks.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : !tasks?.length ? (
        <div
          data-ocid="tasks.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No tasks created yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task: Task, i) => {
            const dueDate = task.dueDate
              ? new Date(
                  Number(task.dueDate / BigInt(1_000_000)),
                ).toLocaleDateString("en-IN")
              : "N/A";
            return (
              <Card
                data-ocid={`tasks.item.${i + 1}`}
                key={task.title}
                className="shadow-card"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground">
                          {task.title}
                        </h3>
                        <Badge className={PRIORITY_BADGE[task.priority] || ""}>
                          {task.priority}
                        </Badge>
                        <Badge className={STATUS_BADGE[task.status] || ""}>
                          {task.status}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {dueDate}
                      </p>
                    </div>
                    {task.status !== TaskStatus.completed && (
                      <Button
                        data-ocid={`tasks.complete.button.${i + 1}`}
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs flex-shrink-0"
                        onClick={() =>
                          handleStatusUpdate(task.title, TaskStatus.completed)
                        }
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </Button>
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
