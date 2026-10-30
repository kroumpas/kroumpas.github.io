---
layout: page
title: HCI & Interaction Design
description: Dashboards and interfaces that turn dense project data into something usable.
importance: 3
category: hci and design
related_publications: true
---

The same user-centred thinking I bring to research — what does the user need to see, and when? — I bring to real interfaces. As a Technical Manager on EU Horizon projects, I design the dashboards and interactions that turn dense, multi-source project data into something people can read and act on.

The interface work also runs through my research on AI-assisted platforms for educators, where designing the tool's interaction model was as much of the challenge as the underlying system {% cite roumpas_design_2024 roumpas_bridging_2025 %}. Across both, the work spans information architecture, data visualization, and interaction design — deciding what to surface, how to structure it, and how to keep it legible under real-world data. Designed in Figma.

**What's here:** dashboard design, data visualization, interaction design, Figma, user-centred design for EU R&D.

---

## Selected design work

Each of these has its own page with the design rationale and screens.

<div class="projects">
  <div class="row row-cols-1 row-cols-md-2">
    {% assign design_projects = site.projects | where: "hci", true | sort: "importance" %}
    {% for project in design_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
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
