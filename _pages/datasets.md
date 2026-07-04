---
layout: page
title: datasets
permalink: /datasets/
description: Open datasets from our experiments, free to use and cite.
nav: true
nav_order: 3
---

Below are publicly available datasets gathered from our experiments. Each links to a GitHub repository with documentation and licensing. If you use one in your work, a citation is appreciated — see each repo's README for a citable reference.

{% if site.data.repositories.dataset_repos %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
{% for repo in site.data.repositories.dataset_repos %}
{% include repository/repo.liquid repository=repo %}
{% endfor %}
</div>

{% else %}

_No datasets listed yet — add repository names to `dataset_repos` in `_data/repositories.yml`._

{% endif %}
