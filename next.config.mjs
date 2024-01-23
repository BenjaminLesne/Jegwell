// import { withHydrationOverlay } from "@builder.io/react-hydration-overlay/next";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  // transpilePackages: ['@builder.io/react-hydration-overlay'],
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["fr"],
    defaultLocale: "fr",
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
};
export default config;
// export default withHydrationOverlay({
//   /**
//    * Optional: `appRootSelector` is the selector for the root element of your app. By default, it is `#__next` which works
//    * for Next.js apps with pages directory. If you are using the app directory, you should change this to `main`.
//    */
//   // appRootSelector: "main",
// })(config);
