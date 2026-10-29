---
layout: page
title: projects
permalink: /projects/
description: applied work, from funded projects to tools and interfaces I designed and built.
nav: true
nav_order: 3
---

<!-- _pages/projects.md: card grid of everything in _projects/. Research themes live in _research/ and are listed on /research/. -->

{% assign sorted_projects = site.projects | sort: "importance" %}

<div class="projects">
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>
