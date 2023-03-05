import { defineConfig } from "cypress";
import "./js/lib/addRequire.js";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
  },
});
