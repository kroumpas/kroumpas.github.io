---
layout: page
title: SCUDO
description: Horizon Europe · operator dashboards for disruption-resilient transport
img: assets/img/projects/scudo.jpg
importance: 1
---

SCUDO (_Safe and Comprehensive Urban Development and Transport Management for Disruption-resilient Operations_) is a Horizon Europe research and
innovation action on keeping transport networks safe and running through disruption, with use cases in Athens, Bavaria, Amsterdam and Venice. I design
the project's operator dashboards at [Frontier Innovations](https://www.frontier-innovations.com/), one of the partners.

## Venice: lagoon operations

When an _acqua alta_ event hits Venice, an operator has to reason about tide forecasts, closed _pontili_, suspended waterbus routes, and stalled waste collection all at once. The design problem was triage: how do you let one person read a fast-moving, multi-source situation in seconds and know what to do next? I led with a single "Situation Overview" that pins the active disruption and its severity to the top, then lays out operational summary, network status, live alerts, a 12-hour tide/wind/demand forecast, and impact KPIs in a scannable grid — with prioritised recommended actions so the interface doesn't just report, it prompts a decision.

<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/scudo_dashboard.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    SCUDO situation-overview dashboard for the Venice lagoon transport and waste-collection network: disruption banner, forecast, impact KPIs, and ranked response options in one view.
</div>

## Athens: metro disruption

The same layout carries over to the Athens metropolitan transport network, here for an extreme-rainfall event: closed stations and affected lines on the
map, line status and live alerts beside it, a 1–6 hour forecast, and the impact KPIs and ranked recommended actions underneath.

<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="lazy" path="assets/img/projects/scudo-athens.png" class="img-fluid rounded z-depth-1" alt="SCUDO situation overview for the Athens metropolitan transport network" %}
    </div>
</div>
<div class="caption">
    SCUDO situation overview for the Athens metropolitan transport network during a flooding scenario: station closures on the map, line status, alerts, forecast, impact KPIs and recommended actions.
</div>

## project

- **programme:** Horizon Europe, research and innovation action
- **topic:** HORIZON-CL5-2024-D6-01-11
- **grant agreement:** 101203037
- **duration:** May 2025 – April 2028
- **coordinator:** ERTICO – ITS Europe
- **links:** [scudo-project.eu](https://scudo-project.eu/) · [CORDIS](https://cordis.europa.eu/project/id/101203037)

<div style="display: flex; align-items: center; gap: 1rem; margin-top: 3rem">
  <img src="{{ '/assets/img/eu/eu-flag.svg' | relative_url }}" alt="Flag of the European Union" style="height: 40px; width: auto">
  <p style="margin: 0; font-size: 0.85rem">
    Funded by the European Union under grant agreement No 101203037. Views and opinions expressed are however those of the author(s) only and do not
    necessarily reflect those of the European Union or the granting authority. Neither the European Union nor the granting authority can be held
    responsible for them.
  </p>
</div>
