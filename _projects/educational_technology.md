---
layout: page
title: Educational Technology
description: Adaptive learning, game-based learning, and AI-assisted tools for educators.
img: assets/img/Frame 2.png
importance: 1
category: educational technology
related_publications: true
---

This is where my research meets the classroom. I study and build adaptive learning systems that draw on multimodal data — eye-tracking, EEG, and behavioural signals — to understand what learners actually need, and I design the tools that put those ideas in educators' hands.

Two problems run through the work. The first is a *supply* problem: game-based learning has solid pedagogical evidence behind it, but teachers can't produce it, because the tooling assumes technical skills they were never trained for. The second is a *responsiveness* problem: even good material is delivered identically to every learner, regardless of whether they are coping or struggling. Much of this sits within EU-funded (Erasmus+ and Horizon) projects.

**What's here:** game-based learning design, AI-assisted course creation, multimodal learning analytics, adaptive interfaces, educator training.

---

## CourseCrafter — Authoring Minecraft Education Courses Without Code

Minecraft Education is one of the most widely deployed game-based learning platforms, and one of the least accessible to author for: building a course means dealing with `.mcaddon` packaging, NBT data, and JSON behaviour files. The pedagogical intent is the easy part; translating it into a working world is not. {% cite roumpas_design_2024 %}

I designed CourseCrafter to remove that translation step entirely. Four principles drove the design. The interface should feel familiar to Minecraft users **without requiring Minecraft expertise** — hence the deliberate pixel-art visual language. AI assistance should be **available but never mandatory**, so educators keep authorship. The output should be **complete and immediately usable** — a file that loads straight into the game with no technical follow-up. And the tool should support **partial use**, so a teacher who only wants branching dialogue isn't marched through every module first.

The platform is organised around four modules reached from a central hub: a Dialogue Builder for NPCs and branching conversations (with optional AI drafting of question sequences), an Infrastructure Editor for laying out the world on a 2D grid with a live 3D preview, an Extra Resources module, and a Code Builder that registers MakeCode exercises by reference rather than reimplementing MakeCode. All four feed a single export engine that packages everything into one ready-to-load file.

{% raw %}
<!-- FIGURE SLOT: CourseCrafter interface — the hub, or the Infrastructure Editor's 2D grid with 3D preview.
     (assets/img/course_crafter.png already exists and is used on the HCI page — consider a different view here.)
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

## What Ten Educators Told Us About AI in Their Tools

A design is a hypothesis. I tested this one with **ten practising educators**, recruited internationally by email and through the Minecraft Teachers' Lounge community, spanning different countries, grade levels, and subject areas — continuing until the interview data reached saturation. {% cite roumpas_bridging_2025 %}

The method was deliberately mixed. Participants were randomly assigned one of two user personas (experienced vs inexperienced) by script, worked through an identical scripted authoring scenario on a high-fidelity Figma prototype, then completed the System Usability Scale and an eleven-question semi-structured interview. Features that weren't prototyped — the code builder, external resource loading — were handled with a Wizard of Oz pop-up rather than left as dead ends.

The prototype scored **SUS 71.75**. That number needs its caveat stated plainly: the interviews revealed that most low scores tracked participants' unfamiliarity with Figma's interaction constraints rather than with the design, which is a real limitation of prototype-based usability testing and not something to explain away.

The finding that actually changed the project was about AI. Most participants **did not notice the AI feature at all** — it had been kept deliberately subtle, out of a concern that a prominent AI presence would make educators feel they'd lost control of their own content. That concern turned out to be backwards. Once the feature was explained, every participant supported it, on one condition: the educator has the final word on anything generated. They *expected* AI in a modern authoring tool. The objection was never its presence, only its authority. Several framed the tool's potential role in their workflow as analogous to PowerPoint — something that makes a category of work routine rather than a project.

Three further findings fed directly into the redesign: the help system was present but invisible, drag-and-drop was well received but needed a click-to-place alternative for less confident users, and the export step needed step-by-step guidance rather than a generic instruction set.

{% raw %}
<!-- FIGURE SLOT: study results — SUS score distribution across the ten participants, or a thematic summary of the interview findings.
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

## Adaptive Interfaces That Read the Learner

The other half of this work runs in the opposite direction: instead of helping the teacher produce material, use physiological signals to let the material respond to the learner.

The clearest example is the Eye-tracking Translation Software (ETS), a reading assistant that uses **fixation duration** as a live proxy for cognitive load: when a reader stalls on an unfamiliar word in a foreign-language technical text, it supplies a word-level translation *at that moment* — no lookup, no context switch, no break in the reading flow. {% cite minas_adaptive_2025 %} The design goal is specifically about working memory. A reader of a scientific paper in a second language is already under load, and every manual dictionary trip spends attention that should be going to comprehension. The selectivity is the point: translate everything and you remove the language exposure that makes reading in a second language worth doing.

We evaluated it with **53 participants**, measuring reading speed, fixation duration, and user experience. Gaze-based adaptation improved both reading efficiency and self-reported experience, and reduced cognitive load. The requests that came back were about control rather than concept — pop-up placement, and sentence-level rather than word-level translation for some readers — which points the next version toward adapting to individual proficiency instead of applying one fixation threshold to everyone.

This connects to the broader strand of my work on multimodal learning analytics — eye-tracking metrics (fixation duration and count for visual attention, pupil dilation for load, saccade dynamics for search behaviour, blink rate for fatigue and disengagement), alongside EEG and cardiac measures. The methodological point that keeps recurring is that no single measure is sufficient: each one is sensitive to a different component of load, and each has its own confounds — pupil size in particular responds to luminance and arousal as readily as to effort. Combining measures is not a nicety, it's a requirement.

{% raw %}
<!-- FIGURE SLOT: the eye-tracking translation assistant in use, or a diagram of the multimodal signal pipeline (eye-tracking / EEG / ECG → features → adaptation).
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

The two strands are meant to meet. A tool that lets any teacher author a game-based course, and an adaptive layer that reads whether the resulting course is actually landing, are halves of the same system. Getting there means closing the loop that current work leaves open: taking the physiological signals from a live session and feeding them back into the material, rather than only measuring them afterwards.
