import { createRequire } from "module";
const require = createRequire(import.meta.url);

global.require = require; //this will make require at the global scope and treat it like the original require