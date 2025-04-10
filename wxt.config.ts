import wasm from "vite-plugin-wasm";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    // TODO: review permissions, move to the optional permissions?
    permissions: [
      "scripting",
      "tabs",
      "declarativeNetRequest",
      "declarativeNetRequestFeedback",
      "browsingData",
      "webNavigation",
      "storage",
    ],
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; object-src 'self' 'wasm-unsafe-eval'; worker-src 'self' 'wasm-unsafe-eval';",
    },
  },
  webExt: {
    chromiumArgs: [
      "--user-data-dir=./.wxt/chrome-data",
      "--auto-open-devtools-for-tabs",
      "--hide-crash-restore-bubble",
      "--enable-extension-activity-logging",
    ],
    startUrls: [
      "https://baloonza.com/",
      // Doesn't work due to https://github.com/mozilla/web-ext/pull/2774
      // "chrome://extensions",
      // "chrome://inspect/#service-workers",
    ],
  },
  outDir: "dist",
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    build: {
      target: "esnext",
      format: "es",
    },
    resolve: {
      alias: [
        {
          find: "bson",
          replacement: require.resolve("bson"),
        },
      ],
    },
    optimizeDeps: {
      // Don't optimize these packages as they contain web workers and WASM files.
      // https://github.com/vitejs/vite/issues/11672#issuecomment-1415820673
      exclude: ["@journeyapps/wa-sqlite", "@powersync/web"],
      include: ["@powersync/web > js-logger"],
    },
    plugins: [wasm()],
    worker: {
      format: "es",
      plugins: () => [wasm()],
    },
  }),
});
