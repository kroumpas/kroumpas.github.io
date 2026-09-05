# kroumpas.github.io

The personal academic site of **Konstantinos Roumpas** — PhD candidate at the University of Patras and Technical Manager at Frontier Innovations, working on human–computer interaction and applied machine learning.

**Live at [kroumpas.github.io](https://kroumpas.github.io)**

The research behind the site: physics-informed neural networks for gaze prediction, eye-tracking and blink dynamics as signals of cognitive load, and AI-assisted tools for educators.

---

## Where the content lives

Almost everything on the site is edited as plain text or YAML — you rarely need to touch a template.

| Path                       | What it holds                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `_pages/`                  | The top-level pages: about, publications, datasets, projects, CV, news                         |
| `_projects/`               | The three research area write-ups (cognitive modelling, ed-tech, HCI)                          |
| `_bibliography/papers.bib` | Every publication. `abbr` sets the venue badge; `selected={true}` puts a paper on the homepage |
| `_data/cv.yml`             | The CV page, in RenderCV-style YAML                                                            |
| `_data/venues.yml`         | Venue badge colours and links, keyed by the `abbr` in the `.bib`                               |
| `_data/coauthors.yml`      | Co-author name highlighting and profile links                                                  |
| `_data/socials.yml`        | Profile links (ORCID, Scholar, GitHub, LinkedIn) and the CV PDF path                           |
| `assets/img/`              | Figures and screenshots                                                                        |
| `_config.yml`              | Site-wide settings                                                                             |

Citations on the publications page are refreshed automatically from Google Scholar by a scheduled GitHub Action, which writes to `_data/citations.yml`. That file is generated — don't edit it by hand.

## Running it locally

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>. Changes to content files reload automatically; changes to `_config.yml` need a restart.

Pushing to `main` triggers the deploy workflow, which builds the site and publishes it to GitHub Pages.

## A note on the CV page

`_data/cv.yml` drives the CV page. Section names that the theme recognises — Education, Experience, Publications, Skills, Languages, Certificates, Projects, Awards, Interests, References — each get purpose-built formatting. Any other section name falls through to a generic renderer that only understands `bullet`, or a `label`/`details` pair. If a custom section ever renders blank, that mismatch is why.

---

## Built on al-folio

This site is built with [**al-folio**](https://github.com/alshedivat/al-folio), an excellent open-source Jekyll theme for academics by Maruan Al-Shedivat and contributors. If you like the look of this site and want your own, **start from al-folio directly** rather than forking this repository — you'll get the upstream documentation, the full theme feature set, and none of my content to delete. Their README walks you through it.

## Licence

Two different things live in this repository, under two different licences.

**The theme and code** — everything inherited from or contributed back to al-folio, including templates, styles, scripts, workflows and configuration — remains under the [MIT Licence](LICENSE), copyright Maruan Al-Shedivat and the al-folio contributors. You are free to use, modify and redistribute it under those terms.

**The content is not.** All original site content — the writing in `_pages/` and `_projects/`, the CV in `_data/cv.yml`, and the figures, screenshots and images in `assets/` — is © Konstantinos Roumpas, all rights reserved. Please don't republish or redistribute it without asking. You're welcome to read it, link to it, and quote it with attribution as you would any other publication.

**Papers and datasets are separate again.** Publications are governed by their respective publishers' terms; cite the paper. The [blink detection dataset and model](https://doi.org/10.5281/zenodo.21166557) is openly available on Zenodo under the licence stated in that record — please cite the Zenodo DOI when you use the data, and the CHIGreece '25 paper when you refer to the method.

If you'd like to reuse anything here beyond that, [get in touch](https://www.linkedin.com/in/kroumpas) — the answer is usually yes.
