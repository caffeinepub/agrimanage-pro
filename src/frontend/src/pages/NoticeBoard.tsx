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
import { Textarea } from "@/components/ui/textarea";
import { Bell, Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Notice } from "../backend.d";
import { useAllNotices, usePostNotice } from "../hooks/useQueries";

interface NoticeBoardProps {
  isAdmin?: boolean;
}

export default function NoticeBoard({ isAdmin = false }: NoticeBoardProps) {
  const { data: notices, isLoading } = useAllNotices();
  const postNotice = usePostNotice();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    try {
      await postNotice.mutateAsync({
        title: form.title,
        message: form.message,
      });
      toast.success("Notice posted");
      setOpen(false);
      setForm({ title: "", message: "" });
    } catch {
      toast.error("Failed to post notice");
    }
  };

  return (
    <div data-ocid="notices.page" className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Notice Board</h2>
          <p className="text-sm text-muted-foreground">
            Farm announcements and important updates
          </p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                data-ocid="notices.add.open_modal_button"
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> Post Notice
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="notices.add.dialog">
              <DialogHeader>
                <DialogTitle>Post New Notice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Title *</Label>
                  <Input
                    data-ocid="notices.title.input"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="Important Announcement"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Message *</Label>
                  <Textarea
                    data-ocid="notices.message.textarea"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Write your notice here..."
                    rows={4}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="notices.add.cancel_button"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    data-ocid="notices.add.submit_button"
                    disabled={postNotice.isPending}
                  >
                    {postNotice.isPending ? "Posting..." : "Post Notice"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div
          data-ocid="notices.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      ) : !notices?.length ? (
        <div
          data-ocid="notices.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No notices posted yet</p>
          <p className="text-sm mt-1">Check back later for updates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notices.map((notice: Notice, i) => {
            const date = notice.postedDate
              ? new Date(
                  Number(notice.postedDate / BigInt(1_000_000)),
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "N/A";
            return (
              <Card
                data-ocid={`notices.item.${i + 1}`}
                key={notice.title}
                className="shadow-card border-l-4 border-l-primary"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {notice.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {date}
                      </p>
                    </div>
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
