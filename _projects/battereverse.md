---
layout: page
title: BatteReverse
description: Horizon Europe · battery passport and second-life diagnostics app
img: assets/img/projects/battereverse.jpg
importance: 2
hci: true
---

BatteReverse is a Horizon Europe project on the reverse logistics of end-of-first-life EV batteries: discharge and first diagnosis, automated dismantling
and sorting, safe packaging, and a battery data space with digital battery passports, all demonstrated on real packs headed for recycling or a second
life.

{% include figure.liquid loading="eager" path="assets/img/projects/battereverse.jpg" class="img-fluid rounded z-depth-1" alt="BatteReverse app screens" %}

## the app

The app follows a single battery pack through that process. It brings together the pack's passport fields, mapped to the EU Battery Regulation
(2023/1542), the responsible actor and the pack's current location and state, diagnosis test results per module, state-of-health and
remaining-useful-life estimates, and which second-life uses (frequency regulation, peak shaving, EV charging, back-up power, off-grid power) each
module still qualifies for.

## what I did

The modules came from different partners. I didn't implement them; I managed their integration into one app and worked out how they connect: which data
feeds which module, and how that information is visualised for the person using it. I also ran the user evaluation of the Battery Data Space
application.

## project

- **programme:** Horizon Europe, Batteries Partnership
- **topic:** HORIZON-CL5-2022-D2-01-10
- **grant agreement:** 101103706
- **duration:** May 2023 – October 2026
- **coordinator:** CEA (Commissariat à l'énergie atomique et aux énergies alternatives)
- **my organisation:** [Frontier Innovations](https://www.frontier-innovations.com/)
- **links:** [CORDIS](https://cordis.europa.eu/project/id/101103706)

<div style="display: flex; align-items: center; gap: 1rem; margin-top: 3rem">
  <img src="{{ '/assets/img/eu/eu-flag.svg' | relative_url }}" alt="Flag of the European Union" style="height: 40px; width: auto">
  <p style="margin: 0; font-size: 0.85rem">
    Funded by the European Union under grant agreement No 101103706. Views and opinions expressed are however those of the author(s) only and do not
    necessarily reflect those of the European Union or the granting authority. Neither the European Union nor the granting authority can be held
    responsible for them.
  </p>
</div>
