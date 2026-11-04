// Load traffic-agent scripts with dynamic environment and client-code
(function () {
  var urlParams = new URLSearchParams(window.location.search);

  // This library route never installs or starts an SDK, regardless of URL/localStorage.
  var libraryPage =
    /^\/traffic-agent-performance(?:\.(?:html|php|asp|aspx|jsp))?\/?$/.test(
      location.pathname,
    );
  if (libraryPage) {
    window.__libraryIsolatedRoute = true;
    return;
  }

  // Get environment from URL or localStorage (prod, qa, staging)
  var env = urlParams.get("env") || urlParams.get("environment");
  if (!env) {
    env = localStorage.getItem("katalon-env");
  } else {
    localStorage.setItem("katalon-env", env);
  }

  // Build base URL based on environment
  var baseUrl;
  if (env === null || env === "prod") {
    baseUrl = "https://static.katalon.com";
  } else if (env === "qa") {
    baseUrl = "https://static.qa.katalon.com";
  } else if (env === "staging") {
    baseUrl = "https://static.staging.katalon.com";
  } else {
    baseUrl = `https://static.${env}.katalon.com`;
  }

  // Load truetest-sdk script
  var sdkScript = document.createElement("script");
  sdkScript.src = baseUrl + "/libs/traffic-agent/v1/truetest-sdk.min.js";
  document.head.appendChild(sdkScript);

  // Get client-code from URL query parameter first
  var clientCode =
    urlParams.get("client-code") || urlParams.get("clientCode");

  // Fall back to localStorage if not in URL
  if (!clientCode) {
    clientCode = localStorage.getItem("katalon-client-code");
  } else {
    localStorage.setItem("katalon-client-code", clientCode);
  }

  // Only load traffic-agent script if client-code is set
  if (clientCode) {
    var agentScript = document.createElement("script");
    agentScript.defer = true;
    agentScript.async = true;
    agentScript.setAttribute("client-code", clientCode);
    agentScript.src =
      baseUrl +
      "/libs/traffic-agent/v1/traffic-agent.min.js?q=" +
      Math.floor(Math.random() * 1000000);
    document.head.appendChild(agentScript);

    console.log("Traffic agent loaded:", {
      env: env,
      clientCode: clientCode,
      baseUrl: baseUrl,
    });
  } else {
    console.log(
      "Traffic agent not loaded: no client-code set (env:",
      env + ")",
    );
  }
})();
