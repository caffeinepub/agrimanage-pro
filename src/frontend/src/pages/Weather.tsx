import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Droplets,
  Eye,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

interface WeatherProps {
  isAdmin?: boolean;
}

const forecast = [
  { day: "Today", icon: Sun, high: 34, low: 22, condition: "Sunny", rain: 5 },
  { day: "Thu", icon: Cloud, high: 31, low: 21, condition: "Cloudy", rain: 15 },
  {
    day: "Fri",
    icon: CloudRain,
    high: 27,
    low: 19,
    condition: "Rainy",
    rain: 75,
  },
  {
    day: "Sat",
    icon: CloudRain,
    high: 25,
    low: 18,
    condition: "Showers",
    rain: 80,
  },
  {
    day: "Sun",
    icon: Cloud,
    high: 28,
    low: 20,
    condition: "Overcast",
    rain: 30,
  },
  { day: "Mon", icon: Sun, high: 33, low: 22, condition: "Clear", rain: 5 },
  { day: "Tue", icon: Sun, high: 35, low: 23, condition: "Sunny", rain: 0 },
];

const cropAdvice = [
  {
    title: "Wheat Sowing Window",
    desc: "Temperatures optimal (22–34°C). Next 2 days ideal for sowing wheat before rain arrives Friday.",
    type: "success",
    icon: "🌾",
  },
  {
    title: "Fungal Disease Alert",
    desc: "High humidity forecasted Fri–Sat. Apply preventive fungicide on tomato and potato crops before Friday.",
    type: "warning",
    icon: "⚠️",
  },
  {
    title: "Irrigation Not Needed",
    desc: "75–80mm rainfall expected Friday and Saturday. Skip irrigation on Thursday to avoid waterlogging.",
    type: "info",
    icon: "💧",
  },
  {
    title: "Post-Rain Fertilisation",
    desc: "Apply nitrogen-based fertiliser Sunday after rain clears — soil moisture improves nutrient uptake.",
    type: "success",
    icon: "🌱",
  },
];

const adviceColors: Record<string, string> = {
  success: "border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20",
  warning: "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
  info: "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20",
};

export default function Weather({ isAdmin: _isAdmin }: WeatherProps) {
  return (
    <div className="space-y-6">
      {/* Current conditions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="col-span-2 sm:col-span-3 lg:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center gap-4">
              <Sun className="w-14 h-14 text-yellow-500" />
              <div>
                <p className="text-5xl font-bold text-foreground">34°C</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Sunny — Punjab, PK
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  Live Conditions
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {[
          {
            label: "Humidity",
            value: "62%",
            icon: Droplets,
            color: "text-blue-500",
          },
          {
            label: "Wind Speed",
            value: "18 km/h",
            icon: Wind,
            color: "text-sky-500",
          },
          {
            label: "UV Index",
            value: "8 — High",
            icon: Sun,
            color: "text-orange-500",
          },
          {
            label: "Visibility",
            value: "12 km",
            icon: Eye,
            color: "text-purple-500",
          },
          {
            label: "Feels Like",
            value: "37°C",
            icon: Thermometer,
            color: "text-red-500",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <Icon className={`w-5 h-5 mb-2 ${color}`} />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 7-day forecast */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {forecast.map(({ day, icon: Icon, high, low, condition, rain }) => (
              <div
                key={day}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {day}
                </p>
                <Icon className="w-6 h-6 text-primary" />
                <p className="text-xs text-foreground font-semibold">{high}°</p>
                <p className="text-xs text-muted-foreground">{low}°</p>
                <p className="text-[10px] text-blue-500 font-medium">{rain}%</p>
                <p className="text-[10px] text-muted-foreground text-center leading-tight hidden sm:block">
                  {condition}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crop advice */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          🌿 Crop Advisory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cropAdvice.map(({ title, desc, type, icon }) => (
            <div key={title} className={`p-4 rounded-lg ${adviceColors[type]}`}>
              <p className="text-sm font-semibold text-foreground mb-1">
                {icon} {title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
