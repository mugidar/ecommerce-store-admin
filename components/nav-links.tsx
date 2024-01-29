"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

const NavLinks = () => {
  const currentPath = usePathname();
  const params = useParams();
  const routes = [
    { url: `/${params.storeId}/settings`, name: "settings" },
    { url: `/${params.storeId}/fefe`, name: "fafa" },
  ];

  return (
    <nav>
      <ul className={`flex gap-4 capitalize `}>
        {routes.map((route) => (
          <Link
            className={twMerge(
              "p-2 hover:text-primary/50 transition ",
              currentPath == route.url &&
                "bg-red-400 font-bold text-black dark:text-white"
            )}
            key={route.url}
            href={route.url}
          >
            <li>{route.name} </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;