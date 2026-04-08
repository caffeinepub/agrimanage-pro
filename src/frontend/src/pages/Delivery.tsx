import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart2,
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  CloudSun,
  Copy,
  IndianRupee,
  MapPin,
  Package,
  PawPrint,
  Phone,
  Plus,
  Settings,
  ShoppingCart,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import type { UserPage } from "../App";

interface Listing {
  id: number;
  produceName: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  deliveryAreas: string;
  farmerName: string;
}

interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  produceId: number;
  produceName: string;
  quantity: string;
  notes: string;
  status: "Pending" | "Dispatched" | "Delivered";
  deliveryCharge: number;
  productTotal: number;
  grandTotal: number;
  paymentReceived: boolean;
}

function getDeliveryCharge(qty: number): number {
  if (qty > 100) return 250;
  if (qty > 50) return 150;
  if (qty > 10) return 99;
  return 0;
}

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: 1,
    produceName: "Basmati Rice",
    quantity: "500",
    unit: "kg",
    pricePerUnit: "45",
    deliveryAreas: "Lahore, Gujranwala, Sheikhupura",
    farmerName: "Malik Aslam",
  },
  {
    id: 2,
    produceName: "Fresh Tomatoes",
    quantity: "200",
    unit: "kg",
    pricePerUnit: "80",
    deliveryAreas: "Rawalpindi, Islamabad",
    farmerName: "Chaudhry Imran",
  },
  {
    id: 3,
    produceName: "Sugarcane",
    quantity: "50",
    unit: "quintal",
    pricePerUnit: "350",
    deliveryAreas: "Faisalabad, Jhang",
    farmerName: "Hamid Farooq",
  },
];

const SAMPLE_ORDERS: Order[] = [
  {
    id: 1,
    customerName: "Ahmed Traders",
    phone: "0300-1234567",
    address: "Shop 12, Hall Road, Lahore",
    produceId: 1,
    produceName: "Basmati Rice",
    quantity: "100 kg",
    notes: "Deliver before noon",
    status: "Dispatched",
    productTotal: 4500,
    deliveryCharge: 150,
    grandTotal: 4650,
    paymentReceived: true,
  },
  {
    id: 2,
    customerName: "Raza Grocery",
    phone: "0321-9876543",
    address: "Main Bazaar, Rawalpindi",
    produceId: 2,
    produceName: "Fresh Tomatoes",
    quantity: "50 kg",
    notes: "",
    status: "Pending",
    productTotal: 4000,
    deliveryCharge: 99,
    grandTotal: 4099,
    paymentReceived: false,
  },
];

let nextListingId = 4;
let nextOrderId = 3;

const statusColors: Record<Order["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Dispatched: "bg-blue-100 text-blue-800 border-blue-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
};

interface DeliveryProps {
  isAdmin?: boolean;
  onNavigate?: (page: UserPage) => void;
}

interface PriceBreakdownProps {
  selectedProduceId: string;
  orderQty: string;
  listings: Listing[];
  upiId?: string;
}

function UpiPaymentBox({ upiId }: { upiId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sm:col-span-2 rounded-lg border border-green-200 bg-green-50 p-3 space-y-2">
      <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">
        💳 UPI se Payment Karo
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-md border border-green-300 bg-white px-3 py-2">
          <p className="text-sm font-mono font-semibold text-green-900">
            {upiId}
          </p>
        </div>
        <Button
          data-ocid="delivery.upi_copy.button"
          type="button"
          variant="outline"
          size="sm"
          className={`gap-1.5 border-green-300 ${
            copied
              ? "text-green-700 bg-green-100"
              : "text-green-700 hover:bg-green-100"
          }`}
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <CheckCheck className="w-3.5 h-3.5" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-green-700">
        ⚠️ Order place karne ke baad yeh UPI ID pe total amount bhejein
      </p>
    </div>
  );
}

