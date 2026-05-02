import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Marketplace } from "./components/Marketplace";
import { UploadProduct } from "./components/UploadProduct";
import { Dashboard } from "./components/Dashboard";
import { Chatbot } from "./components/Chatbot";
import { Recycling } from "./components/Recycling";
import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";
import { Leaf, ShoppingBag, Recycle, BarChart3, ChevronRight, Globe, Bot, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Toaster } from "sonner";

export default function App() {
  const [view, setView] = useState<'home' | 'marketplace' | 'upload' | 'dashboard' | 'recycle'>('home');
  const { user, loading, login } = useAuth();

  const handleNavigate = (newView: 'home' | 'marketplace' | 'upload' | 'dashboard' | 'recycle') => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderView = () => {
    switch (view) {
      case 'marketplace': return <Marketplace />;
      case 'upload': return <UploadProduct onSuccess={() => handleNavigate('dashboard')} />;
      case 'dashboard': return <Dashboard />;
      case 'recycle': return <Recycling onBack={() => handleNavigate('home')} onScan={() => handleNavigate('upload')} />;
      default: return <Home 
        onStart={() => handleNavigate('marketplace')} 
        onList={() => handleNavigate('upload')} 
        onRecycle={() => handleNavigate('recycle')} 
      />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-6 bg-[#0a0a0a]">
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-2xl">
          <span className="text-black font-display font-black text-3xl">R</span>
        </div>
        <p className="text-3xl font-display font-bold tracking-[0.3em] text-white uppercase">RELEATHER</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground selection:bg-primary/20">
      <Navbar onNavigate={handleNavigate} currentView={view} />
      
      <main className="container mx-auto px-6 py-32 relative z-10">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderView()}
        </motion.div>
      </main>

      <Chatbot />
      <Toaster richColors position="top-right" />
      
      <footer className="border-t border-white/10 py-12 mt-20 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xl">
                <span className="text-black font-display font-black text-xl">R</span>
              </div>
              <span className="text-2xl font-display font-bold tracking-[0.2em] text-white uppercase pt-1">
                RELEATHER
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering the circular economy through intelligent leather reuse. 
              Reduce waste, restore value, and recycle responsibly.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm">Platform</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><button onClick={() => handleNavigate('marketplace')} className="hover:text-primary">Browse Marketplace</button></li>
              <li><button onClick={() => handleNavigate('upload')} className="hover:text-primary">Sell Product</button></li>
              <li><button onClick={() => handleNavigate('dashboard')} className="hover:text-primary">Impact Dashboard</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm">Sustainability</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>How we measure CO₂</li>
              <li>Recycling Partners</li>
              <li>Leather Care Guide</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-[10px] text-muted-foreground uppercase tracking-widest text-center">
          © 2026 ReLeather Circular Systems • Crafted with AI Sustainability
        </div>
      </footer>
    </div>
  );
}

interface HomeProps {
  onStart: () => void;
  onList: () => void;
  onRecycle: () => void;
}

function Home({ onStart, onList, onRecycle }: HomeProps) {
  const { user } = useAuth();
  
  return (
    <div className="space-y-40">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-12 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-10"
        >
          <div className="flex justify-center">
            <div className="glass px-5 py-2 rounded-full border-green-500/20 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-green-500/90 font-black">
                AI ENGINE V4.2 ACTIVE
              </p>
            </div>
          </div>
          
          <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-display font-bold text-white leading-[0.9] tracking-tighter uppercase max-w-6xl">
            Submit your <br />
            <span className="text-secondary italic serif-heading tracking-tight normal-case">Leather Goods</span>
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-white/60 max-w-3xl leading-relaxed font-light font-sans"
        >
          Upload a photo. Our proprietary AI analyzes grain density, age, and condition to determine instant market value and sustainability routes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 pt-8"
        >
          <Button 
            onClick={onStart}
            className="luxury-gradient text-white h-16 px-12 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase shadow-2xl hover:scale-105 transition-transform"
          >
            Enter the Atelier
          </Button>
          <Button 
            variant="outline"
            onClick={onList}
            className="glass border-white/60 h-16 px-12 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-white/20 transition-all font-sans"
          >
            Run Material Scan
          </Button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="glass p-12 rounded-[3.5rem] space-y-8 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl group">
          <div className="w-16 h-16 luxury-gradient rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <ShoppingBag className="text-white h-7 w-7" />
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-secondary font-bold">01 / Atelier</p>
            <h3 className="text-4xl font-display font-bold text-foreground">Curated <br />Resale</h3>
            <p className="text-muted-foreground font-light leading-relaxed font-sans text-sm">
              Exquisite, pre-owned leather gems authenticated through a standard of luxury that respects heritage and longevity.
            </p>
          </div>
        </div>
        
        <div className="luxury-gradient p-12 rounded-[3.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/10">
            <Bot className="text-white h-7 w-7" />
          </div>
          <div className="space-y-4 relative z-10">
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-60 font-bold text-white">02 / Ledger</p>
            <h3 className="text-4xl font-display font-bold text-white">AI <br />Diagnostics</h3>
            <p className="opacity-80 font-light leading-relaxed font-sans text-sm">
              Proprietary vision models identifying quality, origin, and market value to secure the digital passport of your material.
            </p>
          </div>
        </div>

        <div 
          className="glass p-12 rounded-[3.5rem] space-y-8 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer"
          onClick={onRecycle}
        >
          <div className="w-16 h-16 luxury-gradient rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Recycle className="text-white h-7 w-7" />
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-secondary font-bold">03 / Path</p>
            <h3 className="text-4xl font-display font-bold text-foreground">Circular <br />Future</h3>
            <p className="text-muted-foreground font-light leading-relaxed font-sans text-sm pb-4">
              When a journey ends, a new one begins. Direct routing to premium recyclers for zero-waste leather reclamation.
            </p>
            <Button variant="link" className="p-0 h-auto text-secondary text-[10px] uppercase font-black tracking-widest gap-2 group-hover:gap-4 transition-all">
              Initiate Recycling <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Philosophy Area */}
      <section className="glass rounded-[4rem] p-16 md:p-32 flex flex-col md:flex-row gap-24 items-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
        <div className="flex-1 space-y-10 relative z-10">
          <div className="space-y-4">
             <h4 className="text-[12px] uppercase tracking-[0.5em] font-black text-secondary">Heritage Report</h4>
             <h2 className="text-6xl font-display font-extrabold leading-tight tracking-tight text-foreground italic">Restoring <br />the <span className="text-primary not-italic">Premium Standard</span></h2>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed font-light font-sans">
            Quality is the ultimate sustainability. At ReLeather, we believe premium leather shouldn't disappear. Our technical circularity ecosystem extends the life of luxury by decades, not just months.
          </p>
          <div className="grid grid-cols-2 gap-12 py-6">
            <div className="space-y-2 border-l-2 border-secondary/20 pl-6">
              <p className="text-6xl font-display font-extrabold text-primary">22k</p>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">Gallons / Restored</p>
            </div>
            <div className="space-y-2 border-l-2 border-primary/20 pl-6">
              <p className="text-6xl font-display font-extrabold text-secondary">158kg</p>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">Carbon Deflection</p>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
            <img 
              src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1200" 
              alt="Premium Bag" 
              className="w-[450px] aspect-[4/5] object-cover rounded-[3rem] shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
