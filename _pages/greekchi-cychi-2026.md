---
layout: page
title: Gaze, physics and cognitive insight
permalink: /posters/greekchi-cychi-2026/
description: An interactive version of our poster for the ACM GreekCHI-CYCHI Symposium 2026.
related_publications: true
---

<link rel="stylesheet" href="{{ '/assets/posters/greekchi-cychi-2026/infographic.css' | relative_url }}">

<div class="ig">

<section class="ig-hero">
  <div>
    <p class="ig-kicker">Poster · ACM GreekCHI-CYCHI Symposium 2026</p>
    <h2>Applying Physics-Informed Neural Networks and Eye-Tracking Data to Gain Cognitive Insights in Human-Centred Applications</h2>
    <p class="ig-authors">
      Konstantinos Roumpas, Michalis Xenos · Software Quality &amp; HCI Laboratory, Dept. of Computer Engineering &amp; Informatics, University of Patras
    </p>
    <p>
      Combining the equations governing the dynamics of an eye with eye-tracking data, we created an algorithm that essentially replicates the function of
      eye-tracking software. Along the way we compared different networks on the problem, and looked at what the model's least accurate moments have in
      common.
    </p>
    <div class="ig-actions">
      <a class="ig-btn" href="{{ '/assets/posters/greekchi-cychi-2026/poster.pdf' | relative_url }}">Download the poster (PDF)</a>
      <a class="ig-btn ig-btn-ghost" href="#results">Jump to the results</a>
    </div>
  </div>
  <div class="ig-eye">
    <svg id="ig-eye" viewBox="0 0 200 200" role="img" aria-label="An eye drawn on a sphere that turns towards your pointer">
      <circle class="ln" cx="100" cy="100" r="90" stroke-width="3" />
      <ellipse class="ln-faint" id="ig-eqt" cx="100" cy="100" rx="90" ry="22" stroke-width="1.5" />
      <ellipse class="ln-faint" id="ig-mer" cx="100" cy="100" rx="34" ry="90" stroke-width="1.5" />
      <g id="ig-iris">
        <ellipse class="iris" cx="100" cy="100" rx="24" ry="24" />
        <ellipse class="pupil" cx="100" cy="100" rx="9" ry="9" />
      </g>
    </svg>
    <p class="ig-hint">Move your pointer, or tap: the eye turns to follow it.</p>
  </div>
</section>

<section class="ig-reveal">
  <p class="ig-kicker">Objectives</p>
  <div class="ig-objectives">
    <div class="ig-card"><span class="ig-num">01</span><strong>Model gaze with physics, not just data.</strong></div>
    <div class="ig-card"><span class="ig-num">02</span><strong>Turn gaze into cognitive insight.</strong></div>
    <div class="ig-card"><span class="ig-num">03</span><strong>Keep it responsible and sustainable.</strong></div>
  </div>
</section>

<section class="ig-reveal">
  <h2>How the model learns</h2>
  <p class="ig-sub">
    A physics-informed neural network (PINN) is a network whose loss combines a standard data term with a physics term, derived from the equations governing
    the system. Pick a step to see what it does.
  </p>
  <div class="ig-pipeline" role="group" aria-label="Steps of the model">
    <button type="button" class="ig-step" data-step="input" aria-pressed="true"><small>1 · input</small>Gaze direction</button>
    <button type="button" class="ig-step" data-step="net" aria-pressed="false"><small>2 · network</small>Neural network</button>
    <button type="button" class="ig-step" data-step="data" aria-pressed="false"><small>3 · data loss</small>Labelled data</button>
    <button type="button" class="ig-step" data-step="bc" aria-pressed="false"><small>4 · physics loss</small>Boundary conditions</button>
    <button type="button" class="ig-step" data-step="pde" aria-pressed="false"><small>5 · physics loss</small>Equation residual</button>
    <button type="button" class="ig-step" data-step="opt" aria-pressed="false"><small>6 · feedback</small>Total loss</button>
  </div>
  <div class="ig-card ig-detail" id="ig-detail" aria-live="polite"></div>
  <div class="ig-eq">$$L_{\text{total}} = L_{\text{data}} + \lambda\, L_{\text{physics}}$$</div>
  <p class="ig-loss">The physics weight λ = 1.4 was tuned.</p>
