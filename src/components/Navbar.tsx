import { Button } from "./ui/button";
import { Recycle, LogOut, User as UserIcon, PlusCircle, LayoutDashboard, ShoppingBag, ShieldCheck, QrCode } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  onNavigate: (view: 'home' | 'marketplace' | 'upload' | 'dashboard' | 'recycle') => void;
  currentView: string;
}

export function Navbar({ onNavigate, currentView }: NavbarProps) {
  const { user, login, logout, isLoggingIn } = useAuth();
  const isAdmin = user?.email === 'ranjanakote1@gmail.com';

  return (
    <nav className="fixed top-0 z-50 w-full px-4 py-4 flex justify-center">
      <div className="glass max-w-7xl w-full h-20 px-8 rounded-3xl flex items-center justify-between border-white/10 shadow-2xl">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xl">
            <span className="text-black font-display font-black text-xl">R</span>
          </div>
          <span className="text-2xl font-display font-black tracking-[0.25em] text-white uppercase pt-1">
            RELEATHER
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <button 
            onClick={() => onNavigate('marketplace')}
            className={`text-xs uppercase tracking-[0.25em] font-bold transition-all hover:text-primary relative py-1 ${currentView === 'marketplace' ? 'text-primary' : 'text-foreground/40'}`}
          >
            Atelier
            {currentView === 'marketplace' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />}
          </button>
          {user && (
            <>
              <button 
                onClick={() => onNavigate('upload')}
                className={`text-xs uppercase tracking-[0.25em] font-bold transition-all hover:text-primary relative py-1 ${currentView === 'upload' ? 'text-primary' : 'text-foreground/40'}`}
              >
                Scan
                {currentView === 'upload' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />}
              </button>
              <button 
                onClick={() => onNavigate('recycle')}
                className={`text-xs uppercase tracking-[0.25em] font-bold transition-all hover:text-primary relative py-1 ${currentView === 'recycle' ? 'text-primary' : 'text-foreground/40'}`}
              >
                Recycle
                {currentView === 'recycle' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />}
              </button>
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`text-xs uppercase tracking-[0.25em] font-bold transition-all hover:text-primary relative py-1 ${currentView === 'dashboard' ? 'text-primary' : 'text-foreground/40'}`}
              >
                Account
                {currentView === 'dashboard' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />}
              </button>
              <div className="h-4 w-[1px] bg-white/10 mx-2" />
              <button 
                className="text-foreground/40 hover:text-primary transition-all p-1"
                title="Scan Atelier"
                onClick={() => onNavigate('upload')}
              >
                <QrCode className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Contributor</p>
                <p className="text-sm font-semibold leading-none">{user.displayName}</p>
              </div>
              <img 
                src={user.photoURL || ""} 
                alt="Profile" 
                className="h-10 w-10 rounded-full border-2 border-white/20 transition-transform hover:scale-105"
              />
              <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={login} 
              disabled={isLoggingIn}
              className="luxury-gradient text-white rounded-full px-8 hover:opacity-90 shadow-xl transition-all hover:-translate-y-0.5 text-xs font-bold tracking-widest uppercase h-10"
            >
              {isLoggingIn ? "Member Entry..." : "Member Entry"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
