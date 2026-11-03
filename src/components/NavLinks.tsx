"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/SideMenu";

/**
 * Navigasi navbar untuk layar desktop. Isinya sama dengan SideMenu agar daftar
 * halaman cukup diatur di satu tempat. Halaman aktif ditandai teks tebal dan
 * titik bulat berwarna ink miliknya.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
      {navItems
        .filter((item) => !item.hidden)
        .map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{ "--ink": item.ink } as CSSProperties}
                className={`nav-link flex items-center gap-1.5 py-1.5 px-2.5 font-mono text-sm whitespace-nowrap no-underline transition-colors duration-150 hover:text-foreground focus-visible:text-foreground ${isActive ? "text-foreground font-semibold" : "text-muted font-normal"}`}
              >
                {isActive && <span aria-hidden="true" className="nav-link-dot" />}
                {item.label}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