</section>

<section class="ig-reveal">
  <h2>The guiding equation</h2>
  <p class="ig-sub">The physics term encodes the eye's rotational dynamics on Donders' surface. Tap a symbol to see what it stands for.</p>
  <div class="ig-card">
    <div class="ig-eq">$$H = \frac{\delta}{2}\,\Gamma_1^{T}\Gamma_1 + p^{T}F \qquad \Gamma = \frac{d}{dt}\frac{\partial \mathcal{L}}{\partial \dot{X}} - \frac{\partial \mathcal{L}}{\partial X}$$</div>
    <div class="ig-terms" role="group" aria-label="Symbols in the equation">
      <button type="button" class="ig-chip" data-term="H" aria-pressed="true">H</button>
      <button type="button" class="ig-chip" data-term="G1" aria-pressed="false">Γ</button>
      <button type="button" class="ig-chip" data-term="L" aria-pressed="false">ℒ</button>
      <button type="button" class="ig-chip" data-term="Gam1" aria-pressed="false">Γ₁</button>
      <button type="button" class="ig-chip" data-term="G" aria-pressed="false">G</button>
      <button type="button" class="ig-chip" data-term="rho" aria-pressed="false">ρ</button>
      <button type="button" class="ig-chip" data-term="p" aria-pressed="false">p</button>
      <button type="button" class="ig-chip" data-term="d" aria-pressed="false">δ</button>
    </div>
    <p class="ig-term-text" id="ig-term" aria-live="polite"></p>
  </div>
</section>

<section class="ig-reveal" id="results">
  <h2>Does it work?</h2>
  <p class="ig-sub">The pure PINN achieves the lowest error on both axes, beating the feed-forward, GNN and TCN baselines and every PINN hybrid.</p>
  <div class="ig-stats">
    <div class="ig-card ig-stat"><div class="v">0.735</div><div class="l">PINN mean absolute error, horizontal (X)</div></div>
    <div class="ig-card ig-stat"><div class="v">0.716</div><div class="l">PINN mean absolute error, vertical (Y)</div></div>
    <div class="ig-card ig-stat"><div class="v">−64%</div><div class="l">error on X compared with the feed-forward network</div></div>
  </div>
  <div class="ig-card">
    <div class="ig-chart-head">
      <h3>Mean absolute error by model</h3>
      <div class="ig-legend">
        <span><i style="background: var(--global-theme-color)"></i>PINN</span><span><i style="background: var(--ig-rest)"></i>other models</span>
      </div>
    </div>
    <div class="ig-chart" id="ig-mae"></div>
    <p class="ig-note">
      Lower is better. All differences vs. the PINN are significant (Wilcoxon, p &lt; 0.01).
      <button type="button" class="ig-linkbtn" id="ig-mae-table-btn" aria-expanded="false" aria-controls="ig-mae-table">Show as table</button>
    </p>
    <table class="ig-table" id="ig-mae-table" hidden>
      <thead>
        <tr><th>Model</th><th>MAE X</th><th>MAE Y</th></tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

  <div class="ig-card" style="margin-top: 1rem">
    <div class="ig-chart-head"><h3>Predicted vs. actual gaze points</h3></div>
    <div class="ig-models" role="group" aria-label="Choose a model">
      <button type="button" class="ig-chip" data-model="PINN" aria-pressed="true">PINN</button>
      <button type="button" class="ig-chip" data-model="NN" aria-pressed="false">NN</button>
      <button type="button" class="ig-chip" data-model="GNN" aria-pressed="false">GNN</button>
      <button type="button" class="ig-chip" data-model="TCN" aria-pressed="false">TCN</button>
      <button type="button" class="ig-chip" data-model="PINN-GNN" aria-pressed="false">PINN-GNN</button>
      <button type="button" class="ig-chip" data-model="PINN-TCN" aria-pressed="false">PINN-TCN</button>
    </div>
    <div class="ig-figure">
      <img
        src="{{ '/assets/posters/greekchi-cychi-2026/gaze-scatter.png' | relative_url }}"
        alt="Six scatter panels of predicted against actual gaze points, one per model, coloured by Euclidean error"
        width="861"
        height="529"
        loading="lazy"
      />
      <div class="ig-focus" id="ig-focus" style="left: 56.6%; top: 7%; width: 26.5%; height: 40.8%"></div>
    </div>
    <p class="ig-model-text" id="ig-model-text" aria-live="polite"></p>
    <p class="ig-note">Colour shows the Euclidean error of each prediction, from blue (low) to red (high).</p>
  </div>
