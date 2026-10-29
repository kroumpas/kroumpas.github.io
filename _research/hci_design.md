---
layout: page
title: HCI & Interaction Design
description: Dashboards and interfaces that turn dense project data into something usable.
img: assets/img/Frame 3.png
importance: 1
category: hci and design
related_publications: true
---

The same user-centred thinking I bring to research — what does the user need to see, and when? — I bring to real interfaces. As a Technical Manager on EU Horizon projects, I design the dashboards and interactions that turn dense, multi-source project data into something people can read and act on.

The interface work also runs through my research on AI-assisted platforms for educators, where designing the tool's interaction model was as much of the challenge as the underlying system {% cite roumpas_design_2024 roumpas_bridging_2025 %}. Across both, the work spans information architecture, data visualization, and interaction design — deciding what to surface, how to structure it, and how to keep it legible under real-world data. Designed in Figma.

**What's here:** dashboard design, data visualization, interaction design, Figma, user-centred design for EU R&D.

---

## SCUDO — Lagoon Operations Dashboard

When an _acqua alta_ event hits Venice, an operator has to reason about tide forecasts, closed _pontili_, suspended waterbus routes, and stalled waste collection all at once. The design problem was triage: how do you let one person read a fast-moving, multi-source situation in seconds and know what to do next? I led with a single "Situation Overview" that pins the active disruption and its severity to the top, then lays out operational summary, network status, live alerts, a 12-hour tide/wind/demand forecast, and impact KPIs in a scannable grid — with prioritised recommended actions so the interface doesn't just report, it prompts a decision.

<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/scudo_dashboard.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    SCUDO situation-overview dashboard for the Venice lagoon transport and waste-collection network: disruption banner, forecast, impact KPIs, and ranked response options in one view.
</div>

---

## Search-and-Rescue Flight Map

A helicopter mission interface has to stay legible when the pilot has almost no attention to spare. The challenge here was reducing a dense 3D flight situation to what matters in the moment: a satellite map with hazard and coverage zones marked in high-contrast red, the route to target drawn as a single bold green line, and a vertical altitude tape that reads at a glance. Persistent telemetry (TAS, GS, heading, ALT, UTC, coordinates) sits along the top, and the controls are pushed to edge rails — Camera, Data, Charts on the left; Radio, System, Mission on the right — so the map itself never gets crowded.

<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/sar_flightmap.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Search-and-rescue flight interface: high-contrast hazard zones, a single clear route-to-target, an at-a-glance altitude tape, and always-on telemetry with edge-docked controls.
</div>

---

## Live Lecture & Whiteboard Platform

This interface comes out of my research on AI-assisted platforms for educators. An online lecture asks a learner to split attention across the instructor, the material, the whiteboard, and their peers — so the interaction model, not just the feature set, was the real design work. I gave the whiteboard the centre stage and kept everything supporting it in a calm left column: today's subject, the instructor's video, a collapsible Material menu, and a live chat that surfaces exactly the moments teaching needs to catch ("Can you repeat that?", "Is this going to be on the test?"). Participant tiles and a Whiteboard Mode toggle sit on the right, so the layout flexes between "watch the teacher" and "focus on the work."

<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/rqm_lecture.jpg" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Live lecture platform: whiteboard-centred layout with a supporting rail for subject, instructor, material, and a chat that surfaces real learner questions in the moment.
</div>

---

## Course Crafter — AI Course Authoring

Course Crafter is a tool for building courses from your own material with an AI assistant {% cite roumpas_design_2024 roumpas_bridging_2025 %}. The design goal was to make an AI-driven workflow feel unintimidating: a drag-and-drop canvas as the obvious starting point, a prompt bar as the single conversational entry point, and a short, jargon-free action rail (My Files, Save, Start Over, Help, Exit) so nothing about "authoring with AI" feels like a wall of settings. The retro pixel treatment is a deliberate move to make an unfamiliar workflow read as approachable and low-stakes rather than technical.

<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/course_crafter.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Course Crafter: a drag-and-drop canvas and single prompt bar for AI-assisted course building, with a deliberately playful pixel aesthetic to lower the barrier to entry.
</div>

---

## Tiny Terrain — Brand & Marketing Site

Beyond operational tooling, this is a full marketing site for an education studio that teaches occupational and campus safety through Minecraft-based gamification. Here the design problem was voice: land a distinct pixel-art brand while keeping a content-heavy page — hero, three service areas, portfolio imagery, and contact — clearly structured and readable. The angled section breaks and consistent card framing carry the visitor down the page without the styling ever getting in the way of the copy.

<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/tiny_terrain.jpg" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Tiny Terrain: a pixel-art brand and marketing site for gamified safety education, balancing a strong visual identity against a readable, content-heavy layout.
</div>
