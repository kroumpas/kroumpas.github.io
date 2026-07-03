---
layout: page
title: Cognitive Modelling
description: PINNs, gaze prediction, and eye movements as signals of mental demand.
img: assets/img/3.jpg
importance: 1
related_publications: false
---

I treat the eye as an instrument. Gaze position, fixation patterns, blink dynamics, and pupil response are all measurable signals, and my research asks how much we can infer from them about attention and cognitive load — and how well we can model and predict them.

Coming from physics, I lean on physics-informed approaches. My published work compares physics-informed neural networks (PINNs) against conventional networks for predicting on-screen gaze points from eye-tracking data, and introduces a method for distinguishing voluntary from involuntary blinks using eye-openness metrics. The longer aim is to read oculomotor behaviour as a proxy for mental effort.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/3.jpg" title="gaze prediction" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/4.jpg" title="eye-tracking data" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Replace with your own figures — a gaze heatmap, a model/error plot, or an eye-tracking setup work well here.
</div>

**Methods & tools:** Python, PyTorch, physics-informed neural networks, Tobii Pro Lab, MNE, scikit-learn.

Related papers are on the [publications](/publications/) page. Want the detail? [Get in touch](https://www.linkedin.com/in/kroumpas).
