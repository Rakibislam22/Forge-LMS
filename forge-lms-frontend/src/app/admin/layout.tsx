"use client";

import { useSyncExternalStore, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

function getAdminSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(localStorage.getItem("forge_admin_token"));
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = useSyncExternalStore(subscribe, getAdminSnapshot, () => false);

  useEffect(() => {
    if (pathname !== "/admin/login" && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [pathname, isAdmin, router]);

  // Login page is public
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading indicator until authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#15171C] border-t-transparent rounded-full animate-spin" />
          <span className="text-[14px] text-[#5B606B] font-semibold">
            Verifying admin credentials…
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
