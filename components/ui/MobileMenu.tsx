"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileMenu() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Write Proposal", href: "/", icon: "✍️" },
    { name: "History", href: "/history", icon: "📜" },
  ];

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="p-2 text-white/70 hover:text-white transition-colors">
          <Menu className="w-8 h-8" />
        </SheetTrigger>
        <SheetContent side="left" className="bg-slate-950 border-r border-purple-900/50 p-0 w-72">
          <SheetHeader className="p-6 border-b border-purple-900/50 text-left">
            <SheetTitle className="text-xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              ProposalPilot
            </SheetTitle>
          </SheetHeader>
          
          <nav className="px-6 py-8 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  pathname === link.href 
                    ? "bg-white/10 text-white shadow-lg" 
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">
                  {link.icon}
                </div>
                <span className="font-bold">{link.name}</span>
              </Link>
            ))}
            
            <button className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-white/40 hover:bg-white/5 transition-all text-left">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">⚙️</div>
              <span className="font-bold">Settings</span>
            </button>
          </nav>
          
          <div className="absolute bottom-0 w-full p-6 border-t border-purple-900/50 text-xs text-white/20">
            v1.0 • Ready to Launch
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
