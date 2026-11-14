#!/usr/bin/env python3
"""Refresh the data behind /footprint/ from OpenAlex.

Writes assets/json/footprint.json: my works, their citations per year, venues,
co-authors, and the works that cite them (with the citing authors' countries).
Standard library only, so the GitHub Action needs no extra installs.

    python bin/update_footprint.py                     # fetch from api.openalex.org
    python bin/update_footprint.py --fixture raw.json  # rebuild from a saved API response

Optional environment variables:
    OPENALEX_API_KEY  free key from openalex.org/settings, if keyless requests are refused
    OPENALEX_MAILTO   contact address, sent so OpenAlex can reach you about heavy use
"""

import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.parse
import urllib.request

AUTHOR_ID = "A5115742780"
OUT = "assets/json/footprint.json"
API = "https://api.openalex.org"

# Works OpenAlex attributes to me that are not mine. Kept here so the page stays
# right even if the profile fix on OpenAlex is undone.
EXCLUDE = {
    "W7116882702": "SIPDA 2025 lightning paper: a different author (removal requested on OpenAlex, Nov 2026)",
}

# Works with more authors than this are shown as one consortium node in the network.
CONSORTIUM_MIN_AUTHORS = 13

# Short labels for venues whose names don't end in an acronym like "(AICCONF)".
SHORT_VENUES = {
    "Expert Systems with Applications": "ESWA",
    "AI": "AI (MDPI)",
    "SSRN Electronic Journal": "SSRN",
    "Zenodo (CERN European Organization for Nuclear Research)": "Zenodo",
    "Computers & Education": "C&E",
    "Computers and Education": "C&E",
    "International Journal of Human-Computer Studies": "IJHCS",
    "Cognitive Systems Research": "CSR",
    "Computers in Human Behavior": "CHB",
    "arXiv (Cornell University)": "arXiv",
}

WORK_FIELDS = (
    "id,doi,display_name,publication_year,publication_date,type,cited_by_count,"
    "counts_by_year,authorships,primary_location,open_access,fwci,citation_normalized_percentile"
)
CITING_FIELDS = "id,display_name,publication_year,publication_date,authorships,primary_location,referenced_works"


def short_id(url):
    return url.rsplit("/", 1)[-1] if url else None


def get(path, params):
    params = dict(params)
    if os.environ.get("OPENALEX_API_KEY"):
        params["api_key"] = os.environ["OPENALEX_API_KEY"]
    if os.environ.get("OPENALEX_MAILTO"):
        params["mailto"] = os.environ["OPENALEX_MAILTO"]
    url = f"{API}{path}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "kroumpas.github.io footprint page"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def fetch_all(filter_, select):
    results, cursor = [], "*"
    while cursor:
        page = get("/works", {"filter": filter_, "select": select, "per_page": 200, "cursor": cursor})
        results += page["results"]
        cursor = page["meta"].get("next_cursor") if page["results"] else None
    return results


def fetch_raw():
    works = fetch_all(f"author.id:{AUTHOR_ID}", WORK_FIELDS)
    cited = [short_id(w["id"]) for w in works if w.get("cited_by_count") and short_id(w["id"]) not in EXCLUDE]
    citing = []
    for i in range(0, len(cited), 50):  # OpenAlex takes up to 100 OR-values per filter
        citing += fetch_all("cites:" + "|".join(cited[i : i + 50]), CITING_FIELDS)
    return {"works": works, "citing": citing}


def venue_short(name):
    if not name:
        return "Unknown venue"
    if name in SHORT_VENUES:
        return SHORT_VENUES[name]
    m = re.search(r"\(([A-Za-z][A-Za-z0-9&\- ]{1,15})\)\s*$", name)
    return m.group(1) if m else name


def category(work_type, source_type):
    if work_type in ("dataset", "software"):
        return "Data & software"
    if work_type == "preprint":
        return "Preprint"
    if source_type == "repository":
        return "Report"
    if work_type == "conference-paper" or source_type == "conference":
        return "Conference"
    if work_type in ("article", "review", "letter"):
        return "Journal"
    if work_type in ("book", "book-chapter"):
        return "Book"
    return "Other"


