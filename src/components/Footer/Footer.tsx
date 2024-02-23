"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  BASE_ADMIN_ROUTE,
  DESKTOP_MAX_WIDTH,
  FACEBOOK,
  INSTAGRAM,
  TIKTOK,
} from "~/lib/constants";

export function Footer() {
  const pathname = usePathname();
  const links = [
    { url: INSTAGRAM, text: "Instagram" },
    { url: TIKTOK, text: "Tiktok" },
    { url: FACEBOOK, text: "Facebook" },
  ];

  const isAdmin = pathname.includes(BASE_ADMIN_ROUTE);
  if (isAdmin) return null;
  return (
    <footer className="bg-secondary text-ternary px-5 py-10">
      <div className={`${DESKTOP_MAX_WIDTH} lg:m-auto`}>
        <h2 className="relative text-xs font-bold after:absolute after:-bottom-[6px] after:left-0 after:w-full after:border-b-[1px] after:border-solid after:content-['']">
          RÉSEAUX SOCIAUX
        </h2>
        <ul className="list-none p-5">
          {links.map((link) => (
            <li className="mx-0 my-0" key={crypto.randomUUID()}>
              <Link
                className="text-ternary after:bg-ternary relative justify-start text-xs before:content-[''] after:absolute after:-left-[16px] after:top-1/2 after:h-[3px] after:w-[3px] after:rounded-full"
                href={link.url}
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>

        {/* <h2 className="footer__heading">À PROPOS</h2>
        <ul className="footer__list">
            <li className="footer__items"><a className="footer__links" href="#">CGV</a></li>
        <li className="footer__items"><a className="footer__links" href="#">Mentions Légales</a></li>
            <li className="footer__items"><a className="footer__links" href="#">Livraison</a></li>
            <li className="footer__items"><a className="footer__links" href="#">Contact</a></li>

        </ul> */}
      </div>
    </footer>
  );
}
