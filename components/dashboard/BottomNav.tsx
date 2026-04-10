"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const items: NavItem[] = [
  { href: "/experience", label: "Bond", icon: "🕯️" },
  { href: "/compatibility", label: "Compatibility", icon: "🔮" },
  { href: "/checkin", label: "Check-In", icon: "💬" },
  { href: "/dashboard", label: "You", icon: "✦" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md safe-area-bottom">
      <div className="mx-auto flex max-w-xl items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70",
                active
                  ? "text-zinc-50"
                  : "text-white/40 hover:text-white/60",
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active && "text-zinc-50",
                )}
              >
                {item.label}
              </span>
              {active && (
                <div className="h-[2px] w-4 rounded-full bg-[#B11226]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
