---
layout: page
title: Cognitive Modelling
description: PINNs, gaze prediction, and eye movements as signals of mental demand.
img: assets/img/3.jpg
importance: 1
category: cognitive modelling
related_publications: true
---

I treat the eye as an instrument. Gaze position, fixation patterns, blink dynamics, and pupil response are all measurable signals, and my research asks how much we can infer from them about attention and cognitive load — and how well we can model and predict them.

Coming from physics, I lean on physics-informed approaches. My published work compares physics-informed neural networks (PINNs) against ther neural networks for predicting on-screen gaze points from eye-tracking data {% cite roumpas_comparative_2025,11600664 %}, and introduces a method for distinguishing voluntary from involuntary blinks using eye-openness metrics {% cite roumpas_distinguishing_2025 %}. The longer aim is to read oculomotor behaviour as a proxy for mental effort.

**Methods & tools:** Python, PyTorch, physics-informed neural networks, Tobii Pro Lab, MNE, scikit-learn.
