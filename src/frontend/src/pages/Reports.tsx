import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Sprout, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ReportsProps {
  isAdmin?: boolean;
}

const expenseData = [
  { month: "Oct", expenses: 42000, revenue: 68000 },
  { month: "Nov", expenses: 38000, revenue: 72000 },
  { month: "Dec", expenses: 51000, revenue: 59000 },
  { month: "Jan", expenses: 45000, revenue: 81000 },
  { month: "Feb", expenses: 39000, revenue: 76000 },
  { month: "Mar", expenses: 47000, revenue: 90000 },
];

const yieldData = [
  { month: "Oct", wheat: 2.1, rice: 3.4, cotton: 1.8 },
  { month: "Nov", wheat: 2.5, rice: 3.1, cotton: 2.0 },
  { month: "Dec", wheat: 1.9, rice: 2.8, cotton: 1.6 },
  { month: "Jan", wheat: 2.8, rice: 3.6, cotton: 2.3 },
  { month: "Feb", wheat: 3.1, rice: 3.9, cotton: 2.5 },
  { month: "Mar", wheat: 3.4, rice: 4.2, cotton: 2.8 },
];

const inventoryData = [
  { name: "Seeds", value: 28 },
  { name: "Fertilizers", value: 35 },
  { name: "Pesticides", value: 18 },
  { name: "Tools", value: 12 },
  { name: "Machinery", value: 7 },
];

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

const stats = [
  {
    label: "Total Revenue (6m)",
    value: "PKR 4,46,000",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    label: "Total Expenses (6m)",
    value: "PKR 2,62,000",
    icon: DollarSign,
    color: "text-red-500",
  },
  {
    label: "Active Crops",
    value: "12 Crops",
    icon: Sprout,
    color: "text-emerald-600",
  },
  {
    label: "Workers Count",
    value: "34 Workers",
    icon: Users,
    color: "text-blue-600",
  },
];

export default function Reports({ isAdmin: _isAdmin }: ReportsProps) {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <Icon className={`w-5 h-5 mb-2 ${color}`} />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expense vs Revenue bar chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Monthly Revenue vs Expenses (PKR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={expenseData}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop yield line chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Crop Yield (tons/acre)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={yieldData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="wheat"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rice"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cotton"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory pie chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Inventory Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {inventoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
