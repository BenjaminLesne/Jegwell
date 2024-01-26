// import { withHydrationOverlay } from "@builder.io/react-hydration-overlay/next";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  // transpilePackages: ['@builder.io/react-hydration-overlay'],
  // transpilePackages: ["three"],
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      // We're in the browser build, so we can safely exclude the sharp module
      config.externals.push("sharp");
    }
    // audio support
    // config.module.rules.push({
    //   test: /\.(ogg|mp3|wav|mpe?g)$/i,
    //   exclude: config.exclude,
    //   use: [
    //     {
    //       loader: require.resolve("url-loader"),
    //       options: {
    //         limit: config.inlineImageLimit,
    //         fallback: require.resolve("file-loader"),
    //         publicPath: `${config.assetPrefix}/_next/static/images/`,
    //         outputPath: `${isServer ? "../" : ""}static/images/`,
    //         name: "[name]-[hash].[ext]",
    //         esModule: config.esModule || false,
    //       },
    //     },
    //   ],
    // });

    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },

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
