/* AIMeD.ai — shared runtime for header/footer + small components (GH Pages friendly) */
(async function () {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Base path (works for GitHub Pages project sites)
  const script = document.currentScript || document.querySelector('script[src*="assets/site.js"]');
  const scriptUrl = script ? new URL(script.src, location.href) : new URL(location.href);
  const ASSET_BASE = scriptUrl.pathname.replace(/\/assets\/site\.js.*$/, "/assets/");
  const PAGE_PATH = scriptUrl.pathname.replace(/\/index\.html$/, "/");

  // Load content
  const res = await fetch(ASSET_BASE + "content.json", {cache:"no-store"}).catch(()=>null);
  const DATA = res ? await res.json() : null;

  // Theme (dark-first)
  const themeKey = "aimed.theme";
  const saved = localStorage.getItem(themeKey) || "dark";
  document.documentElement.dataset.theme = saved;

  const withBase = (href) => {
    if (href.startsWith("http")) return href;
    // Convert /path to project-root relative by prefixing with base derived from asset path
    const rootBase = ASSET_BASE.replace(/\/assets\/$/, "/");
    return href.startsWith("/") ? (rootBase.replace(/\/$/, "") + href) : (rootBase + href);
  };

  function headerHTML(){
    const brand = DATA?.brand?.name || "AIMeD";
    const platform = DATA?.brand?.platform || "AMIS";
    const links = [
      {label:"Company", href:"/company/about.html"},
      {label:"Platform", href:"/platform/index.html"},
      {label:"Solutions", href:"/solutions/index.html"},
      {label:"Resources", href:"/resources/index.html"},
      {label:"Contact", href:"/contact/index.html"},
    ];
    const cta1 = "Request a Demo";
    const cta2 = "Talk to an Expert";
    const navLinks = links.map(l => {
      const active = PAGE_PATH.startsWith(l.href.replace(/\.html$/,"")) ? "text-white" : "text-white/70 hover:text-white";
      return `<a class="px-3 py-2 rounded-lg ${active} focus-ring" href="${withBase(l.href)}">${l.label}</a>`;
    }).join("");

    return `
<header class="sticky top-0 z-50">
  <div class="glass">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="flex h-16 items-center justify-between">
        <a class="flex items-center gap-3 focus-ring rounded-lg px-2 py-1" href="${withBase("/index.html")}" aria-label="${brand} home">
          <div class="h-9 w-9 rounded-xl glass-strong grid place-items-center">
            <span class="font-semibold grad-text">A</span>
          </div>
          <div class="leading-tight">
            <div class="text-sm font-semibold">${brand}</div>
            <div class="text-xs text-white/60">Powered by ${platform}</div>
          </div>
        </a>

        <nav class="hidden lg:flex items-center gap-1">${navLinks}</nav>

        <div class="hidden lg:flex items-center gap-2">
          <a class="px-3 py-2 rounded-lg text-white/70 hover:text-white focus-ring" href="${withBase("/contact/index.html#talk")}">${cta2}</a>
          <a class="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-white/90 focus-ring" href="${withBase("/contact/index.html#demo")}">${cta1}</a>
        </div>

        <button id="mnavBtn" class="lg:hidden h-10 w-10 rounded-xl glass grid place-items-center focus-ring" aria-label="Open menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>

    <div id="mnav" class="lg:hidden hidden border-t border-white/10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 py-3 grid gap-1">
        ${links.map(l=>`<a class="px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 focus-ring" href="${withBase(l.href)}">${l.label}</a>`).join("")}
        <div class="flex gap-2 pt-2">
          <a class="flex-1 px-4 py-2 rounded-lg bg-white text-black font-semibold text-center hover:bg-white/90 focus-ring" href="${withBase("/contact/index.html#demo")}">${cta1}</a>
        </div>
      </div>
    </div>
  </div>
</header>`;
  }

  function footerHTML(){
    const year = new Date().getFullYear();
    const cp = DATA?.footer?.copyright || "© AIMeD Pvt. Ltd. All rights reserved.";
    const email = DATA?.footer?.email || "hello@aimed.ai";
    const addr = DATA?.footer?.address || "—";
    return `
<footer class="mt-16">
  <div class="hr"></div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 lg:grid-cols-3">
    <div>
      <div class="text-lg font-semibold">AIMeD</div>
      <div class="text-sm text-white/70 mt-2 max-w-sm">Engineering intelligence foundations for multidomain complexity—powered by AMIS.</div>
      <div class="mt-4 text-sm text-white/60">${addr}</div>
    </div>
    <div class="grid grid-cols-2 gap-6 text-sm">
      <div class="grid gap-2">
        <div class="text-white/60">Company</div>
        <a class="text-white/80 hover:text-white" href="${withBase("/company/about.html")}">About</a>
        <a class="text-white/80 hover:text-white" href="${withBase("/company/labs.html")}">Research & Labs</a>
        <a class="text-white/80 hover:text-white" href="${withBase("/company/careers.html")}">Careers</a>
      </div>
      <div class="grid gap-2">
        <div class="text-white/60">Platform</div>
        <a class="text-white/80 hover:text-white" href="${withBase("/platform/index.html")}">AMIS Overview</a>
        <a class="text-white/80 hover:text-white" href="${withBase("/solutions/index.html")}">Solutions</a>
        <a class="text-white/80 hover:text-white" href="${withBase("/resources/index.html")}">Resources</a>
      </div>
    </div>
    <div class="text-sm">
      <div class="text-white/60">Contact</div>
      <a class="inline-flex mt-2 items-center gap-2 text-white/85 hover:text-white focus-ring rounded-lg px-2 py-1" href="mailto:${email}">
        <span>${email}</span>
        <span class="kbd">email</span>
      </a>
      <div class="mt-6 glass rounded-2xl p-5">
        <div class="font-semibold">Quick actions</div>
        <div class="mt-3 grid gap-2">
          <a class="px-4 py-2 rounded-lg bg-white text-black font-semibold text-center hover:bg-white/90 focus-ring" href="${withBase("/contact/index.html#demo")}">Request a Demo</a>
          <a class="px-4 py-2 rounded-lg badge text-white text-center hover:bg-white/5 focus-ring" href="${withBase("/contact/index.html#talk")}">Talk to an Expert</a>
        </div>
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 pb-10 text-xs text-white/55 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
    <div>${cp} ${year}</div>
    <div class="flex gap-4">
      <a class="hover:text-white" href="${withBase("/privacy.html")}">Privacy</a>
      <a class="hover:text-white" href="${withBase("/terms.html")}">Terms</a>
      <a class="hover:text-white" href="${withBase("/security.html")}">Security</a>
    </div>
  </div>
</footer>`;
  }

  const h = $("#site-header"); if (h) h.innerHTML = headerHTML();
  const f = $("#site-footer"); if (f) f.innerHTML = footerHTML();

  // Mobile nav toggle
  const btn = $("#mnavBtn");
  const mnav = $("#mnav");
  if (btn && mnav) btn.addEventListener("click", () => mnav.classList.toggle("hidden"));

  // Tabs
  $$(".tabs").forEach(root => {
    const tabs = $$(".tab", root);
    const panels = $$(".panel", root);
    function setActive(i){
      tabs.forEach((t,idx)=>{
        t.classList.toggle("bg-white", idx===i);
        t.classList.toggle("text-black", idx===i);
        t.classList.toggle("text-white/80", idx!==i);
      });
      panels.forEach((p,idx)=>p.classList.toggle("hidden", idx!==i));
    }
    tabs.forEach((t,i)=>t.addEventListener("click", ()=>setActive(i)));
    setActive(0);
  });

  // Ecosystem viz
  function ecosystemSVG(){
    const nodes = [
      {id:"Core", x:160, y:160},
      {id:"Data Fabric", x:60, y:70},
      {id:"Modeling & Simulation", x:260, y:80},
      {id:"Decision Orchestration", x:290, y:200},
      {id:"Knowledge Layer", x:230, y:275},
      {id:"Security & Trust", x:100, y:270},
      {id:"Integration Hub", x:40, y:200},
      {id:"Observability", x:80, y:120},
    ];
    const center = nodes[0];
    const lines = nodes.slice(1).map(n=>`<line x1="${center.x}" y1="${center.y}" x2="${n.x}" y2="${n.y}" stroke="rgba(255,255,255,.18)" stroke-width="1.2"/>`).join("");
    const circles = nodes.map((n,i)=>{
      const r = i===0 ? 22 : 14;
      const fill = i===0 ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.12)";
      const stroke = i===0 ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.22)";
      const txt = i===0 ? (DATA?.brand?.platform || "AMIS") : n.id.split(" ")[0];
      const tfill = i===0 ? "#000" : "rgba(255,255,255,.88)";
      return `
        <g class="viz-node" data-label="${n.id}">
          <circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fill}" stroke="${stroke}"></circle>
          <text x="${n.x}" y="${n.y+4}" text-anchor="middle" font-size="${i===0?10:9}" fill="${tfill}" font-weight="600" style="pointer-events:none">${txt}</text>
        </g>`;
    }).join("");
    return `
<svg viewBox="0 0 320 320" class="w-full h-[280px]" role="img" aria-label="AMIS ecosystem visualization">
  <defs>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <g filter="url(#glow)">${lines}</g>
  <g>${circles}</g>
</svg>
<div id="vizTip" class="mt-3 text-sm text-white/70">AMIS Core → governs how modules compose into domain layers.</div>`;
  }
  function enableVizHover(){
    const root = $("#ecosystemViz");
    if (!root) return;
    root.innerHTML = ecosystemSVG();
    const tip = $("#vizTip");
    $$(".viz-node", root).forEach(n=>{
      n.addEventListener("mouseenter", ()=>{
        const lbl = n.dataset.label || "";
        tip.textContent = lbl === "Core" ? "AMIS Core → tenancy, policies, and composition." :
          `${lbl} → plug-in module layer within AMIS.`;
      });
      n.addEventListener("mouseleave", ()=> tip.textContent = "AMIS Core → governs how modules compose into domain layers.");
    });
  }

  // Home render (opt-in)
  const home = $("#home-dynamic");
  if (home) {
    const hl = (DATA?.highlights||[]).slice(0,6);
    home.innerHTML = `
<section class="relative overflow-hidden">
  <canvas id="heroCanvas" class="absolute inset-0 opacity-70"></canvas>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-14 relative">
    <div class="grid lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-7">
        <div class="inline-flex items-center gap-2 badge rounded-full px-3 py-1 text-xs text-white/80">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Powered by <span class="font-semibold">${DATA?.brand?.platform||"AMIS"}</span>
        </div>
        <h1 class="mt-5 text-4xl sm:text-5xl font-semibold leading-tight">
          <span class="grad-text">${DATA?.hero?.title || "AIMeD"}</span>
        </h1>
        <p class="mt-5 text-lg text-white/75 max-w-2xl">${DATA?.hero?.subtitle || ""}</p>
        <p class="mt-3 text-sm text-white/60 max-w-2xl">${DATA?.hero?.micro || ""}</p>

        <div class="mt-7 flex flex-col sm:flex-row gap-3">
          <a class="px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 focus-ring text-center" href="${withBase("/contact/index.html#demo")}">Request a Demo</a>
          <a class="px-5 py-3 rounded-xl badge text-white hover:bg-white/5 focus-ring text-center" href="${withBase("/platform/index.html")}">Explore AMIS Platform</a>
        </div>

        <div class="mt-8 grid sm:grid-cols-2 gap-3">
          ${hl.map(x=>`<div class="glass rounded-2xl p-4 text-sm text-white/80">${x}</div>`).join("")}
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="glass-strong rounded-3xl p-6 shine">
          <div class="text-sm text-white/70">AMIS Core</div>
          <div class="mt-2 text-2xl font-semibold">Multidomain Platform Visualization</div>
          <div class="mt-4" id="ecosystemViz"></div>
          <div class="mt-5 text-xs text-white/60">Hover nodes to see how AMIS composes domain layers.</div>
        </div>
      </div>
    </div>
  </div>
</section>`;
  }

  // Platform modules render (opt-in)
  const plat = $("#platform-dynamic");
  if (plat) {
    const modules = DATA?.amis?.modules || [];
    plat.innerHTML = `
<section class="mx-auto max-w-7xl px-4 sm:px-6 pt-12">
  <div class="glass rounded-3xl p-8">
    <div class="text-sm text-white/70">Platform</div>
    <h1 class="mt-2 text-4xl font-semibold">${DATA?.amis?.spotlightTitle || "AMIS"}</h1>
    <p class="mt-4 text-white/75 max-w-3xl">AMIS provides the platform core behind AIMeD’s multidomain deployments: runtime, data fabric, modeling/simulation, decision orchestration, knowledge, security, integration, and observability.</p>
    <div class="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${modules.map(m=>`
        <div class="glass rounded-2xl p-5">
          <div class="font-semibold">${m.title}</div>
          <ul class="mt-3 text-sm text-white/75 grid gap-2">
            ${(m.bullets||[]).slice(0,3).map(b=>`<li class="flex gap-2"><span class="text-emerald-300">•</span><span>${b}</span></li>`).join("")}
          </ul>
        </div>`).join("")}
    </div>
  </div>
</section>`;
  }

  enableVizHover();

  // Load hero viz if present
  if (document.getElementById("heroCanvas")) {
    const s = document.createElement("script");
    s.src = ASSET_BASE + "viz.js";
    s.defer = true;
    document.head.appendChild(s);
  }
})();
