'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";
import GetStartedButton from "./GetStartedButton";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = ["/login", "/signup", "/forgot-password", "/admin/login"].some(path => 
    pathname?.startsWith(path)
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Auth check
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  if (isAuthPage) return null;

  const handleSubjectsClick = () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.push("/signup");
      return;
    }
    router.push("/subjects");
  };

  const handleSignOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 sm:px-6 py-2.5 transition-all duration-500",
            "bg-[#12121a]/80 backdrop-blur-xl border border-white/[0.08]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
            isScrolled &&
              "bg-[#181824]/90 border-white/[0.12] shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <span className="text-primary-foreground font-black text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block tracking-tighter">Elyaitra</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-full px-2 py-1.5 border border-white/[0.05]">
            <Link
              href="/features"
              className={cn(
                "px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all",
                pathname === "/features" ? "bg-primary text-primary-foreground" : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              Intelligence
            </Link>

            <button
              onClick={handleSubjectsClick}
              className={cn(
                "px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all",
                pathname === "/subjects" ? "bg-primary text-primary-foreground" : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              Modules
            </button>
            
            <Link
              href="/admin/login"
              className="px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-black rounded-full text-white/20 hover:text-primary transition-all flex items-center gap-2"
            >
              <Shield size={10} className="fill-current/10" />
              Node Admin
            </Link>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/10"
              >
                Terminate
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/10"
                >
                  Authorize
                </Link>
                <GetStartedButton />
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500",
            isMobileMenuOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="rounded-[2rem] p-6 bg-[#12121a]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
            <div className="flex flex-col gap-2">
              <Link
                href="/features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                Intelligence
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSubjectsClick();
                }}
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl text-left text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                Modules
              </button>

              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black rounded-2xl text-white/20 hover:text-primary flex items-center justify-center gap-3 bg-white/[0.02]"
              >
                <Shield size={14} />
                Node Admin Portal
              </Link>

              <hr className="my-4 border-white/[0.05]" />

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="px-6 py-4 text-xs font-black uppercase tracking-widest rounded-2xl text-center text-rose-500 bg-rose-500/5 border border-rose-500/10"
                >
                  Terminate Session
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center text-gray-400 border border-white/[0.08] hover:text-white transition-all"
                  >
                    Authorize
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    Initialize
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
