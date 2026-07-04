---
layout: page
title: projects
permalink: /projects/
description: Three areas where my research and work come together.
nav: true
nav_order: 4
display_categories: [cognitive modelling, educational technology, hci and design]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}
  <!-- Display projects without categories -->
  {% assign sorted_projects = site.projects | sort: "importance" %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
{% endif %}
</div>

---

<div class="text-center">
  <p>Interested in collaborating, or want more detail on any of this?<br>
  Reach me on <a href="https://www.linkedin.com/in/kroumpas">LinkedIn</a> or <a href="https://signal.me/#eu/ng183HC27k4CqPI0BkXjoReVCzV5J_pzesaPVrvqrvRiSPXQ23NK0Kq9ptHMH5Eh">Signal</a>.</p>
</div>