def countries(authorships):
    codes = set()
    for a in authorships or []:
        for inst in a.get("institutions") or []:
            if inst.get("country_code"):
                codes.add(inst["country_code"])
        for c in a.get("countries") or []:
            codes.add(c)
    return sorted(codes)


def is_me(authorship):
    return short_id((authorship.get("author") or {}).get("id")) == AUTHOR_ID


def normalize_work(w):
    loc = w.get("primary_location") or {}
    src = loc.get("source") or {}
    auths = w.get("authorships") or []
    me = next((a for a in auths if is_me(a)), {})
    pct = w.get("citation_normalized_percentile") or {}
    oa = w.get("open_access") or {}
    doi = w.get("doi")
    out = {
        "id": short_id(w["id"]),
        "title": w.get("display_name") or "",
        "year": w.get("publication_year"),
        "date": w.get("publication_date"),
        "type": w.get("type"),
        "category": category(w.get("type"), src.get("type")),
        "venue": src.get("display_name") or "",
        "venue_short": venue_short(src.get("display_name")),
        "url": doi or loc.get("landing_page_url") or w["id"],
        "open_access": bool(oa.get("is_oa")),
        "cited_by_count": w.get("cited_by_count") or 0,
        "citations_by_year": {str(c["year"]): c["cited_by_count"] for c in (w.get("counts_by_year") or []) if c.get("cited_by_count")},
        "fwci": w.get("fwci"),
        "top10": bool(pct.get("is_in_top_10_percent")),
        "position": me.get("author_position"),
        "n_authors": len(auths),
        "consortium": len(auths) >= CONSORTIUM_MIN_AUTHORS,
        "coauthors": [],
    }
    if not out["consortium"]:
        out["coauthors"] = [
            {"id": short_id(a["author"]["id"]), "name": a["author"].get("display_name") or ""}
            for a in auths
            if not is_me(a) and (a.get("author") or {}).get("id")
        ]
    return out


def build(raw):
    works = [normalize_work(w) for w in raw["works"] if short_id(w["id"]) not in EXCLUDE]
    works.sort(key=lambda w: (w["date"] or str(w["year"] or "")), reverse=True)
    mine = {w["id"] for w in works}
    citing, seen = [], set()
    for c in raw["citing"]:
        cid = short_id(c["id"])
        cites = sorted(mine & {short_id(r) for r in c.get("referenced_works") or []})
        if not cites or cid in seen:
            continue  # only cited an excluded work, or a duplicate across batches
        seen.add(cid)
        src = (c.get("primary_location") or {}).get("source") or {}
        citing.append(
            {
                "id": cid,
                "title": c.get("display_name") or "",
                "year": c.get("publication_year"),
                "date": c.get("publication_date"),
                "venue": src.get("display_name") or "",
                "countries": countries(c.get("authorships")),
                "cites": cites,
                "self": any(is_me(a) for a in c.get("authorships") or []),
            }
        )
    citing.sort(key=lambda c: (c["date"] or str(c["year"] or "")), reverse=True)
    return {
        "generated": dt.date.today().isoformat(),
        "source": "OpenAlex (CC0)",
        "author": {"id": AUTHOR_ID, "openalex": f"https://openalex.org/{AUTHOR_ID}"},
        "works": works,
        "citing": citing,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--fixture", help="build from a saved {works, citing} API response instead of fetching")
    ap.add_argument("--out", default=OUT)
    args = ap.parse_args()

    if args.fixture:
        with open(args.fixture, encoding="utf-8") as f:
            raw = json.load(f)
    else:
        raw = fetch_raw()
    data = build(raw)
    if not data["works"]:
        sys.exit("OpenAlex returned no works; keeping the existing file.")
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"{len(data['works'])} works, {len(data['citing'])} citing works -> {args.out}")


if __name__ == "__main__":
    main()
