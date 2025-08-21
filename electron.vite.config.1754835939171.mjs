// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
var electron_vite_config_default = defineConfig({
  main: {
    entry: "src/main/index.js",
    // أو index.js حسب ملفك
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    entry: "src/preload/index.js",
    // أو index.js حسب ملفك
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [vue(), tailwindcss()]
  }
});
export {
  electron_vite_config_default as default
};
