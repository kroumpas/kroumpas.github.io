/* Interactive poster: ACM GreekCHI-CYCHI Symposium 2026. No dependencies. */
(function () {
  "use strict";
  var root = document.querySelector(".ig");
  if (!root) return;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SVGNS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- 1. the eye follows the pointer ---------- */
  (function eye() {
    var svg = document.getElementById("ig-eye");
    if (!svg) return;
    var iris = document.getElementById("ig-iris");
    var mer = document.getElementById("ig-mer");
    var eqt = document.getElementById("ig-eqt");
    var R = 90,
      C = 100,
      MAX = 0.62;
    function look(clientX, clientY) {
      var box = svg.getBoundingClientRect();
      var cx = box.left + box.width / 2,
        cy = box.top + box.height / 2;
      var dx = clientX - cx,
        dy = clientY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var reach = Math.min(dist / (box.width * 1.6), 1) * MAX; // 0..MAX of the radius
      var ox = (dx / dist) * reach * R,
        oy = (dy / dist) * reach * R;
      var ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      var squash = Math.sqrt(Math.max(0.15, 1 - reach * reach)); // foreshortening on the sphere
      iris.setAttribute(
        "transform",
        "translate(" + (C + ox) + " " + (C + oy) + ") rotate(" + ang + ") scale(" + squash + " 1) translate(" + -C + " " + -C + ")"
      );
      mer.setAttribute("cx", C + ox * 0.55);
      mer.setAttribute("rx", 34 + Math.abs(ox) * 0.35);
      eqt.setAttribute("cy", C + oy * 0.55);
      eqt.setAttribute("ry", 22 + Math.abs(oy) * 0.35);
    }
    var pending = null;
    function onMove(e) {
      var p = e.touches ? e.touches[0] : e;
      if (pending) return;
      pending = requestAnimationFrame(function () {
        pending = null;
        look(p.clientX, p.clientY);
      });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
  })();

  /* ---------- 2. pipeline steps ---------- */
  var STEPS = {
    input: [
      "Input: gaze direction",
      "The gaze-direction vectors (X, Y, Z) of the left and right eye, as recorded by the eye-tracker, are what the network sees.",
    ],
    net: [
      "Neural network",
      "The network maps those vectors to a predicted on-screen gaze point. Alongside the prediction, its physics-informed part computes the derivatives the physics terms need (∂H, ∂p, ∂θ, ∂φ, ∂α).",
    ],
    data: ["Data loss: labelled data", "Mean squared error between the predicted gaze and the ground-truth labels."],
    bc: ["Physics loss: boundary and initial conditions", "The eye's motion always stays parallel to the surface it moves on."],
    pde: [
      "Physics loss: equation residual",
      "The Γ residual and the Hamiltonian term H, which encode the eye's rotational dynamics on Donders' surface. The equation is in the next section.",
    ],
    opt: [
      "Feedback: total loss",
      "Data loss and physics loss are added into one total loss, which the Adam optimiser minimises with a learning rate of 1e-3.",
    ],
  };
  function selectStep(btn) {
    var group = btn.parentNode.querySelectorAll(".ig-step");
    for (var i = 0; i < group.length; i++) group[i].setAttribute("aria-pressed", group[i] === btn ? "true" : "false");
    var s = STEPS[btn.getAttribute("data-step")];
    var box = document.getElementById("ig-detail");
    box.textContent = "";
    var h = document.createElement("h3");
    h.textContent = s[0];
    var p = document.createElement("p");
    p.textContent = s[1];
    box.appendChild(h);
    box.appendChild(p);
  }
  var steps = root.querySelectorAll(".ig-step");
  for (var i = 0; i < steps.length; i++) {
    steps[i].addEventListener("click", function () {
      selectStep(this);
    });
  }
  if (steps.length) selectStep(steps[0]);

  /* ---------- 3. equation symbols ---------- */
  var TERMS = {
    H: "<strong>H</strong>: the Hamiltonian. The physics term is built from it, and it encodes the eye's rotational dynamics on Donders' surface.",
    G1: "<strong>Γ</strong>: the Euler–Lagrange operator acting on the Lagrangian ℒ.",
    L: "<strong>ℒ</strong>: the Lagrangian that the Euler–Lagrange operator Γ acts on.",
    Gam1: "<strong>Γ<sub>1</sub> = G<sup>−1</sup>Γ</strong>: the same operator, expressed in the gaze coordinates through their metric G.",
    G: "<strong>G</strong>: the metric of the gaze coordinates (r<sub>θ</sub>, r<sub>φ</sub>, r<sub>α</sub>), with r<sub>γ</sub> = ∂ρ/∂γ.",
    rho: "<strong>ρ</strong>: the mapping ρ : [0, 2π] × [−π/2, π/2] → S³.",
    p: "<strong>p</strong>: the Lagrange multiplier, which weights the constraint term p<sup>T</sup>F.",
    d: "<strong>δ</strong>: a constant that weights the inertial term (δ/2) Γ<sub>1</sub><sup>T</sup>Γ<sub>1</sub>, i.e. how much acceleration counts in the dynamics.",
  };
  function selectTerm(btn) {
    var group = btn.parentNode.querySelectorAll(".ig-chip");
    for (var j = 0; j < group.length; j++) group[j].setAttribute("aria-pressed", group[j] === btn ? "true" : "false");
    document.getElementById("ig-term").innerHTML = TERMS[btn.getAttribute("data-term")]; // static, trusted strings
  }
  var chips = root.querySelectorAll(".ig-chip[data-term]");
  for (var c = 0; c < chips.length; c++) {
    chips[c].addEventListener("click", function () {
      selectTerm(this);
    });
  }
  if (chips.length) selectTerm(chips[0]);

  /* ---------- 4. MAE chart (small multiples, shared scale, PINN highlighted) ---------- */
  var MODELS = ["NN", "PINN", "GNN", "PINN-GNN"];
  var MAE = { MAE_X: [2.05, 0.735, 1.32, 2.19], MAE_Y: [1.04, 0.716, 1.21, 1.23] };
  (function chart() {
    var host = document.getElementById("ig-mae");
    if (!host) return;
    var tip = document.createElement("div");
    tip.className = "ig-tip";
    tip.setAttribute("role", "status");
    host.appendChild(tip);
    var W = 640,
      H = 270,
      padL = 34,
      padR = 8,
      padT = 30,
      padB = 34,
      gapPanel = 28;
    var panels = ["MAE_X", "MAE_Y"];
    var pw = (W - padL - padR - gapPanel) / 2,
      ph = H - padT - padB,
      yMax = 2.5;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-labelledby": "ig-mae-title" });
    var t = el("title", { id: "ig-mae-title" }, svg);
    t.textContent = "Mean absolute error by model, X and Y axes. PINN is lowest on both.";
    // grid + y ticks (shared scale)
    [0, 0.5, 1, 1.5, 2, 2.5].forEach(function (v) {
      var y = padT + ph - (v / yMax) * ph;
      el("line", { class: "grid", x1: padL, x2: W - padR, y1: y, y2: y }, svg);
      var lab = el("text", { x: padL - 6, y: y + 4, "text-anchor": "end" }, svg);
      lab.textContent = v === 0 ? "0" : v.toFixed(1);
    });
    panels.forEach(function (key, pi) {
      var x0 = padL + pi * (pw + gapPanel);
      var title = el("text", { class: "panel", x: x0 + pw / 2, y: 16, "text-anchor": "middle" }, svg);
      title.textContent = key === "MAE_X" ? "Horizontal (MAE_X)" : "Vertical (MAE_Y)";
      var band = pw / MODELS.length,
        bw = Math.min(24, band * 0.5);
      MODELS.forEach(function (m, mi) {
        var v = MAE[key][mi];
        var cx = x0 + band * mi + band / 2;
        var h = (v / yMax) * ph,
          y = padT + ph - h,
          r = 4;
        var d =
          "M" +
          (cx - bw / 2) +
          "," +
          (padT + ph) +
          " V" +
          (y + r) +
          " Q" +
          (cx - bw / 2) +
          "," +
          y +
          " " +
          (cx - bw / 2 + r) +
          "," +
          y +
          " H" +
          (cx + bw / 2 - r) +
          " Q" +
          (cx + bw / 2) +
          "," +
          y +
          " " +
          (cx + bw / 2) +
          "," +
          (y + r) +
          " V" +
          (padT + ph) +
          " Z";
        var hit = el(
          "rect",
          { class: "hit", x: cx - band / 2 + 2, y: padT, width: band - 4, height: ph, tabindex: "0", "aria-label": m + ", " + key + " " + v },
          svg
        );
        el("path", { class: "bar" + (m === "PINN" ? " hl" : ""), d: d }, svg);
        var val = el("text", { class: "val", x: cx, y: y - 6, "text-anchor": "middle" }, svg);
        val.textContent = String(v);
        var lab = el("text", { x: cx, y: padT + ph + 16, "text-anchor": "middle" }, svg);
        lab.textContent = m;
        function show() {
          var pinn = MAE[key][1];
          tip.textContent = "";
          var s = document.createElement("strong");
          s.textContent = String(v);
          var line = document.createElement("span");
          line.textContent = " " + m + " · " + key;
          tip.appendChild(s);
          tip.appendChild(line);
          if (m !== "PINN") {
            var br = document.createElement("br");
            var cmp = document.createElement("span");
            cmp.textContent = "PINN is " + Math.round((1 - pinn / v) * 100) + "% lower";
            tip.appendChild(br);
            tip.appendChild(cmp);
          }
          var sb = svg.getBoundingClientRect(),
            hb = host.getBoundingClientRect();
          tip.style.left = (cx / W) * sb.width + (sb.left - hb.left) + "px";
          tip.style.top = (y / H) * sb.height + (sb.top - hb.top) - 26 + "px";
          tip.style.opacity = "1";
        }
        function hide() {
          tip.style.opacity = "0";
        }
        hit.addEventListener("pointerenter", show);
        hit.addEventListener("focus", show);
        hit.addEventListener("pointerleave", hide);
        hit.addEventListener("blur", hide);
      });
    });
    host.insertBefore(svg, tip);

    // table view
    var btn = document.getElementById("ig-mae-table-btn");
    var table = document.getElementById("ig-mae-table");
    if (btn && table) {
      var tb = table.querySelector("tbody");
      MODELS.forEach(function (m, mi) {
        var tr = document.createElement("tr");
        [m, MAE.MAE_X[mi], MAE.MAE_Y[mi]].forEach(function (cell) {
          var td = document.createElement("td");
          td.textContent = String(cell);
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      btn.addEventListener("click", function () {
        var open = table.hasAttribute("hidden");
        if (open) table.removeAttribute("hidden");
        else table.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.textContent = open ? "Hide table" : "Show as table";
      });
    }
  })();

  /* ---------- 5. scatter figure: focus one model's panel ---------- */
  var PANELS = {
    GNN: [2.6, 7.0, "The graph neural network performed comparably to the feed-forward baseline (MAE 1.32 on X, 1.21 on Y)."],
    NN: [29.6, 7.0, "The feed-forward baseline (MAE 2.05 on X, 1.04 on Y)."],
    PINN: [56.6, 7.0, "The pure PINN: the lowest error on both axes (MAE 0.735 on X, 0.716 on Y)."],
    "PINN-GNN": [2.6, 50.5, "Adding a graph layer to the PINN raised both the error (MAE 2.19 on X, 1.23 on Y) and its variance."],
    "PINN-TCN": [29.6, 50.5, "The PINN with a temporal convolutional layer: the hybrids showed higher error variance than the pure PINN."],
    TCN: [56.6, 50.5, "The temporal convolutional network and its PINN hybrid had the highest error of the models tested."],
  };
  (function scatter() {
    var focus = document.getElementById("ig-focus");
    var text = document.getElementById("ig-model-text");
    var btns = root.querySelectorAll(".ig-chip[data-model]");
    if (!focus || !btns.length) return;
    function pick(btn) {
      for (var k = 0; k < btns.length; k++) btns[k].setAttribute("aria-pressed", btns[k] === btn ? "true" : "false");
      var p = PANELS[btn.getAttribute("data-model")];
      focus.style.left = p[0] + "%";
      focus.style.top = p[1] + "%";
      text.textContent = p[2];
    }
    for (var k = 0; k < btns.length; k++) {
      btns[k].addEventListener("click", function () {
        pick(this);
      });
    }
    pick(root.querySelector('.ig-chip[data-model="PINN"]'));
  })();

  /* ---------- 6. AUC meter ---------- */
  (function auc() {
    var svg = document.getElementById("ig-auc");
    if (!svg) return;
    var AUC = 0.768,
      cx = 140,
      cy = 140,
      r = 110;
    function pt(v) {
      // 0.5 (chance) at the left end, 1.0 (perfect) at the right end of a half circle
      var a = Math.PI * (1 - (v - 0.5) / 0.5);
      return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
    }
    var s = pt(0.5),
      e = pt(1),
      m = pt(AUC);
    el("path", { class: "track", d: "M" + s[0] + "," + s[1] + " A" + r + "," + r + " 0 0 1 " + e[0] + "," + e[1] }, svg);
    var fill = el("path", { class: "fill", d: "M" + s[0] + "," + s[1] + " A" + r + "," + r + " 0 0 1 " + m[0] + "," + m[1] }, svg);
    var big = el("text", { class: "big", x: cx, y: cy - 18, "text-anchor": "middle" }, svg);
    big.textContent = AUC.toFixed(3);
    var l1 = el("text", { x: cx, y: cy + 4, "text-anchor": "middle" }, svg);
    l1.textContent = "AUC";
    var a = el("text", { x: s[0] - 14, y: cy + 24, "text-anchor": "start" }, svg);
    a.textContent = "0.5 · chance";
    var b = el("text", { x: e[0] + 14, y: cy + 24, "text-anchor": "end" }, svg);
    b.textContent = "1.0";
    if (!reduceMotion && "IntersectionObserver" in window) {
      var len = fill.getTotalLength();
      fill.style.strokeDasharray = len;
      fill.style.strokeDashoffset = len;
      var io = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting) {
          fill.style.transition = "stroke-dashoffset 1.1s ease";
          fill.style.strokeDashoffset = "0";
          io.disconnect();
        }
      });
      io.observe(svg);
    }
    var fbtn = document.getElementById("ig-fig-btn");
    var fig = document.getElementById("ig-fig");
    if (fbtn && fig) {
      fbtn.addEventListener("click", function () {
        var open = fig.hasAttribute("hidden");
        if (open) fig.removeAttribute("hidden");
        else fig.setAttribute("hidden", "");
        fbtn.setAttribute("aria-expanded", open ? "true" : "false");
        fbtn.textContent = open ? "Hide the original figure" : "Show the original figure";
      });
    }
  })();

  /* ---------- 7. gentle reveal on scroll ---------- */
  var reveals = root.querySelectorAll(".ig-reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    for (var q = 0; q < reveals.length; q++) reveals[q].classList.add("in");
  } else {
    var ro = new IntersectionObserver(
      function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            ro.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    for (var w = 0; w < reveals.length; w++) ro.observe(reveals[w]);
  }
})();
