/*
 * Bob chat loader: adds the "Ask Bob" OpenRouter chat widget to the page.
 * Included once per page: <script src="/assets/chat/chat-loader.js" defer></script>
 * Runs only in the visitor's browser: no backend, no keys here. The visitor connects their OWN OpenRouter account (PKCE);
 * the key stays in their tab. Default model: free models only. Hugging Face / Chrome providers OFF.
 */
(function () {
  "use strict";
  if (window.__siteChat) return;           // never load twice
  window.__siteChat = true;

  var me = document.currentScript;
  var base = "/assets/chat/";
  try { var u = new URL(me.src, location.href); base = u.href.slice(0, u.href.lastIndexOf("/") + 1); } catch (e) {}
  var indexUrl = "/site-index.json";
  try { indexUrl = new URL("../../site-index.json", base).pathname; } catch (e) {}
  var path = location.pathname.replace(/index\.html$/, "");

  var suggestions;
  if (/nilabadi-50km-land/.test(path)) {
    suggestions = ["How was land suitability scored?", "Which data sources does this report use?", "What are the main limits of this study?", "What does the Scheduled Area rule mean for buying land?"];
  } else if (/stay-and-rental-sites/.test(path)) {
    suggestions = ["Which zones look best for a homestay?", "How were the rental localities picked?", "What rules apply to homestays here?", "How current is this data?"];
  } else {
    suggestions = ["What is bob.curiosta.com about?", "Summarise the Nilabadi land report", "Which free satellite data did you use?", "How should I read the suitability scores?"];
  }

  var persona = [
    "You are Bob's helper on bob.curiosta.com, a site of desk studies of land, stay and rental sites around Nilabadi, Odisha, built from free satellite and map data (ESA WorldCover, Sentinel-2, Copernicus DEM, JRC Global Surface Water, OpenStreetMap, Bhuvan).",
    "Explain the reports' method, scores, maps and limits in plain words. Ground every answer in this site's pages and cite the pages you used as Markdown links. If the site does not cover something, say so briefly and label any general knowledge as general.",
    "These are desk studies, not site surveys, legal advice or investment advice. Never invent prices, yields, approvals or legal facts. For land purchase, tenancy, Scheduled Area and tribal land rules, or building permissions, tell the visitor to confirm with the local revenue office, a lawyer or the relevant authority before acting.",
    "Never share or guess personal owners, survey numbers or exact private plots. Keep answers short and practical, and politely decline unrelated requests."
  ].join(" ");

  function load() {
    var sc = document.createElement("script");
    sc.src = base + "widget.js";
    sc.async = true;
    sc.setAttribute("data-site-name", "Bob's reports");
    sc.setAttribute("data-default-model", "openrouter/free");
    sc.setAttribute("data-context-selector", "main, body");
    sc.setAttribute("data-exclude", "nav, .nav, footer, .no-index");
    sc.setAttribute("data-index", indexUrl);
    sc.setAttribute("data-page-cap", "8000");
    sc.setAttribute("data-fab-label", "💬 Ask Bob");
    sc.setAttribute("data-persona", persona);
    sc.setAttribute("data-suggestions", JSON.stringify(suggestions));
    sc.setAttribute("data-greeting", "Hi! Ask me how the reports on this site score land, stay and rental sites, which data they use, or what their limits are. I'll link the pages I use.");
    document.body.appendChild(sc);
  }

  // An OpenRouter sign-in return (?code=…&state=…) must be handled straight away; otherwise wait for idle
  // so the chat never competes with the page itself.
  if (/[?&](code|error|state|btw_debug)=/.test(location.search)) load();
  else if ("requestIdleCallback" in window) window.requestIdleCallback(load, { timeout: 2500 });
  else setTimeout(load, 800);
})();
