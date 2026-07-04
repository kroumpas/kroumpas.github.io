---
layout: page
permalink: /datasets/
title: datasets
description: Open datasets from our experiments — free to use and cite.
nav: true
nav_order: 3
---

Publicly available datasets gathered from our experiments. Each links to a GitHub repository with its documentation and license.

{% if site.data.repositories.github_repos %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>

{% endif %}
