import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { Basket } from "~/assets/svg/Basket";
import { Cross } from "~/assets/svg/Cross";
import { Rings } from "~/assets/svg/Rings";
import { BASKET_ROUTE, HOME_ROUTE, PRODUCTS_ROUTE } from "~/utils/constants";

export const Header = () => {
  const [isOpen, toggle] = useReducer((prev) => !prev, false);
  const router = useRouter();
  const currentRoute = router.asPath;
  const isHome = currentRoute === HOME_ROUTE;
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
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);
  return (
    <header
      className={`z-1 bg-primary-background-color text-primary-background-color shadow-box-shadow-values relative h-16 ${
        isHome
          ? "bg-primary-background-color absolute left-0 top-0 bg-opacity-75"
          : ""
      }`}
    >
      <nav
        className="mx-auto flex h-full items-center justify-between md:max-w-[1200px]"
        aria-labelledby="primary-navigation"
      >
        <div
          className={`text-primary-color fixed inset-0 z-10 flex h-screen max-h-screen ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } flex-col overscroll-contain
           border-none bg-white p-0 capitalize transition-transform duration-500
            ease-in-out after:flex-1 after:content-['']`}
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
            {navigationLinks.map((link) => {
              return (
                <li
                  key={crypto.randomUUID()}
                  className={`relative my-8 w-full text-center ${
                    currentRoute === link.route ? "bg-secondary" : ""
                  }`}
                  onClick={toggle}
                >
                  <Link
                    className="mx-auto text-2xl text-primary"
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
          className="mr-8 flex flex-col items-start justify-center gap-[5.6px] border-0 bg-transparent pl-5"
          id="burger-button"
          onClick={toggle}
        >
          <span className="w-[23px] border-[1.6px] border-solid border-primary bg-primary"></span>
          <span className="w-[23px] border-[1.6px] border-solid border-primary bg-primary"></span>
          <span className="w-[23px] border-[1.6px] border-solid border-primary bg-primary"></span>
        </button>
        <Link
          className="8px m-0 flex items-center justify-center text-primary"
          href={HOME_ROUTE}
        >
          <div className="flex items-center gap-1">
            <div className="z-1 relative mt-[5px] flex h-[46.25px] w-[46.25px] items-center justify-center border-[1.12px] border-solid border-primary fill-primary after:absolute after:inset-[0.41px] after:z-0 after:bg-secondary after:content-['']">
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
        <Link
          className="mr-[8px] flex h-[100%] items-center justify-end"
          href={BASKET_ROUTE}
        >
          <Basket className=" mr-[19px] w-[35px] fill-transparent stroke-primary stroke-[20px]" />
        </Link>
      </nav>
    </header>
  );
};
