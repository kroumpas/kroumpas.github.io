---
layout: page
title: publication footprint
permalink: /footprint/
description: Citations, venues and co-authors behind my publications, from OpenAlex.
---

<link rel="stylesheet" href="{{ '/assets/footprint/footprint.css' | relative_url }}">

<div class="fp" data-src="{{ '/assets/json/footprint.json' | relative_url }}" data-fallback="{{ '/publications/' | relative_url }}">
  <p class="fp-status">Loading the latest numbers…</p>
  <noscript><p class="fp-status">This page needs JavaScript. The full list of papers is on the <a href="{{ '/publications/' | relative_url }}">publications page</a>.</p></noscript>
</div>

<script defer src="{{ '/assets/footprint/footprint.js' | relative_url }}"></script>
