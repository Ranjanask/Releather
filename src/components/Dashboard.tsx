import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { productService } from "../services/productService";
import { Product } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Recycle, 
  Trash2, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Package,
  Calendar,
  AlertCircle,
  Leaf,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    itemsRecycled: 0,
    co2Saved: 0,
    activeListings: 0,
    totalSales: 0
  });

  const [dbError, setDbError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserProducts = async (uid: string) => {
      try {
        setDbError(null);
        const docs = await productService.getProducts(undefined, uid);
        setProducts(docs);
        
        const recycled = docs.filter(d => d.status === 'recycled').length;
        const active = docs.filter(d => d.status === 'available').length;
        const sold = docs.filter(d => d.status === 'sold').length;
        const co2 = (recycled * 12.5) + (sold * 8.2);

        setStats({
          itemsRecycled: recycled,
          co2Saved: co2,
          activeListings: active,
          totalSales: sold
        });
      } catch (error: any) {
        console.error("Dashboard Fetch Error:", error);
        setDbError("Unable to load dashboard data. Please try again later.");
      }
    };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setProducts([]);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(user.email === 'ranjanakote1@gmail.com');
      fetchUserProducts(user.uid);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await productService.updateProduct(id, { status: newStatus as any });
      toast.success(`Product marked as ${newStatus}`);
      // Refresh local state
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      toast.success("Listing removed");
      // Refresh local state
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const chartData = [
    { name: "Active", value: stats.activeListings },
    { name: "Sold", value: stats.totalSales },
    { name: "Recycled", value: stats.itemsRecycled }
  ];

  const COLORS = ["#5A5A40", "#A68A64", "#3D405B"];

  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-6 pb-12 border-b border-border/20">
        <div className="space-y-2">
          <h1 className="text-6xl font-display font-bold tracking-tight">Heritage <span className="text-primary serif-heading italic">Ledger</span></h1>
          <p className="text-muted-foreground text-xl font-light font-sans">Curating your personal legacy in the circular leather economy.</p>
        </div>
        {isAdmin && (
          <Badge className="glass bg-primary/5 text-primary border-primary/20 gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold">
            <ShieldCheck className="h-3 w-3" />
            Registry Access
          </Badge>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="glass p-10 rounded-[2.5rem] border-white/40 shadow-xl relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-secondary mb-4 font-bold relative z-10 font-sans">Archives Active</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <p className="text-6xl font-display font-bold text-foreground">{stats.activeListings}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-sans">Items</p>
          </div>
        </div>
        <div className="glass p-10 rounded-[2.5rem] border-white/40 shadow-xl relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4 font-bold relative z-10 font-sans">Life Extended</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <p className="text-6xl font-display font-bold text-foreground">{stats.itemsRecycled}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-sans">Units</p>
          </div>
        </div>
        <div className="luxury-gradient p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-70 mb-4 font-bold font-sans">CO₂ Deflection</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <p className="text-5xl font-display font-bold">{stats.co2Saved.toFixed(1)}</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 font-sans">kilograms</p>
          </div>
          <div className="w-full bg-white/10 h-0.5 rounded-full mt-6 overflow-hidden">
             <div className="bg-white h-full transition-all duration-1000" style={{ width: `${Math.min((stats.co2Saved / 100) * 100, 100)}%` }}></div>
          </div>
        </div>
        <div className="glass p-10 rounded-[2.5rem] shadow-xl text-foreground relative overflow-hidden group transition-all hover:-translate-y-1 border-white/60">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-secondary mb-4 font-bold relative z-10 font-sans">Store Credits</p>
          <div className="flex items-baseline gap-1 relative z-10">
            <p className="text-5xl font-display font-bold text-foreground">₹{(stats.totalSales * 450).toLocaleString()}</p>
          </div>
          <p className="text-[9px] opacity-40 mt-4 font-bold uppercase tracking-[0.3em] relative z-10 font-sans">Authentic Circular Value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Listings Section */}
        <div className="lg:col-span-8 glass rounded-3xl border-white/20 shadow-sm overflow-hidden flex flex-col">
          <Tabs defaultValue="active" className="w-full h-full flex flex-col">
            <div className="px-8 pt-8 pb-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-display font-black tracking-tight text-primary">My Collection</h3>
              <TabsList className="bg-muted p-1 rounded-full">
                <TabsTrigger value="active" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Active</TabsTrigger>
                <TabsTrigger value="history" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">History</TabsTrigger>
              </TabsList>
            </div>
              <TabsContent value="active" className="m-0">
                <div className="divide-y">
                  {products.filter(p => p.status === 'available').length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground italic text-sm">No active listings.</div>
                  ) : (
                    products.filter(p => p.status === 'available').map(p => (
                      <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors">
                        <img src={p.imageUrl} className="w-16 h-16 object-cover rounded-md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{p.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Listed: {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {isAdmin && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                onClick={() => handleStatusUpdate(p.id, 'recycled')}
                              >
                                <Recycle className="h-4 w-4" /> <span className="hidden sm:inline ml-2">Recycle</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(p.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="history" className="m-0">
                <div className="divide-y">
                  {products.filter(p => p.status !== 'available').map(p => (
                    <div key={p.id} className="p-4 flex items-center gap-4">
                      <img src={p.imageUrl} className="w-16 h-16 object-cover rounded-md grayscale" />
                      <div className="flex-1">
                        <p className="font-medium">{p.title}</p>
                        <Badge variant={p.status === 'sold' ? "secondary" : "outline"} className="capitalize">
                          {p.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{p.price}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{p.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Charts Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-3xl p-8 border-white/20 shadow-sm relative overflow-hidden group">
            <h3 className="text-xs uppercase tracking-widest text-primary/60 font-bold mb-6">Inventory Mix</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
               {chartData.map((e, i) => (
                 <div key={e.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{e.name}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-secondary p-8 rounded-3xl shadow-xl text-white relative overflow-hidden backdrop-blur-xl border border-white/10">
             <p className="italic font-display font-black text-xl leading-tight mb-3">"Circular leather saves 1,500 gallons of water per item."</p>
             <p className="text-[10px] uppercase opacity-60 font-bold">Sustainable Tip • ReLeather AI</p>
             <div className="absolute top-0 right-0 p-2 opacity-10">
                <Leaf className="w-12 h-12" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
