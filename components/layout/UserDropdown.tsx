"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";
import { userMenuItems } from "@/lib/constants/navigation";
import { getUserDropdown } from "@/lib/content";

const ud = getUserDropdown();

export default function UserDropdown() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.name || user?.displayName || "User";
  const firstLetter = displayName.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
        aria-label="User menu"
      >
        {firstLetter}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-card-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-card-border">
            <p className="text-sm font-bold text-white truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted truncate">
              {user?.email || ""}
            </p>
          </div>

          <div className="py-1">
            {userMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-card-border py-1">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              {ud.logOut}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
