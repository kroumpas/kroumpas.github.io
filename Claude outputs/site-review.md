# kroumpas.github.io — site review

Reviewed against `origin/main` (last commit `rebuild`, 2026-08-06) and the live site.
Items marked **[FIXED]** are already in `kroumpas-site-updates.patch`.

---

## 1. Critical: the al-folio demo content is live and indexed

This is the highest-impact issue on the site, and it is invisible from the navbar,
which is probably why it has survived.

Your `sitemap.xml` currently advertises **123 URLs to Google**. The large majority
are theme demo content, still live under your name:

| URL pattern | What is actually there |
|---|---|
| `/blog/…` (33 posts) | al-folio sample posts — "Jean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch" |
| `/news/announcement_1…3/` | "A simple inline announcement", hipster-ipsum |
| `/books/the_godfather/` + 9 category/tag pages | The Godfather bookshelf demo |
| `/teachings/data-science-fundamentals/`, `/teachings/introduction-to-machine-learning/` | Courses taught by **"Prof. Data"** and **"Prof. Example"**, room 202, `/assets/pdf/example_pdf.pdf` |
| `/people/` | "555 your office number / 123 your address street / Your City, State 12345" |
| `/teaching/` | Embeds a Google Calendar with `calendar_id='test@gmail.com'`, timezone `Asia/Shanghai` |
| `/plugins/` | al-folio's own plugin catalog — a page for theme maintainers, not for you |
| `/_pages/dropdown/` | An internal template file leaking as a public URL |

Verified live: `https://kroumpas.github.io/news/announcement_2/` returns the lorem
ipsum body right now.

Why it matters: anyone searching your name can land on these; they dilute the
crawl budget for the pages you actually want ranked (publications, projects,
datasets); and a reviewer or hiring committee finding "Prof. Example" on your
site reads as carelessness rather than as a theme default.

**Action:** `bin/remove_template_demo_content.sh` is included in the patch. It is
a review-then-run script (it only calls `git rm`, nothing is force-deleted), and
it prints follow-up steps. Read the list before running it — in particular decide
whether you want to keep the blog (`_posts`) as a shell for future writing, or
drop it entirely. If you keep it, delete the sample posts individually and set a
real `blog_description`.

After deploying, either submit the removed URLs to Search Console's removal tool
or just let them 404 — they will drop out of the index within a few weeks.

---

## 2. Metadata and SEO **[FIXED]**

Your site-wide meta description — the sentence Google and LinkedIn show under
your link — was still the theme's:

> "A simple, whitespace theme for academics. Based on [*folio](https://github.com/bogoli/-folio) design."

Fixed, along with:

- `keywords:` was empty → now a real list (eye-tracking, PINNs, cognitive load, …)
- `serve_og_meta: false` → **`true`**, and `og_image:` set to your profile photo.
  This is what makes your links render with a title, description, and picture when
  shared on LinkedIn, Bluesky, or Slack. Currently they render bare.
- `serve_schema_org: false` → **`true`** — structured data that helps Google
  present you as a person with an affiliation and publications.
- `search_enabled: false` → **`true`**. al-folio ships a good keyboard-driven
  search; with a publications page it earns its keep.
- `blog_name: al-folio` and `blog_description: a simple whitespace theme for academics`
  → replaced.
- `disqus_shortname: al-folio` → cleared. It was pointing your comment system at
  the theme's Disqus account.
- **`external_sources`** removed. This was configured to pull al-folio's Medium
  RSS feed *and* a 2024 Google Gemini blog post into your blog as "external posts".
  That is where several of those sitemap entries come from.

**Still to do (needs your input):**

- `google_site_verification:` is empty — you have no Search Console for this site,
  so you can't see what Google indexes or request removals. Worth 5 minutes.
- `analytics:` is entirely empty. Optional, but if you ever want to know whether
  anyone reads the projects pages, now is the time.
- `contact_note:` is empty and `email:` is commented out in `_data/socials.yml`.
  The about page ends with "feel free to get in touch!" but offers no email — only
  LinkedIn and Signal. Consider adding your institutional address.

---

## 3. Publications page **[PARTIALLY FIXED]**

Two data files were still pure Einstein-era theme demo data, which meant two
al-folio features were silently doing nothing:

- **`_data/coauthors.yml`** listed Podolsky, Rosen, Schrödinger, Planck, Lorentz
  and both Bachs. Replaced with your actual co-authors (Xenos, Minas, Michanetzi,
  Fotopoulos, Calvo-Cordoba, Theodosiou), so their names now highlight on the
  publications page. Only Xenos has a URL — **add ORCID or profile links for the
  others when you have them** (marked with a TODO in the file).
