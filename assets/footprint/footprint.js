/* Publication footprint dashboard. Reads assets/json/footprint.json (refreshed
   weekly from OpenAlex by .github/workflows/update-footprint.yml). No dependencies. */
(function () {
  "use strict";
  var root = document.querySelector(".fp");
  if (!root) return;
  var SVGNS = "http://www.w3.org/2000/svg";
  var model = null;
  var tip = null;
  var lastWidth = 0;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function txt(parent, x, y, s, attrs) {
    var t = el("text", attrs || {}, parent);
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.textContent = s;
    return t;
  }
  function sum(arr, f) {
    var s = 0;
    for (var i = 0; i < arr.length; i++) s += f(arr[i]);
    return s;
  }
  function plural(n, one, many) {
    return n + " " + (n === 1 ? one : many || one + "s");
  }
  function fmtDate(iso) {
    var d = new Date(iso + "T00:00:00Z");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  }
  function shortName(full) {
    var p = String(full).trim().split(/\s+/);
    return p.length < 2 ? full : p[0].charAt(0) + ". " + p.slice(1).join(" ");
  }
  var regions = null;
  try {
    regions = new Intl.DisplayNames(["en"], { type: "region" });
  } catch (e) {}
  function countryName(code) {
    try {
      return regions ? regions.of(code) : code;
    } catch (e) {
      return code;
    }
  }
  function role(w) {
    if (w.n_authors === 1) return "sole author";
    if (w.position === "first") return "first author";
    if (w.position === "last") return "last author";
    return "co-author";
  }
  function label(w) {
    return w.venue_short + " " + w.year;
  }
  function svgFor(container, w, h, aria) {
    container.innerHTML = "";
    var svg = el("svg", { viewBox: "0 0 " + w + " " + h, width: w, height: h, role: "img", "aria-label": aria }, container);
    return svg;
  }
  function focusable(node, aria) {
    node.setAttribute("tabindex", "0");
    node.setAttribute("aria-label", aria);
    node.setAttribute("role", "button");
  }

  /* ---------- tooltip ---------- */
  function showTip(html, anchor) {
    if (!tip) return;
    tip.innerHTML = html;
    tip.classList.add("is-on");
    var r = anchor.getBoundingClientRect();
    var rr = root.getBoundingClientRect();
    var tw = tip.offsetWidth,
      th = tip.offsetHeight;
    var x = r.left - rr.left + r.width / 2 - tw / 2;
    x = Math.max(0, Math.min(x, rr.width - tw));
    var y = r.top - rr.top - th - 10;
    if (r.top - th - 10 < 0) y = r.bottom - rr.top + 10;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }
  function hideTip() {
    if (tip) tip.classList.remove("is-on");
  }
  function bindTip(hit, anchor, html, onOn, onOff) {
    function on() {
      showTip(typeof html === "function" ? html() : html, anchor || hit);
      if (onOn) onOn();
    }
    function off() {
      hideTip();
      if (onOff) onOff();
    }
    hit.addEventListener("mouseenter", on);
    hit.addEventListener("mouseleave", off);
    hit.addEventListener("focus", on);
    hit.addEventListener("blur", off);
  }
  function tipRow(k, v) {
    return '<span class="fp-tip-row"><span>' + esc(k) + "</span><b>" + esc(v) + "</b></span>";
  }

  /* ---------- model ---------- */
  function build(d) {
    var works = d.works || [];
    var citing = d.citing || [];
    var total = sum(works, function (w) {
      return w.cited_by_count || 0;
    });
    var selfCites = 0,
      selfByYear = {};
    citing.forEach(function (c) {
      if (!c.self) return;
      selfCites += c.cites.length;
      selfByYear[c.year] = (selfByYear[c.year] || 0) + c.cites.length;
    });
    var nowYear = parseInt(String(d.generated).slice(0, 4), 10) || new Date().getFullYear();
    var minY = Infinity,
      maxY = nowYear;
    works.forEach(function (w) {
      if (w.year) {
        minY = Math.min(minY, w.year);
        maxY = Math.max(maxY, w.year);
      }
    });
    if (!isFinite(minY)) minY = nowYear;
    var years = [];
    for (var y = minY; y <= maxY; y++) years.push(y);

    var perYear = years.map(function (y) {
      var t = 0,
        parts = [];
      works.forEach(function (w) {
        var n = (w.citations_by_year || {})[y] || 0;
        if (n) {
          t += n;
          parts.push({ w: w, n: n });
        }
      });
      parts.sort(function (a, b) {
        return b.n - a.n;
      });
      var s = Math.min(selfByYear[y] || 0, t);
      return { year: y, total: t, self: s, ext: t - s, parts: parts };
    });

    var cs = works
      .map(function (w) {
        return w.cited_by_count || 0;
      })
      .sort(function (a, b) {
        return b - a;
      });
    var h = 0;
    while (h < cs.length && cs[h] >= h + 1) h++;

    var extCiting = citing.filter(function (c) {
      return !c.self;
    });
    var cc = {};
    extCiting.forEach(function (c) {
      (c.countries || []).forEach(function (k) {
        cc[k] = (cc[k] || 0) + 1;
      });
    });
    var countries = Object.keys(cc)
      .map(function (k) {
        return { code: k, name: countryName(k), n: cc[k] };
      })
      .sort(function (a, b) {
        return b.n - a.n || a.name.localeCompare(b.name);
      });

    var people = {},
      pairs = {},
      consortia = [],
      networkWorks = 0;
    works.forEach(function (w) {
      if (w.consortium) {
        consortia.push(w);
        return;
      }
      if (!w.coauthors.length) return;
      networkWorks++;
      var ids = [];
      w.coauthors.forEach(function (a) {
        var p = people[a.id] || (people[a.id] = { id: a.id, name: a.name, works: [] });
        p.works.push(w);
        ids.push(a.id);
      });
      for (var i = 0; i < ids.length; i++)
        for (var j = i + 1; j < ids.length; j++) {
          var key = ids[i] < ids[j] ? ids[i] + "|" + ids[j] : ids[j] + "|" + ids[i];
          (pairs[key] || (pairs[key] = { a: ids[i], b: ids[j], works: [] })).works.push(w);
        }
    });
    var plist = Object.keys(people)
      .map(function (k) {
        return people[k];
      })
      .sort(function (a, b) {
        return b.works.length - a.works.length || a.name.localeCompare(b.name);
      });

    return {
      generated: d.generated,
      openalex: (d.author || {}).openalex,
      works: works,
      citing: citing,
      extCiting: extCiting,
      total: total,
      selfCites: selfCites,
      external: Math.max(0, total - selfCites),
      years: years,
      perYear: perYear,
      h: h,
      top10: works.filter(function (w) {
        return w.top10;
      }).length,
      peer: works.filter(function (w) {
        return w.category === "Journal" || w.category === "Conference";
      }).length,
      countries: countries,
      people: plist,
      pairs: Object.keys(pairs).map(function (k) {
        return pairs[k];
      }),
      consortia: consortia,
      networkWorks: networkWorks,
    };
  }

  /* ---------- page ---------- */
  function kpi(lbl, value, note) {
    return (
      '<div class="fp-kpi"><p class="fp-kpi-label">' +
      esc(lbl) +
      '</p><p class="fp-kpi-value">' +
      esc(value) +
      '</p><p class="fp-kpi-note">' +
      esc(note) +
      "</p></div>"
    );
  }

  function render() {
    var m = model;
    var uncited = m.works.filter(function (w) {
      return !w.cited_by_count;
    }).length;
    var html = [];
    html.push('<p class="fp-meta">Data from <a href="' + esc(m.openalex) + '">OpenAlex</a> · updated ' + esc(fmtDate(m.generated)) + "</p>");
    html.push('<div class="fp-kpis">');
    html.push(kpi("Works indexed", m.works.length, plural(m.peer, "peer-reviewed paper")));
    html.push(kpi("Citations", m.total, m.selfCites ? m.external + " excluding self-citations" : "no self-citations"));
    html.push(kpi("h-index", m.h, m.h ? plural(m.h, "paper") + " cited at least " + plural(m.h, "time") + " each" : "no citations yet"));
    html.push(kpi("Top 10% cited", m.top10, "among works of the same field and year"));
    html.push(kpi("Citing countries", m.countries.length, "across " + plural(m.extCiting.length, "citing work")));
    html.push("</div>");

    html.push('<div class="fp-grid">');
    html.push('<section class="fp-card"><h3>Citations per year</h3><p class="fp-sub">When the work was cited, not when it was published.</p>');
    if (m.selfCites)
      html.push(
        '<ul class="fp-legend"><li><span class="fp-key fp-key-mark"></span>by other researchers</li><li><span class="fp-key fp-key-soft"></span>self-citations</li></ul>'
      );
    html.push('<div class="fp-chart" id="fp-years"></div>');
    html.push(
      '<details><summary>Show as table</summary><table><thead><tr><th>Year</th><th class="num">Total</th><th class="num">Others</th><th class="num">Self</th></tr></thead><tbody>'
    );
    m.perYear.forEach(function (r) {
      html.push(
        "<tr><td>" + r.year + '</td><td class="num">' + r.total + '</td><td class="num">' + r.ext + '</td><td class="num">' + r.self + "</td></tr>"
      );
    });
    html.push("</tbody></table></details></section>");

    html.push('<section class="fp-card"><h3>Most cited</h3><p class="fp-sub">Total citations per work.</p>');
    var cited = m.works
      .filter(function (w) {
        return w.cited_by_count > 0;
      })
      .sort(function (a, b) {
        return b.cited_by_count - a.cited_by_count;
      })
      .slice(0, 5);
    if (!cited.length) html.push('<p class="fp-sub">No citations yet.</p>');
    else {
      var maxC = cited[0].cited_by_count;
      html.push('<ul class="fp-rows">');
      cited.forEach(function (w) {
        html.push(
          '<li class="fp-row"><a class="fp-row-title" href="' +
            esc(w.url) +
            '" title="' +
            esc(w.title) +
            '">' +
            esc(w.title) +
            '</a><p class="fp-row-meta">' +
            esc(w.venue_short + " · " + w.year + " · " + role(w)) +
            '</p><div class="fp-bar"><span class="fp-bar-fill" style="width:calc((100% - 7.5rem) * ' +
            (w.cited_by_count / maxC).toFixed(4) +
            ')"></span><span class="fp-bar-val">' +
            w.cited_by_count +
            "</span>" +
            (w.top10 ? '<span class="fp-badge" title="Among the 10% most-cited works of the same field and year (OpenAlex)">▲ Top 10%</span>' : "") +
            "</div></li>"
        );
      });
      html.push("</ul>");
      if (uncited) html.push('<p class="fp-foot">' + esc(plural(uncited, "other work") + " not cited yet.") + "</p>");
    }
    html.push("</section></div>");

    html.push('<section class="fp-card"><h3>Where I publish</h3><p class="fp-sub">Each dot is one work, by venue and year.</p>');
    html.push(
      '<ul class="fp-legend"><li><span class="fp-key fp-key-dot"></span>first or sole author</li><li><span class="fp-key fp-key-ring"></span>co-author</li></ul>'
    );
    html.push('<div class="fp-chart" id="fp-venues"></div>');
    html.push(
      '<details><summary>All works as a table</summary><table><thead><tr><th>Work</th><th>Venue</th><th>Year</th><th>Role</th><th class="num">Citations</th></tr></thead><tbody>'
    );
    m.works.forEach(function (w) {
      html.push(
        '<tr><td><a href="' +
          esc(w.url) +
          '">' +
          esc(w.title) +
          "</a></td><td>" +
          esc(w.venue_short) +
          "</td><td>" +
          esc(w.year) +
          "</td><td>" +
          esc(role(w)) +
          '</td><td class="num">' +
          w.cited_by_count +
          "</td></tr>"
      );
    });
    html.push("</tbody></table></details></section>");

    var netSub = plural(m.people.length, "co-author") + " across " + plural(m.networkWorks, "work");
    if (m.consortia.length)
      netSub +=
        ", plus " +
        (m.consortia.length === 1 ? "a " + m.consortia[0].n_authors + "-author consortium paper" : plural(m.consortia.length, "consortium paper")) +
        " shown as one node";
    html.push(
      '<section class="fp-card"><h3>Co-authors</h3><p class="fp-sub">' + esc(netSub) + ". Line weight shows how often we published together.</p>"
    );
    html.push('<div class="fp-net-wrap"><div class="fp-chart" id="fp-network"></div><ul class="fp-people" id="fp-people">');
    m.people.forEach(function (p) {
      html.push(
        '<li data-id="' + esc(p.id) + '"><span>' + esc(p.name) + '</span><span class="fp-n">' + esc(plural(p.works.length, "work")) + "</span></li>"
      );
    });
    m.consortia.forEach(function (w) {
      html.push(
        '<li data-id="' + esc(w.id) + '"><span>' + esc(w.n_authors - 1) + ' consortium co-authors</span><span class="fp-n">1 work</span></li>'
      );
    });
    html.push("</ul></div></section>");

    html.push('<section class="fp-card"><h3>Who cites the work</h3><p class="fp-sub">');
    html.push(
      m.extCiting.length
        ? esc(
            plural(m.extCiting.length, "citing work") +
              " by other researchers, from " +
              plural(m.countries.length, "country", "countries") +
              ". Each citing work counts once per country of its authors."
          )
        : "No citations from other researchers yet."
    );
    html.push("</p>");
    if (m.extCiting.length) {
      html.push('<div class="fp-split"><div><h4>Countries</h4><ul class="fp-rows fp-countries">');
      var maxN = m.countries.length ? m.countries[0].n : 1;
      m.countries.forEach(function (c) {
        html.push(
          '<li class="fp-row"><span class="fp-row-title" title="' +
            esc(c.name) +
            '">' +
            esc(c.name) +
            '</span><div class="fp-bar"><span class="fp-bar-fill" style="width:calc((100% - 2rem) * ' +
            (c.n / maxN).toFixed(4) +
            ')"></span><span class="fp-bar-val">' +
            c.n +
            "</span></div></li>"
        );
      });
      html.push('</ul></div><div><h4>Latest citing works</h4><ul class="fp-citing">');
      var byId = {};
      m.works.forEach(function (w) {
        byId[w.id] = w;
      });
      m.extCiting.slice(0, 6).forEach(function (c) {
        var cites = c.cites
          .map(function (id) {
            return byId[id] ? label(byId[id]) : id;
          })
          .join(", ");
        html.push(
          '<li><a href="https://openalex.org/' +
            esc(c.id) +
            '">' +
            esc(c.title) +
            "</a><span>" +
            esc((c.venue ? c.venue + " · " : "") + c.year + " · cites " + cites) +
            "</span></li>"
        );
      });
      html.push("</ul></div></div>");
    }
    html.push("</section>");

    html.push(
      '<p class="fp-foot">Counts come from OpenAlex and refresh every week, so they can differ from Google Scholar, which indexes more sources. A self-citation is a citing work I co-authored.</p>'
    );
    html.push('<div class="fp-tip" role="tooltip"></div>');
    root.innerHTML = html.join("");
    tip = root.querySelector(".fp-tip");
    draw();
  }

  function draw() {
    lastWidth = root.clientWidth;
    drawYears(document.getElementById("fp-years"));
    drawVenues(document.getElementById("fp-venues"));
    drawNetwork(document.getElementById("fp-network"));
  }

  /* ---------- citations per year: stacked columns ---------- */
  function colPath(x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h));
    return (
      "M" +
      x +
      "," +
      (y + h) +
      "V" +
      (y + r) +
      "A" +
      r +
      "," +
      r +
      " 0 0 1 " +
      (x + r) +
      "," +
      y +
      "H" +
      (x + w - r) +
      "A" +
      r +
      "," +
      r +
      " 0 0 1 " +
      (x + w) +
      "," +
      (y + r) +
      "V" +
      (y + h) +
      "Z"
    );
  }
  function niceStep(max) {
    var raw = max / 4;
    var p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var f = raw / p;
    return Math.max(1, (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p);
  }
  function drawYears(box) {
    if (!box) return;
    var rows = model.perYear;
    var maxT = Math.max.apply(
      null,
      rows.map(function (r) {
        return r.total;
      })
    );
    if (!maxT) {
      box.innerHTML = '<p class="fp-sub">No citations yet.</p>';
      return;
    }
    var W = Math.max(220, box.clientWidth),
      H = 210,
      padL = 28,
      padR = 6,
      padT = 22,
      padB = 26;
    var svg = svgFor(
      box,
      W,
      H,
      "Citations per year: " +
        rows
          .map(function (r) {
            return r.year + " " + r.total;
          })
          .join(", ")
    );
    var step = niceStep(maxT),
      top = Math.ceil(maxT / step) * step;
    var plotH = H - padT - padB,
      base = padT + plotH;
    function sy(v) {
      return (v / top) * plotH;
    }
    for (var t = 0; t <= top; t += step) {
      var yy = Math.round(base - sy(t)) + 0.5;
      el("line", { x1: padL, x2: W - padR, y1: yy, y2: yy, class: "fp-grid-line" }, svg);
      txt(svg, padL - 8, yy + 4, String(t), { "text-anchor": "end" });
    }
    var band = (W - padL - padR) / rows.length,
      cw = Math.min(24, band * 0.5);
    rows.forEach(function (r, i) {
      var cx = padL + band * i + band / 2,
        x = cx - cw / 2;
      txt(svg, cx, H - 6, String(r.year), { "text-anchor": "middle" });
      var g = el("g", {}, svg);
      var bandEl = el("rect", { x: padL + band * i + 2, y: padT - 18, width: band - 4, height: plotH + 18, rx: 6, class: "fp-band" }, g);
      var anchor;
      if (r.total) {
        var hExt = sy(r.ext),
          hTot = sy(r.total);
        if (r.ext) anchor = el("path", { d: colPath(x, base - hExt, cw, hExt, r.self ? 0 : 4), class: "fp-fill" }, g);
        if (r.self) {
          var gap = r.ext ? 2 : 0;
          var hs = Math.max(2, hTot - hExt - gap);
          anchor = el("path", { d: colPath(x, base - hTot, cw, hs, 4), class: "fp-fill-soft" }, g);
        }
        txt(g, cx, base - hTot - 6, String(r.total), { "text-anchor": "middle", class: "fp-t-strong" });
      }
      var hit = el("rect", { x: padL + band * i + 2, y: padT - 18, width: band - 4, height: plotH + 18, rx: 6, class: "fp-hit fp-hit-band" }, g);
      focusable(hit, r.year + ": " + plural(r.total, "citation"));
      var marker = el("rect", { x: x, y: base - sy(r.total), width: cw, height: 1, fill: "none" }, g);
      bindTip(
        hit,
        anchor ? marker : hit,
        function () {
          var s = "<strong>" + r.year + "</strong>" + tipRow("Citations", r.total);
          if (r.self) s += tipRow("by other researchers", r.ext) + tipRow("self-citations", r.self);
          r.parts.forEach(function (p) {
            s += tipRow(label(p.w), p.n);
          });
          return s;
        },
        function () {
          bandEl.classList.add("is-on");
        },
        function () {
          bandEl.classList.remove("is-on");
        }
      );
    });
  }

  /* ---------- venues over time: dot timeline ---------- */
  var ORDER = ["Journal", "Conference", "Preprint", "Report", "Data & software", "Book", "Other"];
  var GROUP_LABEL = {
    Journal: "Journals",
    Conference: "Conferences",
    Preprint: "Preprints",
    Report: "Reports",
    "Data & software": "Data & software",
    Book: "Books",
    Other: "Other",
  };
  function drawVenues(box) {
    if (!box) return;
    var years = model.years;
    var groups = {};
    model.works.forEach(function (w) {
      var g = groups[w.category] || (groups[w.category] = {});
      (g[w.venue_short] || (g[w.venue_short] = [])).push(w);
    });
    var rows = [];
    ORDER.forEach(function (cat) {
      if (!groups[cat]) return;
      rows.push({ head: GROUP_LABEL[cat] || cat });
      Object.keys(groups[cat])
        .sort(function (a, b) {
          var ya = Math.min.apply(
            null,
            groups[cat][a].map(function (w) {
              return w.year;
            })
          );
          var yb = Math.min.apply(
            null,
            groups[cat][b].map(function (w) {
              return w.year;
            })
          );
          return ya - yb || a.localeCompare(b);
        })
        .forEach(function (v) {
          rows.push({ venue: v, works: groups[cat][v] });
        });
    });
    var W = Math.max(280, box.clientWidth),
      labelW = Math.min(120, W * 0.3),
      padT = 26,
      rowH = 30,
      headH = 26;
    var H =
      padT +
      sum(rows, function (r) {
        return r.head ? headH : rowH;
      }) +
      4;
    var svg = svgFor(box, W, H, "Works by venue and year");
    var x0 = labelW + 16,
      band = (W - x0 - 8) / years.length;
    function xYear(y) {
      return x0 + band * (y - years[0]) + band / 2;
    }
    years.forEach(function (y) {
      var x = Math.round(xYear(y)) + 0.5;
      el("line", { x1: x, x2: x, y1: padT - 6, y2: H - 4, class: "fp-grid-line" }, svg);
      txt(svg, x, 14, String(y), { "text-anchor": "middle" });
    });
    var y = padT;
    rows.forEach(function (r) {
      if (r.head) {
        txt(svg, 0, y + headH - 9, r.head, { class: "fp-t-group" });
        y += headH;
        return;
      }
      var cy = y + rowH / 2;
      var t = txt(svg, 0, cy + 4, r.venue, { class: "fp-t-strong" });
      var full = r.works[0].venue;
      if (full && full !== r.venue) el("title", {}, t).textContent = full;
      var byYear = {};
      r.works.forEach(function (w) {
        (byYear[w.year] || (byYear[w.year] = [])).push(w);
      });
      Object.keys(byYear).forEach(function (yr) {
        var list = byYear[yr];
        list.forEach(function (w, i) {
          var cx = xYear(+yr) + (i - (list.length - 1) / 2) * 16;
          var lead = w.position === "first" || w.n_authors === 1;
          var g = el("g", {}, svg);
          var dot = el("circle", { cx: cx, cy: cy, r: lead ? 6 : 5, class: lead ? "fp-dot" : "fp-dot-ring" }, g);
          var hit = el("circle", { cx: cx, cy: cy, r: 12, class: "fp-hit" }, g);
          el("circle", { cx: cx, cy: cy, r: 10, class: "fp-focus" }, g);
          focusable(hit, w.title + ", " + w.venue_short + " " + w.year);
          hit.addEventListener("click", function () {
            window.open(w.url, "_blank", "noopener");
          });
          hit.addEventListener("keydown", function (e) {
            if (e.key === "Enter") window.open(w.url, "_blank", "noopener");
          });
          hit.style.cursor = "pointer";
          bindTip(hit, dot, function () {
            return (
              "<strong>" +
              esc(w.title) +
              "</strong>" +
              tipRow(w.venue_short, w.year) +
              tipRow("Role", role(w)) +
              tipRow("Citations", w.cited_by_count)
            );
          });
        });
      });
      y += rowH;
    });
  }

  /* ---------- co-author network: ego layout ---------- */
  function drawNetwork(box) {
    if (!box) return;
    var people = model.people,
      cons = model.consortia;
    var nodes = people
      .map(function (p) {
        return { id: p.id, person: p, k: p.works.length };
      })
      .concat(
        cons.map(function (w) {
          return { id: w.id, consortium: w, k: 1 };
        })
      );
    if (!nodes.length) {
      box.innerHTML = '<p class="fp-sub">No co-authors yet.</p>';
      return;
    }
    var W = Math.max(260, box.clientWidth),
      H = Math.round(Math.max(260, Math.min(360, W * 0.72)));
    var cx = W / 2,
      cy = H / 2,
      R = Math.max(70, Math.min(W / 2 - (W < 480 ? 72 : 100), H / 2 - 36));
    var svg = svgFor(
      box,
      W,
      H,
      "Co-author network: " +
        people
          .map(function (p) {
            return p.name + " " + p.works.length;
          })
          .join(", ")
    );
    var pos = {};
    nodes.forEach(function (n, i) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length;
      n.a = a;
      n.x = cx + R * Math.cos(a);
      n.y = cy + R * Math.sin(a);
      pos[n.id] = n;
    });
    var edges = [];
    var gEdges = el("g", {}, svg);
    model.pairs.forEach(function (p) {
      var A = pos[p.a],
        B = pos[p.b];
      var mx = (A.x + B.x) / 2,
        my = (A.y + B.y) / 2;
      var qx = mx + (cx - mx) * 0.45,
        qy = my + (cy - my) * 0.45;
      var e = el("path", { d: "M" + A.x + "," + A.y + "Q" + qx + "," + qy + " " + B.x + "," + B.y, class: "fp-edge" }, gEdges);
      edges.push({ el: e, ids: [p.a, p.b] });
    });
    nodes.forEach(function (n) {
      var e = el("line", { x1: cx, y1: cy, x2: n.x, y2: n.y, class: "fp-edge-me", "stroke-width": Math.min(6, 1 + 0.8 * (n.k - 1)) }, gEdges);
      edges.push({ el: e, ids: ["me", n.id], me: true });
    });

    var gMe = el("g", {}, svg);
    el("circle", { cx: cx, cy: cy, r: 9, class: "fp-node-me" }, gMe);
    txt(gMe, cx, cy + 24, "me", { "text-anchor": "middle", class: "fp-t-strong fp-halo" });

    var nodeEls = {};
    nodes.forEach(function (n) {
      var g = el("g", {}, svg);
      nodeEls[n.id] = g;
      var c = Math.cos(n.a),
        s = Math.sin(n.a);
      var anchorEl, hit;
      if (n.consortium) {
        var pw = 112,
          ph = 36;
        var px = Math.max(2, Math.min(W - pw - 2, n.x - pw / 2)),
          py = Math.max(2, Math.min(H - ph - 2, n.y - ph / 2));
        anchorEl = el("rect", { x: px, y: py, width: pw, height: ph, rx: 10, class: "fp-pill" }, g);
        txt(g, px + pw / 2, py + 15, "+" + (n.consortium.n_authors - 1) + " co-authors", { "text-anchor": "middle", class: "fp-t-strong" });
        txt(g, px + pw / 2, py + 29, "consortium · " + n.consortium.year, { "text-anchor": "middle" });
        hit = el("rect", { x: px - 4, y: py - 4, width: pw + 8, height: ph + 8, rx: 12, class: "fp-hit" }, g);
        el("rect", { x: px - 3, y: py - 3, width: pw + 6, height: ph + 6, rx: 12, class: "fp-focus" }, g);
        focusable(hit, n.consortium.title);
      } else {
        var r = 4 + 2.2 * Math.sqrt(n.k);
        anchorEl = el("circle", { cx: n.x, cy: n.y, r: r, class: "fp-node" }, g);
        var anchor = c > 0.25 ? "start" : c < -0.25 ? "end" : "middle";
        var lx = n.x + c * (r + 8),
          ly = n.y + s * (r + 8) + 4 + (anchor === "middle" ? (s > 0 ? 8 : -4) : 0);
        var t = txt(g, lx, ly, shortName(n.person.name), { "text-anchor": anchor, class: "fp-halo" });
        var bb = t.getBBox();
        if (bb.x < 2 || bb.x + bb.width > W - 2) {
          // no room beside the node (narrow screens): put the label above or below it instead
          t.setAttribute("text-anchor", "middle");
          t.setAttribute("x", n.x);
          t.setAttribute("y", s > 0 ? n.y + r + 15 : n.y - r - 7);
          bb = t.getBBox();
          if (bb.x < 2) t.setAttribute("x", n.x + 2 - bb.x);
          else if (bb.x + bb.width > W - 2) t.setAttribute("x", n.x - (bb.x + bb.width - W + 2));
        }
        hit = el("circle", { cx: n.x, cy: n.y, r: Math.max(14, r + 6), class: "fp-hit" }, g);
        el("circle", { cx: n.x, cy: n.y, r: r + 4, class: "fp-focus" }, g);
        focusable(hit, n.person.name + ", " + plural(n.k, "joint work"));
      }
      bindTip(
        hit,
        anchorEl,
        function () {
          if (n.consortium) {
            var w = n.consortium;
            return "<strong>" + esc(w.title) + "</strong>" + tipRow("Authors", w.n_authors) + tipRow(w.venue_short, w.year) + tipRow("Role", role(w));
          }
          var s2 = "<strong>" + esc(n.person.name) + "</strong>" + tipRow("Joint works", n.k);
          n.person.works.slice(0, 6).forEach(function (w) {
            s2 += tipRow(label(w), w.cited_by_count + " cit.");
          });
          return s2;
        },
        function () {
          highlight(n.id);
        },
        function () {
          highlight(null);
        }
      );
    });

    function highlight(id) {
      var linked = {};
      if (id) {
        linked[id] = true;
        linked.me = true;
        model.pairs.forEach(function (p) {
          if (p.a === id) linked[p.b] = true;
          if (p.b === id) linked[p.a] = true;
        });
      }
      edges.forEach(function (e) {
        var hot = id && e.ids.indexOf(id) > -1;
        e.el.classList.toggle("is-hot", !!hot);
        e.el.classList.toggle("is-faded", !!id && !hot);
      });
      Object.keys(nodeEls).forEach(function (k) {
        nodeEls[k].classList.toggle("is-dim", !!id && !linked[k]);
      });
      var items = root.querySelectorAll("#fp-people li");
      for (var i = 0; i < items.length; i++) items[i].classList.toggle("is-hot", items[i].getAttribute("data-id") === id);
    }
    var items = root.querySelectorAll("#fp-people li");
    for (var i = 0; i < items.length; i++) {
      (function (li) {
        li.addEventListener("mouseenter", function () {
          highlight(li.getAttribute("data-id"));
        });
        li.addEventListener("mouseleave", function () {
          highlight(null);
        });
      })(items[i]);
    }
  }

  /* ---------- boot ---------- */
  function fail() {
    root.innerHTML =
      '<p class="fp-status">The numbers couldn\'t load right now. The full list of papers is on the <a href="' +
      esc(root.getAttribute("data-fallback") || "/publications/") +
      '">publications page</a>.</p>';
  }
  fetch(root.getAttribute("data-src"))
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (d) {
      if (!d.works || !d.works.length) throw new Error("empty");
      model = build(d);
      render();
      var t;
      window.addEventListener("resize", function () {
        clearTimeout(t);
        t = setTimeout(function () {
          if (Math.abs(root.clientWidth - lastWidth) > 4) draw();
        }, 150);
      });
    })
    .catch(fail);
})();
