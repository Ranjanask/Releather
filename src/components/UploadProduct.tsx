import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { analyzeProductImage, ProductAnalysis } from "../services/gemini";
import { auth } from "../lib/firebase";
import { productService } from "../services/productService";
import { Loader2, Camera, Upload, CheckCircle2, Sparkles, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface UploadProductProps {
  onSuccess: () => void;
}

export function UploadProduct({ onSuccess }: UploadProductProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [listing, setListing] = useState(false);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [details, setDetails] = useState({
    title: "",
    price: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setAnalysis(null);
    }
  };

  const runAnalysis = async () => {
    if (!preview) return;
    setAnalyzing(true);
    try {
      const base64 = preview.split(",")[1];
      const result = await analyzeProductImage(base64);
      setAnalysis(result);
      setDetails(prev => ({
        ...prev,
        price: result.suggestedPrice.toString()
      }));
      toast.success("AI Analysis Complete!");
    } catch (error) {
      console.error(error);
      toast.error("AI Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !analysis || !preview) return;

    setListing(true);
    try {
      await productService.createProduct({
        title: details.title,
        price: Number(details.price),
        suggestedPrice: analysis.suggestedPrice,
        condition: analysis.condition,
        category: analysis.category,
        brand: analysis.brand,
        imageUrl: preview,
        sellerId: auth.currentUser.uid,
        status: "available",
      });
      toast.success("Product listed successfully!");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to list product.");
    } finally {
      setListing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32">
        <div className="space-y-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-secondary font-bold">AI Diagnostics</p>
          <h1 className="text-7xl font-display font-black tracking-tighter uppercase">Submit Your <br /><span className="text-secondary serif-heading italic normal-case tracking-tight">Leather Goods</span></h1>
          <p className="text-muted-foreground text-xl font-light font-sans max-w-xl mx-auto italic leading-relaxed">Securing the digital passport and market value of your archive assets through proprietary vision diagnostics. Every item receives a unique encrypted QR signature.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Upload & Preview */}
        <Card className="glass overflow-hidden border-white/60 shadow-2xl rounded-[3rem]">
          <CardContent className="p-0">
            <div 
              className={`aspect-square flex flex-col items-center justify-center border-4 border-dashed transition-all relative cursor-pointer group
                ${preview ? 'border-transparent' : 'border-white/20 hover:border-primary/40 m-8 rounded-[2rem] bg-white/5 shadow-inner'}`}
              onClick={() => !analyzing && fileInputRef.current?.click()}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="outline" className="gap-3 glass border-white/60 text-[10px] uppercase tracking-widest font-bold h-12 rounded-full px-6">
                      <RefreshCcw className="h-4 w-4" /> Recapture Material
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-6 p-12">
                  <div className="w-32 h-32 luxury-gradient rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform relative">
                    <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 -z-10" />
                    <Camera className="h-12 w-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-display font-bold text-3xl">Scan Item</p>
                    <p className="text-[10px] text-muted-foreground max-w-[200px] mx-auto uppercase tracking-[0.2em] font-bold leading-relaxed font-sans">Vision analysis requires clear, balanced lighting</p>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
              />
            </div>
          </CardContent>
          <CardFooter className="p-10 pt-0">
            <Button 
              className="w-full h-20 text-[11px] font-bold tracking-[0.3em] uppercase luxury-gradient shadow-[0_20px_50px_-10px_rgba(74,74,53,0.3)] rounded-full group-hover:-translate-y-1 transition-all" 
              disabled={!preview || analyzing} 
              onClick={runAnalysis}
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-3" /> Decoding DNA...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3" /> Run Vision Scan
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Right: Form & AI Results */}
        <div className="space-y-6">
          {analysis ? (
            <Card className="glass border-white/30 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700 rounded-[2rem]">
              <CardHeader className="bg-primary/5 py-5 flex flex-row items-center justify-between border-b border-white/10">
                <CardTitle className="text-primary text-sm flex items-center gap-2 font-display font-extrabold uppercase tracking-widest">
                  <Sparkles className="h-4 w-4" /> AI Diagnostics
                </CardTitle>
                <Badge className="glass text-[9px] uppercase tracking-tighter font-black border-white/20 text-primary">
                  Gemini Vision Pro
                </Badge>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex gap-6">
                   <div className="w-28 h-28 rounded-2xl overflow-hidden glass border-white/20 p-1 shadow-inner">
                      <img src={preview!} className="w-full h-full object-cover rounded-xl shadow-lg" />
                   </div>
                   <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Predicted State</p>
                        <p className="text-2xl font-display font-extrabold text-secondary italic">{analysis.condition}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Market Range</p>
                        <p className="text-3xl font-display font-extrabold text-foreground">₹{(analysis.suggestedPrice * 0.9).toFixed(0)} — ₹{analysis.suggestedPrice}</p>
                      </div>
                   </div>
                </div>
                <div className="p-5 glass-dark rounded-2xl text-xs leading-relaxed text-foreground/80 italic font-medium">
                  "{analysis.reasoning}"
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="glass h-48 border-2 border-dashed border-white/20 rounded-[2rem] flex items-center justify-center text-muted-foreground text-sm italic p-8 text-center uppercase tracking-widest leading-loose">
              Upload and analyze image to reveal AI market insights.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/60 ml-2">Title of Item</label>
              <Input 
                placeholder="e.g. Vintage Italian Leather Bag" 
                className="glass border-white/20 h-14 rounded-2xl px-6 focus:ring-primary/40 focus:border-primary/40"
                value={details.title}
                onChange={e => setDetails(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/60 ml-2">Listing Price (₹)</label>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="glass border-white/20 h-14 rounded-2xl px-6 focus:ring-primary/40 focus:border-primary/40"
                value={details.price}
                onChange={e => setDetails(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full py-8 text-xl font-display font-extrabold tracking-tight shadow-xl rounded-2xl bg-accent hover:bg-accent/90" 
              disabled={!analysis || listing}
            >
              {listing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Listing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-6 w-6" /> Confirm & List Item
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