- **`_data/venues.yml`** listed AJP, PhysRev and Vision. Replaced with ESWA, AI,
  CHIGreece, AICCONF and WAIE.

Venue styling only works if the bib entries carry an `abbr` field, and none of
yours did — so I added `abbr` to all six entries in `papers.bib`. Your
publications now show a coloured venue badge instead of nothing.

Also fixed: `roumpas_modelling_2026` had `selected={True}` (capital T) while the
others use `selected={true}`. Depending on the Liquid comparison this could have
silently dropped it from the "selected papers" list on your homepage.

**Still to consider:** the publications page description reads *"here's a preview
of my latest publications"* — but it shows all of them, not a preview. Minor.

---

## 4. Broken image **[FIXED]**

`_projects/hci_design.md` referenced `assets/img/rqm_lecture.png`. The file on
disk is `rqm_lecture.jpg`. The Live Lecture & Whiteboard Platform section has been
rendering without its figure.

Worth wiring up your existing `.github/workflows/broken-links.yml` /
`broken-links-site.yml` to actually run on a schedule if they aren't — this is
exactly what they would have caught.

---

## 5. Repository weight

`assets/img/` still carries `1.jpg` through `12.jpg`, `rhino.png`,
`template_error.png` and `assets/pdf/example_pdf.pdf` — all al-folio samples, none
referenced by your content. The cleanup script removes them.

There is also a `lighthouse_results/` directory and a `readme_preview/` committed
to the repo. Neither is served content; consider `.gitignore`-ing the former.

Two CVs live in `assets/pdf/`: `KRoumpasCV_redacted.pdf` (linked) and
`cv_2026-07-02_redacted.pdf` (orphaned). Delete the stale one so there is no
ambiguity about which is current.

---

## 6. Content observations

**About page.** Strong — specific, well-paced, and the physics-to-HCI throughline
lands. Two thoughts. It ends on "just want to talk shop" but gives no email
(see §2). And it does not mention that you have an **open dataset**, which is a
genuine differentiator worth a clause.

**Datasets page.** Now shows both the Zenodo DOI and the paper DOI as separate
"Cite the dataset" / "Cite the paper" blocks **[FIXED]** — previously only the
CHIGreece paper was citable, even though the Zenodo record
(`10.5281/zenodo.21166557`) is what people should actually cite when they reuse
the data.

The page has room for one more entry. `_data/cv.yml` mentions the SCUDO and
translation-assistant work; if any of that data can be released, this page is
where it earns citations.

**Projects.** Cognitive Modelling and Educational Technology have been expanded
to match the depth of HCI & Interaction Design **[FIXED]** — each now has a lead
framing, three or four substantive sections drawn from the published papers with
real numbers, and a "Where this is going" close. Figure slots are marked with
`FIGURE SLOT` comments (safely wrapped in `{% raw %}` so Liquid doesn't try to
execute them) — drop in the PINN comparison plot, the blink density plot, and a
CourseCrafter screenshot when convenient and those pages will be visually level
with the HCI one.

Only published work is cited, per your call.

**Navigation.** Current order is about · publications · datasets · projects · CV.
Consider moving **projects** ahead of **datasets** — projects is the richer,
more browsable page, and datasets is currently a single entry.

**News.** `announcements: enabled: false` on the about page. Once the demo
announcements are gone, turning this on and posting three or four real items
(the ESWA paper, the Zenodo release, AICCONF 2026) gives the homepage a signal
of activity, which matters on an academic site.

---

## 7. Accessibility & performance

Not audited in depth — you already have `axe.yml` and `lighthouse-badger.yml`
workflows in the repo, which is more than most sites have. Two things I would
check once the demo content is gone:

- The new project pages use `loading="eager"` on figures copied from the HCI page
  pattern. For images below the fold, `loading="lazy"` is the better default.
- Confirm every `figure.liquid` include has meaningful alt text. The HCI page
  relies on `<div class="caption">` for description, which is visible text rather
  than an alt attribute — screen readers get the caption but not an image
  description.

---

## Applying the patch

Your local `~/kroumpas.github.io` checkout is **behind** `origin/main` (its
`_projects/hci_design.md` is 1.8 KB against 6.6 KB on the remote), so pull first:

```bash
cd ~/kroumpas.github.io
git pull
git apply --stat kroumpas-site-updates.patch   # preview
git apply kroumpas-site-updates.patch          # apply
git diff                                       # review
```

Then, separately and after reading it:

```bash
bash bin/remove_template_demo_content.sh
```

The patch was validated for YAML correctness, front-matter parsing, citation-key
resolution against `papers.bib`, and Liquid tag balance. A full Jekyll build was
not run — `rubygems.org` is blocked from the sandbox I was working in — so do a
local `bundle exec jekyll serve` before pushing.
