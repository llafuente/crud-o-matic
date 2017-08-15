// Define Webpack public path in order to properly server static assets
const resolvePublicPath = () => {
  // Take into account NOVA's junction
  const uuaa: string = window.location.pathname.indexOf("ENOA") > -1 ? "ENOA" : undefined;
  const pathnameElement: Element = document.head.querySelector("[property='nova:serviceName']");
  let serviceName = "/";

  if (pathnameElement) {
    const pathname: string = pathnameElement.getAttribute("content");

    if (pathname && pathname !== "${serviceName}") {
      if (uuaa) {
        serviceName = serviceName + uuaa + "/";
      }

      serviceName = serviceName + pathname + "/";
    }
  }

  return serviceName;
};

declare let __webpack_public_path__: string;
__webpack_public_path__ = resolvePublicPath();

// Polyfills
import "core-js/es6/array";
import "core-js/es6/date";
import "core-js/es6/function";
import "core-js/es6/map";
import "core-js/es6/math";
import "core-js/es6/number";
import "core-js/es6/object";
import "core-js/es6/parse-float";
import "core-js/es6/parse-int";
import "core-js/es6/reflect";
import "core-js/es6/regexp";
import "core-js/es6/set";
import "core-js/es6/string";
import "core-js/es6/symbol";

import "core-js/es7/reflect";
import "zone.js/dist/zone";

// This should be only imported during development. Use at your own risk.
import "zone.js/dist/long-stack-trace-zone";
