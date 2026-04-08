import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  BarChart2,
  Bell,
  CloudSun,
  PawPrint,
  Sprout,
  TrendingUp,
  Truck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserPage } from "../App";

interface Props {
  onNavigate: (page: UserPage) => void;
}

interface FarmerForm {
  name: string;
  phone: string;
  village: string;
  landSize: string;
}

interface WorkerForm {
  name: string;
  phone: string;
  skill: string;
  experience: string;
}

function getStoredArray(key: string): unknown[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function UserHome({ onNavigate }: Props) {
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showWorkerForm, setShowWorkerForm] = useState(false);

  const [farmerCount, setFarmerCount] = useState(
    () => getStoredArray("agri_registered_farmers").length,
  );
  const [workerCount, setWorkerCount] = useState(
    () => getStoredArray("agri_registered_workers").length,
  );

  const [farmerForm, setFarmerForm] = useState<FarmerForm>({
    name: "",
    phone: "",
    village: "",
    landSize: "",
  });

  const [workerForm, setWorkerForm] = useState<WorkerForm>({
    name: "",
    phone: "",
    skill: "Farm Worker",
    experience: "",
  });

  function handleFarmerSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !farmerForm.name.trim() ||
      !farmerForm.phone.trim() ||
      !farmerForm.village.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const existing = getStoredArray("agri_registered_farmers");
    const newEntry = {
      ...farmerForm,
      id: Date.now(),
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "agri_registered_farmers",
      JSON.stringify([...existing, newEntry]),
    );
    setFarmerCount(existing.length + 1);
    setFarmerForm({ name: "", phone: "", village: "", landSize: "" });
    setShowFarmerForm(false);
    toast.success("Farmer registration submitted successfully!");
  }

  function handleWorkerSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workerForm.name.trim() || !workerForm.phone.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const existing = getStoredArray("agri_registered_workers");
    const newEntry = {
      ...workerForm,
      id: Date.now(),
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "agri_registered_workers",
      JSON.stringify([...existing, newEntry]),
    );
    setWorkerCount(existing.length + 1);
    setWorkerForm({
      name: "",
      phone: "",
      skill: "Farm Worker",
      experience: "",
    });
    setShowWorkerForm(false);
    toast.success("Worker registration submitted successfully!");
  }

  const quickActions = [
    {
      label: "Register as Farmer",
      icon: Sprout,
      color: "bg-green-50 border-green-200 hover:bg-green-100 text-green-700",
      iconColor: "text-green-600",
      action: () => {
        setShowFarmerForm((v) => !v);
        setShowWorkerForm(false);
      },
    },
    {
      label: "Register as Worker",
      icon: UserPlus,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700",
      iconColor: "text-blue-600",
      action: () => {
        setShowWorkerForm((v) => !v);
        setShowFarmerForm(false);
      },
    },
    {
      label: "Browse Marketplace",
      icon: Truck,
      color:
        "bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700",
      iconColor: "text-orange-600",
      action: () => onNavigate("delivery"),
    },
    {
      label: "View Notices",
      icon: Bell,
      color: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700",
      iconColor: "text-amber-600",
      action: () => onNavigate("notices"),
    },
    {
      label: "Check Weather",
      icon: CloudSun,
      color: "bg-sky-50 border-sky-200 hover:bg-sky-100 text-sky-700",
      iconColor: "text-sky-600",
      action: () => onNavigate("weather"),
    },
    {
      label: "View Reports",
      icon: BarChart2,
      color:
        "bg-violet-50 border-violet-200 hover:bg-violet-100 text-violet-700",
      iconColor: "text-violet-600",
      action: () => onNavigate("reports"),
    },
    {
      label: "Livestock Info",
      icon: PawPrint,
      color: "bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-700",
      iconColor: "text-teal-600",
      action: () => onNavigate("livestock"),
    },
  ];

  return (
    <div data-ocid="userhome.page" className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-primary text-primary-foreground border-0 overflow-hidden shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 opacity-90" />
            <div>
              <h2 className="text-xl font-bold">Welcome to AgriManage Pro</h2>
              <p className="text-primary-foreground/80 text-sm mt-0.5">
                Your agriculture hub — browse products, register, view notices
                &amp; more.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Farmers Registered
              </p>
              <p
                data-ocid="userhome.farmers.count"
                className="text-2xl font-bold text-foreground"
              >
                {farmerCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Workers Registered
              </p>
              <p
                data-ocid="userhome.workers.count"
                className="text-2xl font-bold text-foreground"
              >
                {workerCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(
            ({ label, icon: Icon, color, iconColor, action }) => (
              <button
                key={label}
                type="button"
                data-ocid={`userhome.${label.toLowerCase().replace(/\s+/g, "_")}.button`}
                onClick={action}
                className={`h-auto py-4 flex flex-col items-center gap-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${color}`}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
                {label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Farmer Registration Form */}
      {showFarmerForm && (
        <Card
          data-ocid="userhome.farmer_registration.panel"
          className="border-green-200 bg-green-50/30"
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-foreground">
                Farmer Registration
              </h3>
            </div>
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="farmer-name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="farmer-name"
                    data-ocid="userhome.farmer_name.input"
                    placeholder="Enter full name"
                    value={farmerForm.name}
                    onChange={(e) =>
                      setFarmerForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="farmer-phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="farmer-phone"
                    data-ocid="userhome.farmer_phone.input"
                    placeholder="Enter phone number"
                    value={farmerForm.phone}
                    onChange={(e) =>
                      setFarmerForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="farmer-village">
                    Village / Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="farmer-village"
                    data-ocid="userhome.farmer_village.input"
                    placeholder="Enter village or location"
                    value={farmerForm.village}
                    onChange={(e) =>
                      setFarmerForm((p) => ({ ...p, village: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="farmer-land">Land Size (acres)</Label>
                  <Input
                    id="farmer-land"
                    data-ocid="userhome.farmer_landsize.input"
                    placeholder="e.g. 2.5"
                    type="number"
                    min="0"
                    step="0.1"
                    value={farmerForm.landSize}
                    onChange={(e) =>
                      setFarmerForm((p) => ({ ...p, landSize: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  data-ocid="userhome.farmer_registration.submit_button"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Registration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="userhome.farmer_registration.cancel_button"
                  onClick={() => setShowFarmerForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Worker Registration Form */}
      {showWorkerForm && (
        <Card
          data-ocid="userhome.worker_registration.panel"
          className="border-blue-200 bg-blue-50/30"
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-foreground">
                Worker Registration
              </h3>
            </div>
            <form onSubmit={handleWorkerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="worker-name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="worker-name"
                    data-ocid="userhome.worker_name.input"
                    placeholder="Enter full name"
                    value={workerForm.name}
                    onChange={(e) =>
                      setWorkerForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="worker-phone"
                    data-ocid="userhome.worker_phone.input"
                    placeholder="Enter phone number"
                    value={workerForm.phone}
                    onChange={(e) =>
                      setWorkerForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-skill">Skill / Role</Label>
                  <Select
                    value={workerForm.skill}
                    onValueChange={(v) =>
                      setWorkerForm((p) => ({ ...p, skill: v }))
                    }
                  >
                    <SelectTrigger
                      id="worker-skill"
                      data-ocid="userhome.worker_skill.select"
                    >
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farm Worker">Farm Worker</SelectItem>
                      <SelectItem value="Driver">Driver</SelectItem>
                      <SelectItem value="Watchman">Watchman</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-exp">Experience (years)</Label>
                  <Input
                    id="worker-exp"
                    data-ocid="userhome.worker_experience.input"
                    placeholder="e.g. 3"
                    type="number"
                    min="0"
                    value={workerForm.experience}
                    onChange={(e) =>
                      setWorkerForm((p) => ({
                        ...p,
                        experience: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  data-ocid="userhome.worker_registration.submit_button"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit Registration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="userhome.worker_registration.cancel_button"
                  onClick={() => setShowWorkerForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
