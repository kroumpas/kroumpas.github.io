---
layout: page
title: Cognitive Modelling
description: PINNs, gaze prediction, and eye movements as signals of mental demand.
img: assets/img/Frame 1.png
importance: 1
category: cognitive modelling
related_publications: true
---

I treat the eye as an instrument. Gaze position, fixation patterns, blink dynamics, and pupil response are all measurable signals, and my research asks how much we can infer from them about attention and cognitive load — and how well we can model and predict them.

Coming from physics, I lean on physics-informed approaches. Eye movement is one of the rare human behaviours with a genuine mechanical description: the eye is a near-perfect sphere rotating about a fixed centre, and Donders' and Listing's laws constrain which orientations it can actually take. That makes it an unusually good candidate for physics-informed neural networks (PINNs), which are widely used in the natural sciences but rarely applied in HCI — largely because most HCI problems have no defensible governing equations. Eye tracking does.

**Methods & tools:** Python, PyTorch, physics-informed neural networks, Tobii Pro Spectrum & Pro Lab, SHAP, scikit-learn, MNE.

---

## Physics-Informed Gaze Prediction

The core question: does constraining a neural network with the physics of eye rotation actually make it predict gaze better than the same network without those constraints? {% cite roumpas_comparative_2025 %}

I derived partial differential equations describing eye and head movement in spherical coordinates, and added them as a physics loss term alongside the standard data loss. The comparison was deliberately tight — identical architecture (three fully connected layers, ReLU, two output branches for gaze points and angular dynamics), identical features, identical data — so the *only* difference was the physics. Data came from an adaptive-interface experiment with pilots, which gave a useful mix of steady fixations and rapid glances.

The PINN won, and won asymmetrically. It reached a mean absolute error of **0.61 horizontally and 0.35 vertically**, and explained substantially more variance in the vertical axis (**R²ᵧ = 0.91 vs 0.85** for the baseline). Vertical gaze is where the physical constraint bites hardest: MAE dropped 29% and RMSE 20%. Horizontal predictions improved on error terms but the two models stayed close on R², which is an honest limitation rather than a footnote — the horizontal constraint is doing less work than the vertical one.

A SHAP analysis explained why. Directional gaze features dominate, left/right vertical directions are strongly redundant with each other, and pupil diameter contributes almost nothing to gaze estimation — useful negative evidence for anyone building a feature set. Getting the physics loss to train stably needed adaptive loss scaling and gradient clipping; an unweighted physics term simply overwhelms the data term.

{% raw %}
<!-- FIGURE SLOT: PINN vs NN — predicted-vs-actual gaze trajectory, or the MAE/R² comparison bar chart from the ESWA paper.
<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/YOUR_IMAGE.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Caption here.
</div>
-->
{% endraw %}

---

## Which Architecture Actually Fits Eye Movement?

The obvious follow-up: PINNs beat a plain feedforward network, but gaze is a *sequence* on a *graph of successive samples*. Surely a temporal or relational architecture does better? {% cite roumpas_modelling_2026 %}

I tested that directly, moving to wearable eye-tracking glasses and comparing six models — a feedforward NN, a Graph Neural Network (each gaze sample a node, edges along temporal adjacency), a Temporal Convolutional Network, and physics-informed hybrids of all three.

The answer was no, and cleanly so. The **pure PINN outperformed every alternative**, reaching MAE 0.735 (X) and 0.716 (Y) with R² of 0.996 on both axes; paired Wilcoxon signed-rank tests put every comparison against it well below p < 0.01. The GNN and TCN landed at or below the plain baseline, and — the more interesting result — the PINN-GNN and PINN-TCN hybrids showed *higher* error variance than the pure PINN. Adding graph and temporal machinery on top of the physics made the model less stable, not more expressive. Trajectory plots show the same story qualitatively: the PINN tracks ground truth closely while the data-driven models produce visibly noisy paths, with the residual errors concentrated at screen edges where calibration is weakest anyway.

For HCI this is a practical finding. The cheapest model in the comparison is also the best one, provided you spend the effort on the equations instead of the architecture.

{% raw %}
<!-- FIGURE SLOT: model comparison — MAE across the six architectures with confidence intervals, or the trajectory plot (actual vs predicted).
<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/YOUR_IMAGE.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Caption here.
</div>
-->
{% endraw %}

---

## Blink Dynamics as a Discrete Signal

Gaze is continuous; blinks are events. Separating a *deliberate* blink from a reflexive one turns the eyelid into a usable input channel — but only if the separation is reliable. {% cite roumpas_distinguishing_2025 %}

Working from eye-openness time series rather than pupil-loss detection (a more direct measure of eyelid movement), I collected recordings from **44 participants** across blink, non-blink, and full-recording conditions, and trained a feedforward classifier on blink duration plus per-eye eye-openness means and standard deviations. It reaches **92% test accuracy**.

The distributions themselves were the more interesting result. Voluntary blinks form a single broad peak of longer closures — the signature of controlled, intentional movement. Involuntary blinks are *bimodal*, showing two distinct peaks that survived a refined cluster-based reclassification. Whether that reflects genuine physiological subtypes, an artefact of the experimental conditions, or something else is still open, and it is the kind of loose end I would rather flag than paper over. The dataset and trained model are [openly published](/datasets/) so others can check it.

{% raw %}
<!-- FIGURE SLOT: blink duration density plot — voluntary (single broad peak) vs involuntary (bimodal).
<div class="row justify-content-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/YOUR_IMAGE.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Caption here.
</div>
-->
{% endraw %}

---

## Where This Is Going

The three strands converge on one question: how far can oculomotor behaviour be read as a proxy for mental effort? A model accurate enough to predict where the eye *should* go makes its own failures informative — the moments where behaviour departs from the physical model are exactly the moments worth examining. Turning that into a validated marker of cognitive state, robust enough to drive an adaptive interface in real time, is the direction of my current work.
