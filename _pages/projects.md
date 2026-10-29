---
layout: page
title: projects
permalink: /projects/
description: Funded projects, tools and interfaces I designed and built.
nav: true
nav_order: 3
---

{% assign sorted_projects = site.projects | sort: "importance" %}

<div class="projects">
  <div class="row row-cols-1 row-cols-md-2">
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
