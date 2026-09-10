var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// vat-proxy.js
var RD = "https://rdws.rd.go.th/JsonRD/VATserviceRD3.asmx";
var NS = "https://rdws.rd.go.th/JserviceRD3/vatserviceRD3";
var OK_ORIGIN = /* @__PURE__ */ __name((o) => !!o && (/^https:\/\/(www\.)?jwicconsulting\.com$/.test(o) || /^https:\/\/[a-z0-9-]+\.github\.io$/.test(o) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o)), "OK_ORIGIN");
var cors = /* @__PURE__ */ __name((origin) => ({
  "Access-Control-Allow-Origin": OK_ORIGIN(origin) ? origin : "https://www.jwicconsulting.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin"
}), "cors");
var json = /* @__PURE__ */ __name((body, status, origin, extra = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", ...cors(origin), ...extra }
}), "json");
var one = /* @__PURE__ */ __name((v) => {
  const s = Array.isArray(v) ? v[0] : v;
  const t = String(s ?? "").trim();
  return t === "-" ? "" : t;
}, "one");
function address(r) {
  const bits = [
    one(r.HouseNumber) && "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 " + one(r.HouseNumber),
    one(r.MooNumber) && "\u0E2B\u0E21\u0E39\u0E48 " + one(r.MooNumber),
    one(r.BuildingName),
    one(r.FloorNumber) && "\u0E0A\u0E31\u0E49\u0E19 " + one(r.FloorNumber),
    one(r.RoomNumber) && "\u0E2B\u0E49\u0E2D\u0E07 " + one(r.RoomNumber),
    one(r.VillageName),
    one(r.SoiName) && "\u0E0B\u0E2D\u0E22" + one(r.SoiName),
    one(r.StreetName) && "\u0E16\u0E19\u0E19" + one(r.StreetName)
  ].filter(Boolean).join(" ");
  const bkk = one(r.Province) === "\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E\u0E21\u0E2B\u0E32\u0E19\u0E04\u0E23";
  const area = [
    one(r.Thambol) && (bkk ? "\u0E41\u0E02\u0E27\u0E07" : "\u0E15\u0E33\u0E1A\u0E25") + one(r.Thambol),
    one(r.Amphur) && (bkk ? "\u0E40\u0E02\u0E15" : "\u0E2D\u0E33\u0E40\u0E20\u0E2D") + one(r.Amphur)
  ].filter(Boolean).join(" ");
  return { line1: bits, line2: area, province: one(r.Province), post: one(r.PostCode) };
}
__name(address, "address");
var vat_proxy_default = {
  async fetch(req, env, ctx) {
    const origin = req.headers.get("Origin");
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method !== "GET") return json({ error: "method" }, 405, origin);
    if (origin && !OK_ORIGIN(origin)) return json({ error: "origin" }, 403, origin);
    if (env && env.RL) {
      const ip = req.headers.get("CF-Connecting-IP") || "0";
      const { success } = await env.RL.limit({ key: ip });
      if (!success) return json({ ok: false, code: "rate", message: "\u0E04\u0E49\u0E19\u0E16\u0E35\u0E48\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B \u0E23\u0E2D\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" }, 429, origin);
    }
    const q = new URL(req.url).searchParams;
    const tin = (q.get("tin") || "").replace(/\D/g, "");
    const branch = (q.get("branch") || "").replace(/\D/g, "");
    if (tin.length !== 13) return json({ ok: false, code: "badtin", message: "\u0E40\u0E25\u0E02\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E15\u0E31\u0E27\u0E1C\u0E39\u0E49\u0E40\u0E2A\u0E35\u0E22\u0E20\u0E32\u0E29\u0E35\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02 13 \u0E2B\u0E25\u0E31\u0E01" }, 400, origin);
    const key = new Request(new URL("/v1/" + tin + "/" + (branch || "0"), req.url).toString(), { method: "GET" });
    const hit = await caches.default.match(key);
    if (hit) {
      const h = new Headers(hit.headers);
      Object.entries(cors(origin)).forEach(([k, v]) => h.set(k, v));
      h.set("x-cache", "hit");
      return new Response(hit.body, { status: hit.status, headers: h });
    }
    const env_ = env || {};
    const body = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Service xmlns="' + NS + '"><username>' + (env_.RD_USER || "anonymous") + "</username><password>" + (env_.RD_PASS || "anonymous") + "</password><TIN>" + tin + "</TIN><Name></Name><ProvinceCode>0</ProvinceCode><BranchNumber>" + (branch ? Number(branch) : 0) + "</BranchNumber><AmphurCode>0</AmphurCode></Service></soap:Body></soap:Envelope>";
    let xml;
    try {
      const r = await fetch(RD, {
        method: "POST",
        body,
        headers: { "content-type": "text/xml; charset=utf-8", "SOAPAction": '"' + NS + '/Service"' },
        signal: AbortSignal.timeout(2e4)
      });
      if (!r.ok) return json({ ok: false, code: "rd", message: "\u0E01\u0E23\u0E21\u0E2A\u0E23\u0E23\u0E1E\u0E32\u0E01\u0E23\u0E15\u0E2D\u0E1A " + r.status }, 502, origin);
      xml = await r.text();
    } catch (e) {
      return json({ ok: false, code: "net", message: "\u0E15\u0E48\u0E2D\u0E01\u0E23\u0E21\u0E2A\u0E23\u0E23\u0E1E\u0E32\u0E01\u0E23\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E43\u0E19\u0E15\u0E2D\u0E19\u0E19\u0E35\u0E49" }, 504, origin);
    }
    const m = xml.match(/<ServiceResult[^>]*>([\s\S]*?)<\/ServiceResult>/);
    if (!m) return json({ ok: false, code: "parse", message: "\u0E2D\u0E48\u0E32\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E32\u0E01\u0E01\u0E23\u0E21\u0E2A\u0E23\u0E23\u0E1E\u0E32\u0E01\u0E23\u0E44\u0E21\u0E48\u0E2D\u0E2D\u0E01" }, 502, origin);
    const raw = m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    let d;
    try {
      d = JSON.parse(raw);
    } catch {
      return json({ ok: false, code: "parse", message: "\u0E2D\u0E48\u0E32\u0E19\u0E04\u0E33\u0E15\u0E2D\u0E1A\u0E08\u0E32\u0E01\u0E01\u0E23\u0E21\u0E2A\u0E23\u0E23\u0E1E\u0E32\u0E01\u0E23\u0E44\u0E21\u0E48\u0E2D\u0E2D\u0E01" }, 502, origin);
    }
    const clean = /* @__PURE__ */ __name((x) => String(x).split(/<br\s*\/?>/i)[0].replace(/<[^>]*>/g, "").trim(), "clean");
    const err = (d.msgerr || []).map(clean).filter(Boolean);
    if (err.length || !one(d.Name)) {
      return json({ ok: false, code: "notfound", message: err[0] || "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E40\u0E25\u0E02\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E15\u0E31\u0E27\u0E1C\u0E39\u0E49\u0E40\u0E2A\u0E35\u0E22\u0E20\u0E32\u0E29\u0E35\u0E19\u0E35\u0E49\u0E43\u0E19\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19" }, 200, origin);
    }
    const out = {
      ok: true,
      tin: one(d.NID) || tin,
      name: [one(d.TitleName), one(d.Name)].filter(Boolean).join(" "),
      surname: one(d.Surname),
      branchNumber: String(Array.isArray(d.BranchNumber) ? d.BranchNumber[0] : d.BranchNumber ?? 0).padStart(5, "0"),
      branchName: [one(d.BranchTitleName), one(d.BranchName)].filter(Boolean).join(" "),
      vatFrom: one(d.BusinessFirstDate),
      ...address(d)
    };
    const res = json(out, 200, origin, { "cache-control": "public, max-age=21600" });
    ctx.waitUntil(caches.default.put(key, res.clone()));
    return res;
  }
};

// C:/Users/Admin/AppData/Local/npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/Admin/AppData/Local/npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-WW6Tym/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = vat_proxy_default;

// C:/Users/Admin/AppData/Local/npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-WW6Tym/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=vat-proxy.js.map
