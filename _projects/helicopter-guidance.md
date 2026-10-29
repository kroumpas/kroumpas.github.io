---
layout: page
title: Helicopter Guidance Interface
description: concept for a search-and-rescue helicopter flight display
img: assets/img/projects/helicopter-guidance.jpg
importance: 3
---

A helicopter mission interface has to stay legible when the pilot has almost no attention to spare. The challenge here was reducing a dense 3D flight situation to what matters in the moment: a satellite map with hazard and coverage zones marked in high-contrast red, the route to target drawn as a single bold green line, and a vertical altitude tape that reads at a glance. Persistent telemetry (TAS, GS, heading, ALT, UTC, coordinates) sits along the top, and the controls are pushed to edge rails — Camera, Data, Charts on the left; Radio, System, Mission on the right — so the map itself never gets crowded.

<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/sar_flightmap.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Search-and-rescue flight interface: high-contrast hazard zones, a single clear route-to-target, an at-a-glance altitude tape, and always-on telemetry with edge-docked controls.
</div>
