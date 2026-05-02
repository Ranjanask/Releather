import { motion } from "motion/react";
import { Recycle, MapPin, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RecycleProps {
  onBack?: () => void;
  onScan?: () => void;
}

export function Recycling({ onBack, onScan }: RecycleProps) {
  const steps = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Locate Partner",
      desc: "Find verified premium leather recyclers in our global network."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Verify Assets",
      desc: "Use our AI scanner to confirm material quality for reclamation."
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Secure Routing",
      desc: "Arrange carbon-neutral collection for your archive pieces."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32">
      <div className="space-y-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-secondary font-bold">Circular Future</p>
        <h1 className="text-7xl font-display font-black tracking-tighter uppercase">Zero-Waste <br /><span className="text-primary serif-heading italic normal-case tracking-tight">Reclamation</span></h1>
        <p className="text-muted-foreground text-xl font-light font-sans max-w-2xl mx-auto italic leading-relaxed">
          When a journey ends, a new legacy begins. Our direct routing system connects your degraded leather assets with world-class reclamation partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[3rem] border-white/10 space-y-6 group hover:border-primary/20 transition-all"
          >
            <div className="w-14 h-14 luxury-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-white">{step.title}</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="luxury-gradient rounded-[4rem] p-16 md:p-24 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -z-0" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-display font-black text-white uppercase leading-[0.9] tracking-tighter">
                Initiate <br /><span className="italic serif-heading normal-case text-secondary tracking-tight">System Routing</span>
              </h2>
              <p className="text-white/60 text-lg font-light leading-relaxed font-sans max-w-md">
                Ready to recycle? Our AI will analyze your material's grain and chemical composition to determine the optimal reclamation path.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onScan}
                className="h-16 px-10 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white/90 shadow-2xl"
              >
                Scan for Recycling
              </Button>
              <Button variant="outline" className="h-16 px-10 rounded-full border-white/20 text-white font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white/10 glass">
                View Partner Map
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 border-2 border-white/10 rounded-[3rem] flex items-center justify-center relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-secondary rounded-[3rem]"
              />
              <Recycle className="h-24 w-24 text-white opacity-40" />
              <div className="absolute -bottom-4 -right-4 glass px-4 py-2 rounded-xl border-green-500/20 text-green-500 text-[10px] uppercase font-black tracking-widest">
                Active System
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
