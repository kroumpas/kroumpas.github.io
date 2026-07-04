---
layout: page
title: projects
permalink: /projects/
description: Three areas where my research and work come together.
nav: true
nav_order: 4
horizontal: false
---

<!-- pages/projects.md -->

<div class="projects">
  {% assign sorted_projects = site.projects | sort: "importance" %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>

---

<div class="text-center">
  <p>
    Interested in collaborating, or want more detail on any of this?<br />
    Reach me on <a href="https://www.linkedin.com/in/kroumpas">LinkedIn</a> or
    <a href="https://signal.me/#eu/ng183HC27k4CqPI0BkXjoReVCzV5J_pzesaPVrvqrvRiSPXQ23NK0Kq9ptHMH5Eh">Signal</a>.
  </p>
</div>
