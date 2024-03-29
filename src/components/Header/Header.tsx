"use client";

import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import { Basket } from "~/assets/svg/Basket";
import { Cross } from "~/assets/svg/Cross";
import { Rings } from "~/assets/svg/Rings";
import { capitalize, cn } from "~/lib/helpers/client";
import {
  BASE_ADMIN_ROUTE,
  BASKET_ICON_TESTID,
  BASKET_ROUTE,
  HOME_ROUTE,
  PRODUCTS_ROUTE,
} from "~/lib/constants";
import { AdminHeader } from "./AdminHeader";
import { usePathname } from "next/navigation";

const navigationLinks = [
  {
    route: HOME_ROUTE,
    text: "accueil",
  },

  {
    route: PRODUCTS_ROUTE,
    text: "créations",
  },

  {
    route: HOME_ROUTE + "#categories",
    text: "catégories",
  },

  {
    route: BASKET_ROUTE,
    text: "panier",
  },
];

export const Header = () => {
  const [isOpen, toggle] = useReducer((prev) => !prev, false);
  const currentRoute = usePathname();
  const isAdmin = currentRoute.includes(BASE_ADMIN_ROUTE);
  const isHome = currentRoute === HOME_ROUTE;
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const headerClasses = cn(
    "bg-white",
    "text-primary-background-color",
    "shadow-box-shadow-values",
    "relative",
    "z-30",
    "h-16",
    "overflow-hidden",
    isHome ? "absolute left-0 top-0 bg-opacity-75 w-full" : "",
  );

  if (isAdmin) return <AdminHeader />;

  return (
    <header className={headerClasses}>
      <nav
        className="mx-auto flex h-full items-center justify-between px-2 md:max-w-[1200px]"
        aria-labelledby="primary-navigation"
      >
        <div
          className={cn(
            "text-primary-color",
            "fixed",
            "inset-0",
            "z-10",
            "flex",
            "h-screen",
            "max-h-screen",
            isOpen ? "translate-x-0" : "translate-x-full",
            "flex-col",
            "overscroll-contain",
            "border-none",
            "bg-white",
            "p-0",
            "capitalize",
            "transition-transform",
            "duration-500",
            "ease-in-out",
            "after:flex-1",
            "after:content-['']",
          )}
          id="main-menu"
        >
          <button
            className="absolute right-1 top-1"
            id="main-menu-close-button"
            onClick={toggle}
          >
            <Cross className="m-1" />
          </button>
          <ul className="flex-2 flex h-full flex-col justify-center">
            {navigationLinks.map((link, index) => {
              return (
                <li
                  key={index}
                  className={cn(
                    "relative",
                    "my-8",
                    "w-full",
                    "text-center",
                    currentRoute === link.route ? "bg-secondary" : "",
                  )}
                  onClick={toggle}
                >
                  <Link
                    className="text-primary mx-auto text-2xl"
                    href={link.route}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          className="mr-8 flex flex-col items-start justify-center gap-[5.6px] border-0 bg-transparent pl-5 md:hidden"
          id="burger-button"
          onClick={toggle}
        >
          <span className="border-primary bg-primary w-[23px] border-[1.6px] border-solid"></span>
          <span className="border-primary bg-primary w-[23px] border-[1.6px] border-solid"></span>
          <span className="border-primary bg-primary w-[23px] border-[1.6px] border-solid"></span>
        </button>
        <Link
          className="8px text-primary m-0 flex items-center justify-center"
          href={HOME_ROUTE}
        >
          <div className="flex items-center gap-1">
            <div className="z-1 border-primary fill-primary after:bg-secondary relative mt-[5px] flex h-[46.25px] w-[46.25px] items-center justify-center border-[1.12px] border-solid after:absolute after:inset-[0.41px] after:z-0 after:content-['']">
              <div className="z-[3]">
                <Rings className="relative" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-no-underline border-t-solid whitespace-nowrap text-[25px]">
                JEGWELL
              </span>
              <span className="text-[11px]">BIJOUX FAITS-MAIN</span>
            </div>
          </div>
        </Link>
        <ul className="hidden max-w-[500px] flex-1 justify-between md:flex">
          {navigationLinks.map((link) => {
            return (
              <li key={link.text}>
                <Link className="text-primary mx-auto" href={link.route}>
                  {capitalize(link.text)}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          className="flex h-[100%] items-center justify-end"
          href={BASKET_ROUTE}
          data-testid={BASKET_ICON_TESTID}
        >
          <Basket className="stroke-primary w-[35px] fill-transparent stroke-[20px]" />
        </Link>
      </nav>
    </header>
  );
};