</section>

<section class="ig-reveal">
  <h2>What's with the deviations?</h2>
  <p class="ig-sub">We trained a classifier to predict when the physics model misses, using standard ocular features.</p>
  <div class="ig-dev">
    <div class="ig-auc"><svg id="ig-auc" viewBox="0 0 280 175" role="img" aria-label="Area under the ROC curve: 0.768, where 0.5 is chance and 1.0 is perfect"></svg></div>
    <div>
      <blockquote class="ig-quote">
        An AUC of 0.768 is well above chance, which establishes that the ocular features carry real joint information about when the physics model fails. It
        is also far from perfect, and it should be. The value of the residual is precisely that it captures something the standard features do not fully
        explain.
      </blockquote>
      <ul class="ig-features" aria-label="Classifier coefficients">
        <li><span>Blink count</span><span>largest positive weight</span></li>
        <li><span>Saccade velocity</span><span>positive</span></li>
        <li><span>Time</span><span>small, positive</span></li>
        <li><span>Pupil</span><span>small, negative</span></li>
        <li><span>Fixation duration</span><span>largest negative weight</span></li>
      </ul>
      <p class="ig-note">
        <button type="button" class="ig-linkbtn" id="ig-fig-btn" aria-expanded="false" aria-controls="ig-fig">Show the original figure</button>
      </p>
    </div>
  </div>
  <div class="ig-collapsible" id="ig-fig" hidden>
    <div class="ig-figure" style="margin-top: 1rem">
      <img
        src="{{ '/assets/posters/greekchi-cychi-2026/roc-coefficients.png' | relative_url }}"
        alt="ROC curve with AUC 0.768 next to a bar chart of the classifier coefficients for fixation duration, pupil, time, saccade velocity and blink count"
        width="1588"
        height="636"
        loading="lazy"
      />
    </div>
  </div>
</section>

<section class="ig-reveal">
  <h2>Conclusions</h2>
  <div class="ig-concl">
    <div class="ig-card"><p>Physics-informed constraints give the most accurate gaze model we tested.</p></div>
    <div class="ig-card">
      <p>Adding graph or temporal layers to the PINN increased error variance, which suggests the physics prior alone captures gaze dynamics most cleanly.</p>
    </div>
    <div class="ig-card"><p>The approach is interpretable and data-efficient.</p></div>
    <div class="ig-card"><p>The same signals are a promising substrate for cognitive insight: attention, fatigue, comprehension.</p></div>
  </div>
  <div class="ig-next">
    This poster builds on our earlier work {% cite roumpas_comparative_2025 roumpas_modelling_2026 %}. For the full research line, see
    <a href="{{ '/research/cognitive_modelling/' | relative_url }}">cognitive modelling</a>.
  </div>
</section>

</div>

<script defer src="{{ '/assets/posters/greekchi-cychi-2026/infographic.js' | relative_url }}"></script>
