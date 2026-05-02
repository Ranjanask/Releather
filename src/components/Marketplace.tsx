import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import { Product } from "../types";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Search, ChevronRight, AlertCircle, QrCode, X, ShoppingBag } from "lucide-react";
import { Input } from "./ui/input";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";

export function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProducts(category === "All" ? undefined : category);
        setProducts(data.filter(p => p.status === "available"));
        setLoading(false);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(p => 
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase())) &&
    (category === "All" || p.category === category)
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-10 items-center justify-between pb-10 border-b border-border/20">
        <div className="space-y-2">
          <h1 className="text-6xl font-display font-bold tracking-tight">The <span className="text-primary serif-heading italic">Atelier</span></h1>
          <p className="text-muted-foreground text-xl font-light font-sans">Rediscovering heritage leather gems through a digital lens.</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40" />
            <Input 
              placeholder="Search for archives..." 
              className="glass border-white/40 h-16 rounded-full pl-16 pr-8 focus:ring-secondary/20 focus:border-secondary/30 text-lg transition-all font-sans tracking-tight"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="glass h-16 rounded-full px-8 py-2 text-[10px] tracking-[0.25em] uppercase font-bold focus:outline-none focus:ring-1 focus:ring-secondary/30 min-w-[200px] font-sans appearance-none opacity-80"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Collections</option>
            <option value="Bag">Leather Bags</option>
            <option value="Jacket">Outerwear</option>
            <option value="Shoes">Footwear</option>
            <option value="Accessories">Small Goods</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 space-y-3">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="h-5 w-5" />
            Marketplace Error
          </div>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.map((p) => (
            <Card key={p.id} className="glass group overflow-hidden border-white/40 shadow-sm hover:shadow-2xl transition-all duration-700 rounded-[2.5rem] flex flex-col h-full border-b-[6px] border-b-secondary/10 relative">
              <div className="aspect-[3/4] overflow-hidden relative cursor-crosshair">
                <img 
                  src={p.imageUrl} 
                  alt={p.title} 
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                />
                
                {/* QR Code Trigger Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
                  <div 
                    className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl border border-white/30"
                    onClick={() => setSelectedPassport(p.id)}
                  >
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black">Digital Passport</p>
                </div>

                <div className="absolute top-6 right-6">
                  <Badge className="glass px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] font-black border-white/40 text-primary">
                    {p.condition}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-8 pb-4">
                <div className="space-y-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-secondary font-bold mb-1">{p.brand || 'ARTISAN COLLECTION'}</p>
                  <h3 className="font-display font-bold text-2xl leading-tight group-hover:text-secondary transition-colors italic">{p.title}</h3>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-1 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-display font-bold text-foreground">₹{p.price.toLocaleString()}</span>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-[0.4em] font-bold font-sans">Heritage Archive</span>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0 mt-auto flex justify-center pb-12">
                <Button 
                  onClick={() => setShowPayment(p)}
                  className="w-full h-14 rounded-full luxury-gradient shadow-xl text-[10px] uppercase tracking-[0.3em] font-bold group-hover:translate-y-[-4px] transition-transform flex items-center justify-center gap-3 text-white border-none"
                >
                  <ShoppingBag className="h-3 w-3" />
                  <span>Secure Archive</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <QrCode className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground">No products found for your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Digital Passport Modal */}
      <AnimatePresence>
        {selectedPassport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedPassport(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass max-w-md w-full p-12 rounded-[3rem] border-white/20 text-center space-y-8 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#111111]/80"
              onClick={(e) => e.stopPropagation()}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-6 right-6 text-white/40 hover:text-white"
                onClick={() => setSelectedPassport(null)}
              >
                <X className="h-6 w-6" />
              </Button>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.5em] text-secondary font-bold">Encrypted Archive</p>
                <h2 className="text-4xl font-display font-bold text-white uppercase tracking-tighter">Digital Passport</h2>
                <div className="h-[1px] w-12 bg-secondary mx-auto mt-4" />
              </div>

              <div className="bg-white p-8 rounded-[2rem] inline-block shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <QRCodeSVG 
                  value={`https://releather.app/passport/${selectedPassport}`} 
                  size={200}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  Scan to verify the full material DNA, ownership ledger, and verified heritage credentials of this archive piece.
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-secondary pt-4">
                  <span className="px-3 py-1 border border-secondary/30 rounded-full">Origin: Verified</span>
                  <span className="px-3 py-1 border border-secondary/30 rounded-full">Grain: Authentic</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Payment Gateway Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
            onClick={() => setShowPayment(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-sm w-full p-0 rounded-[2.5rem] border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#5f259f] p-8 flex flex-col items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-[#5f259f] font-black text-2xl">पे</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black tracking-[0.3em] uppercase opacity-80">PhonePe</p>
                  <p className="text-xl font-display font-bold tracking-tight">ACCEPTED HERE</p>
                </div>
              </div>

              <div className="p-10 space-y-8 text-center bg-white">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Scan & Pay Using PhonePe App</p>
                
                <div className="p-4 bg-zinc-50 rounded-3xl inline-block border border-zinc-100 shadow-inner">
                  <QRCodeSVG 
                    value={`upi://pay?pa=ranjana@phonepe&pn=RANJANA&am=${showPayment.price}&cu=INR`} 
                    size={220}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-icon.png",
                      x: undefined, y: undefined, height: 40, width: 40, excavate: true,
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-zinc-900 font-display font-black text-2xl uppercase tracking-tighter">RANJANA</p>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.3em]">Verified Archive Merchant</p>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <p className="text-[9px] text-zinc-300 font-sans leading-relaxed px-4">
                    © 2026, All rights reserved, PhonePe Ltd (Formerly known as 'PhonePe Private Ltd')
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowPayment(null)}
                className="w-full h-16 bg-black text-white rounded-none font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-zinc-900"
              >
                Close Portal
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