function PriceBreakdown({
  selectedProduceId,
  orderQty,
  listings,
  upiId,
}: PriceBreakdownProps) {
  const listing = listings.find((l) => l.id === Number(selectedProduceId));
  const qty = Number.parseFloat(orderQty);
  if (!listing || !orderQty || Number.isNaN(qty) || qty <= 0) return null;

  const productTotal = qty * Number.parseFloat(listing.pricePerUnit);
  const deliveryCharge = getDeliveryCharge(qty);
  const grandTotal = productTotal + deliveryCharge;

  return (
    <>
      <div className="sm:col-span-2 rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Payment Summary
        </p>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Produce Cost ({qty} × ₹{listing.pricePerUnit})
          </span>
          <span className="font-medium">₹{productTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Delivery Charge
            {deliveryCharge === 0
              ? " (Free 🎉)"
              : ` (${qty} ${listing.unit} ke liye)`}
          </span>
          <span
            className={
              deliveryCharge === 0
                ? "text-green-600 font-medium"
                : "font-medium"
            }
          >
            {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
          </span>
        </div>
        <div className="border-t border-primary/20 pt-1.5 flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">
            ₹{grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
      {upiId && <UpiPaymentBox upiId={upiId} />}
    </>
  );
}

export default function Delivery({
  isAdmin = false,
  onNavigate,
}: DeliveryProps) {
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);

  // UPI ID state
  const [upiId, setUpiId] = useState("");
  const [upiInput, setUpiInput] = useState("");
  const [upiSaved, setUpiSaved] = useState(false);

  // Listing form
  const [produceName, setProduceName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [deliveryAreas, setDeliveryAreas] = useState("");
  const [farmerName, setFarmerName] = useState("");

  // Order form
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedProduceId, setSelectedProduceId] = useState("");
  const [orderQty, setOrderQty] = useState("");
  const [notes, setNotes] = useState("");

  const saveUpiId = () => {
    setUpiId(upiInput.trim());
    setUpiSaved(true);
    setTimeout(() => setUpiSaved(false), 2000);
  };

  const addListing = () => {
    if (!produceName.trim() || !quantity || !pricePerUnit || !farmerName.trim())
      return;
    setListings((prev) => [
      ...prev,
      {
        id: nextListingId++,
        produceName,
        quantity,
        unit,
        pricePerUnit,
        deliveryAreas,
        farmerName,
      },
    ]);
    setProduceName("");
    setQuantity("");
    setUnit("kg");
    setPricePerUnit("");
    setDeliveryAreas("");
    setFarmerName("");
  };

  const deleteListing = (id: number) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const placeOrder = () => {
    if (
      !customerName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !selectedProduceId ||
      !orderQty
    )
      return;
    const listing = listings.find((l) => l.id === Number(selectedProduceId));
    if (!listing) return;
    const qty = Number.parseFloat(orderQty);
    const productTotal = qty * Number.parseFloat(listing.pricePerUnit);
    const deliveryCharge = getDeliveryCharge(qty);
    const grandTotal = productTotal + deliveryCharge;
    setOrders((prev) => [
      ...prev,
      {
        id: nextOrderId++,
        customerName,
        phone,
        address,
        produceId: listing.id,
        produceName: listing.produceName,
        quantity: `${orderQty} ${listing.unit}`,
        notes,
        status: "Pending",
        productTotal,
        deliveryCharge,
        grandTotal,
        paymentReceived: false,
      },
    ]);
    setCustomerName("");
    setPhone("");
    setAddress("");
    setSelectedProduceId("");
    setOrderQty("");
    setNotes("");
  };

  const updateStatus = (id: number, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const togglePayment = (id: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, paymentReceived: !o.paymentReceived } : o,
      ),
    );
  };

  const totalRevenue = orders
    .filter((o) => o.paymentReceived)
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const userQuickActions = [
    {
      label: "Notices",
      page: "notices" as UserPage,
      icon: Bell,
      color: "text-orange-600",
      bg: "bg-orange-50 hover:bg-orange-100 border-orange-200",
    },
    {
      label: "Weather",
      page: "weather" as UserPage,
      icon: CloudSun,
      color: "text-sky-600",
      bg: "bg-sky-50 hover:bg-sky-100 border-sky-200",
    },
    {
      label: "Reports",
      page: "reports" as UserPage,
      icon: BarChart2,
      color: "text-violet-600",
      bg: "bg-violet-50 hover:bg-violet-100 border-violet-200",
    },
    {
      label: "Livestock",
      page: "livestock" as UserPage,
      icon: PawPrint,
      color: "text-amber-600",
      bg: "bg-amber-50 hover:bg-amber-100 border-amber-200",
    },
  ];

  const orderForm = (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-primary" />
          Naya Order Place Karo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="custName">
              {isAdmin ? "Customer Ka Naam" : "Aapka Naam"} *
            </Label>
            <Input
              id="custName"
              data-ocid="delivery.customer_name.input"
              placeholder="e.g. Ahmed Traders"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="custPhone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                id="custPhone"
                data-ocid="delivery.phone.input"
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="delivAddr">Delivery Address *</Label>
            <Input
              id="delivAddr"
              data-ocid="delivery.address.input"
              placeholder="Ghar / Dukan ka pura pata"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Produce Select Karo *</Label>
            <Select
              value={selectedProduceId}
              onValueChange={(v) => {
                setSelectedProduceId(v);
                setOrderQty("");
              }}
            >
              <SelectTrigger data-ocid="delivery.produce.select">
                <SelectValue placeholder="Koi produce chunein" />
              </SelectTrigger>
              <SelectContent>
                {listings.map((l) => (
                  <SelectItem key={l.id} value={String(l.id)}>
                    {l.produceName} — ₹{l.pricePerUnit}/{l.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="orderQty">Kitni Miqdar *</Label>
            <Input
              id="orderQty"
              data-ocid="delivery.order_qty.input"
              placeholder="e.g. 100"
              type="number"
              value={orderQty}
              onChange={(e) => setOrderQty(e.target.value)}
            />
          </div>
          <PriceBreakdown
            selectedProduceId={selectedProduceId}
            orderQty={orderQty}
            listings={listings}
            upiId={upiId}
          />
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="orderNotes">Notes (Optional)</Label>
            <Textarea
              id="orderNotes"
              data-ocid="delivery.notes.textarea"
              placeholder="Koi khaas hidayat..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <Button
          data-ocid="delivery.place_order.button"
          onClick={placeOrder}
          className="gap-2"
          disabled={listings.length === 0}
        >
          <ShoppingCart className="w-4 h-4" /> Order Place Karo
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header + Quick Actions side by side */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Online Delivery
            </h2>
            <p className="text-sm text-muted-foreground">
              Apni fasal online becho aur ghar tak deliver karo
            </p>
          </div>
        </div>

        {/* Quick Actions — user only */}
        {!isAdmin && onNavigate && (
          <div className="flex flex-wrap gap-2">
            {userQuickActions.map(({ label, page, icon: Icon, color, bg }) => (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${bg}`}
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className={color}>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Total Listings</p>
            <p className="text-2xl font-bold text-primary mt-0.5">
              {listings.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {orders.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-0.5">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Delivered</p>
            <p className="text-2xl font-bold text-green-600 mt-0.5">
              {orders.filter((o) => o.status === "Delivered").length}
            </p>
          </CardContent>
        </Card>
        {isAdmin && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-green-700">Total Revenue</p>
              <p className="text-xl font-bold text-green-700 mt-0.5 flex items-center gap-0.5">
                <IndianRupee className="w-4 h-4" />
                {totalRevenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Admin: Payment Settings (UPI ID) */}
      {isAdmin && (
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-blue-800">
              <Settings className="w-4 h-4" />
              Payment Settings — UPI ID
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upiId && (
              <div className="flex items-center gap-2 p-2 rounded-md border border-blue-200 bg-white">
                <p className="text-xs text-blue-600 flex-shrink-0">
                  Current UPI ID:
                </p>
                <p className="text-sm font-mono font-semibold text-blue-900">
                  {upiId}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                data-ocid="delivery.upi_id.input"
                placeholder="yourname@upi or number@bank"
                value={upiInput}
                onChange={(e) => setUpiInput(e.target.value)}
                className="flex-1"
              />
              <Button
                data-ocid="delivery.upi_save.button"
                onClick={saveUpiId}
                disabled={!upiInput.trim()}
                className={`gap-1.5 ${
                  upiSaved ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              >
                {upiSaved ? (
                  <>
                    <CheckCheck className="w-4 h-4" /> Saved!
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            <p className="text-xs text-blue-600">
              Yeh UPI ID customers ko order form mein dikhega payment ke liye.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="listings" data-ocid="delivery.tab">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="listings" data-ocid="delivery.listings.tab">
            Produce Listings
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="delivery.orders.tab">
            {isAdmin ? "All Orders" : "My Orders"}
          </TabsTrigger>
        </TabsList>

        {/* ---- Tab 1: Listings ---- */}
        <TabsContent value="listings" className="space-y-5 mt-5">
          {/* Admin-only: Add listing form */}
          {isAdmin && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Nai Produce List Karo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="produceName">
                      Fasal / Produce Ka Naam *
                    </Label>
                    <Input
                      id="produceName"
                      data-ocid="delivery.produce_name.input"
                      placeholder="e.g. Gehoon, Chawal, Tomatoes"
                      value={produceName}
                      onChange={(e) => setProduceName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="farmerName">Kisan Ka Naam *</Label>
                    <Input
                      id="farmerName"
                      data-ocid="delivery.farmer_name.input"
                      placeholder="e.g. Malik Aslam"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Miqdar (Quantity) *</Label>
                    <div className="flex gap-2">
                      <Input
                        data-ocid="delivery.quantity.input"
                        placeholder="e.g. 500"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger
                          data-ocid="delivery.unit.select"
                          className="w-28"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="quintal">Quintal</SelectItem>
                          <SelectItem value="maund">Maund</SelectItem>
                          <SelectItem value="ton">Ton</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="price">Qeemat (Price per unit) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        ₹
                      </span>
                      <Input
                        id="price"
                        data-ocid="delivery.price.input"
                        placeholder="45"
                        type="number"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(e.target.value)}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="areas">Delivery Areas</Label>
                    <Input
                      id="areas"
                      data-ocid="delivery.areas.input"
                      placeholder="e.g. Lahore, Gujranwala, Faisalabad"
                      value={deliveryAreas}
                      onChange={(e) => setDeliveryAreas(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  data-ocid="delivery.add_listing.button"
                  onClick={addListing}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Listing Add Karo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Delivery Charge Info */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Delivery Charges
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                10 kg tak — Free
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                10–50 kg — ₹99
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                50–100 kg — ₹150
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                100 kg se upar — ₹250
              </div>
            </div>
          </div>

          {/* Listing cards */}
          {listings.length === 0 ? (
            <div
              data-ocid="delivery.listings.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Abhi koi listing nahi hai.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing, idx) => (
                <Card
                  key={listing.id}
                  data-ocid={`delivery.listings.item.${idx + 1}`}
                  className="border-border hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          {listing.produceName}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3" /> {listing.farmerName}
                        </p>
                      </div>
                      {isAdmin && (
                        <Button
                          data-ocid={`delivery.delete_listing.button.${idx + 1}`}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 flex-shrink-0"
                          onClick={() => deleteListing(listing.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted/50 rounded-md p-2">
                        <p className="text-xs text-muted-foreground">Miqdar</p>
                        <p className="font-medium">
                          {listing.quantity} {listing.unit}
                        </p>
                      </div>
                      <div className="bg-primary/5 rounded-md p-2">
                        <p className="text-xs text-muted-foreground">Qeemat</p>
                        <p className="font-medium text-primary">
                          ₹{listing.pricePerUnit}/{listing.unit}
                        </p>
                      </div>
                    </div>
                    {listing.deliveryAreas && (
                      <p className="text-xs text-muted-foreground flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {listing.deliveryAreas}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ---- Tab 2: Orders ---- */}
        <TabsContent value="orders" className="space-y-5 mt-5">
          {orderForm}

          {/* Orders list */}
          {orders.length === 0 ? (
            <div
              data-ocid="delivery.orders.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Abhi koi order nahi hai.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, idx) => (
                <Card
                  key={order.id}
                  data-ocid={`delivery.orders.item.${idx + 1}`}
                  className="border-border"
                >
                  <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground">
                            {order.customerName}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${statusColors[order.status]}`}
                          >
                            {order.status}
                          </Badge>
                          {isAdmin &&
                            (order.paymentReceived ? (
                              <Badge className="text-xs bg-green-100 text-green-800 border border-green-200 gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Payment
                                Received
                              </Badge>
                            ) : (
                              <Badge className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 gap-1">
                                <Clock className="w-3 h-3" /> Pending Payment
                              </Badge>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {order.phone}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {order.address}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">
                            Produce:{" "}
                          </span>
                          <span className="font-medium">
                            {order.produceName}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}
                            — {order.quantity}
                          </span>
                        </p>
                        {/* Payment breakdown */}
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
                          <span className="text-muted-foreground">
                            Produce:{" "}
                            <span className="text-foreground">
                              ₹{order.productTotal.toLocaleString()}
                            </span>
                          </span>
                          <span className="text-muted-foreground">|</span>
                          <span className="text-muted-foreground">
                            Delivery:{" "}
                            <span className="text-foreground">
                              {order.deliveryCharge === 0
                                ? "Free"
                                : `₹${order.deliveryCharge}`}
                            </span>
                          </span>
                          <span className="text-muted-foreground">|</span>
                          <span className="font-semibold text-foreground">
                            Total: ₹{order.grandTotal.toLocaleString()}
                          </span>
                        </div>
                        {order.notes && (
                          <p className="text-xs text-muted-foreground italic">
                            {order.notes}
                          </p>
                        )}
                      </div>
                      {isAdmin ? (
                        <div className="flex flex-col gap-2 sm:w-40">
                          <Select
                            value={order.status}
                            onValueChange={(v) =>
                              updateStatus(order.id, v as Order["status"])
                            }
                          >
                            <SelectTrigger
                              data-ocid={`delivery.order_status.select.${idx + 1}`}
                              className="h-8 text-xs"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Dispatched">
                                Dispatched
                              </SelectItem>
                              <SelectItem value="Delivered">
                                Delivered
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            data-ocid={`delivery.payment_toggle.button.${idx + 1}`}
                            variant={
                              order.paymentReceived ? "outline" : "default"
                            }
                            size="sm"
                            className={`text-xs h-8 gap-1 ${order.paymentReceived ? "border-green-300 text-green-700 hover:bg-green-50" : ""}`}
                            onClick={() => togglePayment(order.id)}
                          >
                            {order.paymentReceived ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" /> Received
                              </>
                            ) : (
                              <>
                                <IndianRupee className="w-3 h-3" /> Mark
                                Received
                              </>
                            )}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
