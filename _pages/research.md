---
layout: page
title: research
permalink: /research/
description: Three areas where my research and work come together.
nav: true
nav_order: 2
---

{% assign sorted_research = site.research | sort: "importance" %}

<div class="projects">
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_research %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>
