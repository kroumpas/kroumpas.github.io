---
layout: page
title: research
permalink: /research/
description: the questions behind my PhD and my papers.
nav: true
nav_order: 2
---

<!-- _pages/research.md: lists the research themes in _research/ (moved here from _projects/). -->

{% assign sorted_research = site.research | sort: "importance" %}

<div class="projects">
  <div class="row row-cols-1">
    {% for project in sorted_research %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
  </div>
</div>
