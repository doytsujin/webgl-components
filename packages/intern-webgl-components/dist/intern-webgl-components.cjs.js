'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./intern-webgl-components.cjs.prod.js");
} else {
  module.exports = require("./intern-webgl-components.cjs.dev.js");
}
