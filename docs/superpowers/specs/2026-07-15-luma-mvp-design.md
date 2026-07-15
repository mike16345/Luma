# Luma MVP Product Design Spec

Status: Approved product design  
Date: 2026-07-15  
Product: Luma  
Working scope: MVP  

## 1. Purpose of this document

This document defines the approved MVP scope for Luma. It is a product and behavior specification, not a technical implementation plan.

It exists to do four things:

- lock the MVP scope before implementation work begins
- make product rules explicit so calculations and UX stay consistent
- define what the app should and should not do in the first version
- give design, implementation, and review work a single source of truth

This document should be used to answer:

- What is Luma?
- Who is it for?
- What is in the MVP?
- How should core behaviors work?
- How should progress and savings be calculated?
- How should relapse, slip-ups, and history be handled?
- What tone should the product use?
- What is explicitly out of scope?

This document should not be used as:

- a screen-by-screen engineering task list
- a component architecture plan
- a data persistence implementation plan
- a dependency or library decision log

## 2. Product summary

Luma is a calm, private, local-first mobile application for people who have stopped smoking.

Its core purpose is to help users understand what they have reclaimed since quitting, using honest, understandable progress metrics:

- smoke-free time
- cigarettes avoided
- money saved
- longest streak
- cumulative savings across all completed and current chapters
- progress toward one personal savings goal for the current chapter

Luma is not meant to feel childish, preachy, clinical, or heavily gamified. It should feel respectful, quiet, credible, and useful.

## 3. Product philosophy

### 3.1 Honest metrics over comforting fiction

If a user smokes, the current smoke-free chapter ends. The app does not offer a loophole that preserves a streak after smoking.

The product should help users continue, not punish them. But it should not bend the meaning of its own metrics.

### 3.2 Gentle language without ambiguity

The app should avoid shame-based, moralizing, or dramatic language. At the same time, it should not blur what happened.

Bad outcomes for MVP:

- the user feels scolded
- the user feels patronized
- the app becomes vague in order to sound kind

Target tone:

- calm
- respectful
- neutral
- direct
- encouraging without hype

### 3.3 Private and local-first by product stance

The app is positioned as private and local-first. The MVP should avoid features that depend on accounts, social graphs, or cloud services.

This is both a scope decision and a product trust decision.

### 3.4 Estimates must be communicated as estimates

Money saved and cigarettes avoided are helpful directional metrics, but they rely on user-provided inputs and simplifying assumptions.

The app should communicate these as estimates, not exact truths.

### 3.5 Reflection is useful; over-interpretation is not

Luma should help users record patterns around slip-ups, but the MVP should stop short of coaching, diagnosis, or strong causal claims.

The product may summarize patterns. It should not pretend to know more than it does.

## 4. Target user and product fit

### 4.1 Primary user

The primary user is a person who identifies as having stopped smoking and wants a clear, trustworthy view of progress.

They may:

- be in the first hours, days, or weeks after quitting
- care about visible proof of progress
- want calm accountability
- want to understand personal triggers over time
- want a concrete savings target

### 4.2 What the product is not for in MVP

The MVP is not primarily for:

- people who only want smoking reduction coaching
- clinicians or cessation coaches managing other people
- users looking for body recovery/medical guidance
- users seeking social support features inside the app

## 5. MVP scope summary

The MVP includes:

- one active smoke-free chapter at a time
- onboarding to start the first chapter
- home dashboard with core progress metrics
- in-app weekly summary embedded on Home
- one active savings goal per chapter
- chapter history
- slip-up logging with a brief restart flow
- insights based on descriptive summaries of slip-up data
- settings to edit current chapter inputs

The MVP does not include:

- notifications
- reduction-mode coaching
- medical/body claims
- future projections
- custom date ranges
- AI interpretation/advice
- cloud sync or account features
- social/community features

## 6. Core concepts and terminology

### 6.1 Chapter

User-facing term: `chapter`

A chapter is one continuous smoke-free period. A chapter begins at a user-defined quit date/time and ends when the user logs a slip-up involving smoking.

One chapter may be:

- active
- completed

There can be only one active chapter at a time.

### 6.2 Attempt

Internal product/data term: `attempt`

This may be used in system and implementation language, but the primary user-facing term should be `chapter`.

### 6.3 Slip-up

User-facing term: `slip-up`

A slip-up is a logged event indicating that the user smoked. In MVP, a logged slip-up ends the active chapter.

### 6.4 Smoke-free time

Smoke-free time refers to elapsed time since the current chapter start. It is a core headline metric on Home.

### 6.5 Longest streak

Longest streak is the longest smoke-free chapter duration across all completed chapters and the current chapter if the current one is the longest so far.

### 6.6 Cumulative savings

Cumulative savings refers to all-time money saved across all chapters.

### 6.7 Active savings goal

The user may define one goal amount for the current chapter. Goal progress resets when a new chapter starts.

## 7. Primary use cases

### 7.1 Start the app for the first time

The user opens Luma and creates their first chapter by entering:

- quit date/time
- smoking type
- currency
- purchase price
- estimated cigarettes per purchase
- average cigarettes per day
- optional savings goal

They then land on Home and immediately see smoke-free progress.

### 7.2 Check progress during the day

The user opens Luma to answer simple questions:

- How long has it been?
- How much money have I saved?
- How many cigarettes have I avoided?
- How am I doing this week or month?

Home should answer these quickly.

### 7.3 Stay motivated by a concrete target

The user wants their quitting progress tied to something tangible, such as saving for a purchase or milestone.

They set one savings goal and see progress toward it during the current chapter.

### 7.4 Log a slip-up without feeling judged

The user smoked and wants to record it honestly.

They log a slip-up, optionally answer a few questions about what was happening, and are then guided into a brief restart flow.

The current chapter ends, but the app preserves:

- history
- longest streak
- cumulative savings
- slip-up context

### 7.5 Correct inaccurate starting data

The user realizes the quit date/time or smoking-cost inputs were wrong.

They update the active chapter inputs in Settings. The app recalculates the active chapter only.

### 7.6 Review past progress

The user wants to see earlier chapters, how long they lasted, and whether a pattern is emerging.

History should make prior progress visible and meaningful rather than erased.

### 7.7 Reflect on common triggers

The user wants to understand situations that tend to precede smoking.

Insights should summarize the logged slip-up data without overreaching into advice or diagnosis.

## 8. Information architecture

### 8.1 Primary destinations

The recommended primary navigation for MVP is:

- Home
- History
- Insights
- Settings

### 8.2 Secondary destination

- Goal

Goal should be reachable from Home and/or Settings. It does not need to be a permanent top-level navigation item.

### 8.3 Modal or task flows

- Onboarding
- Slip-up log
- Restart chapter flow
- Edit current chapter inputs

### 8.4 IA rationale

This structure separates:

- current progress
- past chapters
- reflective summaries
- editable configuration

without multiplying screens or burying the most important tasks.

## 9. Screen specifications

## 9.1 Onboarding

### Purpose

Start the first chapter with enough information to produce trustworthy estimates.

### Required inputs

- quit date
- quit time, defaulted to current time
- smoking type: packs or roll-your-own
- currency
- purchase price
- estimated cigarettes per purchase
- average cigarettes smoked per day

### Optional input

- savings goal amount

### Behavior rules

- quit date/time defaults to the current date/time
- the user may adjust the date/time before saving
- the entered smoking profile becomes the starting snapshot for the chapter
- onboarding should be concise and not feel like a survey

### Validation philosophy

- accept practical estimates
- do not force high precision
- avoid medical or emotional questioning during onboarding

## 9.2 Home

### Purpose

Provide the current state of progress at a glance.

### Core content

- smoke-free time
- cigarettes avoided
- money saved
- progress by period:
  - today
  - this week
  - this month
  - this year
  - all time
- weekly summary section
- longest streak
- cumulative all-time savings
- current goal progress

### Primary actions

- Log slip-up
- View goal
- Edit current chapter

### Home content priorities

Home should answer these first:

1. How long has it been?
2. What have I avoided?
3. What have I saved?
4. How am I doing this week/month/year?

Everything else should support those answers, not compete with them.

### Weekly summary

The weekly summary is an embedded section on Home, not a separate screen.

It may summarize:

- money saved this week
- cigarettes avoided this week
- smoke-free time milestone context for the week

It should not introduce medical claims or speculative coaching.

## 9.3 Slip-up log

### Purpose

Allow honest recording of smoking events while preserving a calm tone.

### Fields

All of the following are optional except the act of logging the slip-up itself:

- when it happened
- mood
- trigger
- alcohol involved: yes/no
- optional note

### Behavior rules

- submitting a slip-up ends the current chapter
- the app should use neutral language
- after submission, the app immediately offers restart
- the app should not present a “keep streak anyway” option

### Product reasoning

This preserves the integrity of smoke-free metrics while still supporting self-understanding.

## 9.4 Restart chapter flow

### Purpose

Move the user smoothly from a completed chapter into a new active chapter.

### Behavior rules

- open immediately after a slip-up is logged
- default the new quit date/time to now
- allow the user to adjust date/time
- keep the flow brief
- start the new chapter with fresh goal progress

### If user does not restart immediately

- the previous chapter remains completed
- there may be no active chapter state
- Home should then show a calm empty state inviting the user to begin a new chapter

## 9.5 History

### Purpose

Preserve continuity and show that prior progress still matters.

### Core content

- list of completed chapters
- start date/time
- end date/time
- chapter duration
- indication that a chapter ended with a logged slip-up
- access to chapter details

### Rules

- past chapters are read-only
- past chapter metrics do not recalculate
- history should support, not shame

### Additional context

History should also make visible:

- longest streak
- total number of chapters
- cumulative savings context if helpful

## 9.6 Goal

### Purpose

Provide one concrete motivational target for the active chapter.

### Behavior rules

- one active goal per chapter
- goal is optional
- if no goal exists, show a prompt to create one
- goal progress is based on current chapter money saved
- when a chapter ends, that chapter’s goal progress ends with it

### Philosophy

The goal should reinforce quitting, not reduction.

Good framing:

- “You have saved X toward your goal”

Avoid:

- “Smoke X fewer cigarettes to reach your goal”

## 9.7 Insights

### Purpose

Help the user notice recurring patterns around slip-ups without crossing into over-interpretation.

### Included MVP summaries

- most common triggers
- most common moods
- alcohol involvement counts
- optional time-of-day summaries
- optional day-of-week summaries
- recent slip-up notes

### Explicit limits

Insights should be descriptive, not interpretive.

Allowed:

- “Most common trigger”
- “Alcohol was involved in 3 of 7 logged slip-ups”

Not allowed in MVP:

- “Alcohol is your biggest problem”
- “You are likely to slip on weekends”
- “Avoid social settings”

### Empty state

If the user has no slip-up history yet, Insights should explain that summaries will appear once enough data has been logged.

## 9.8 Settings

### Purpose

Allow correction of current chapter inputs without corrupting past chapters.

### Editable items

- current chapter quit date/time
- smoking type
- currency
- purchase price
- estimated cigarettes per purchase
- average cigarettes per day
- goal setup/update/removal as appropriate

### Rules

- editing current chapter inputs recalculates the current chapter only
- editing current chapter inputs never rewrites past chapters

## 10. Calculation rules

## 10.1 User input model

The app supports two smoking-cost models:

### Packs

- price per pack
- cigarettes per pack

### Roll-your-own

- price per pouch/bag
- estimated cigarettes yielded from that purchase

Both models feed the same underlying estimate model.

## 10.2 Cost per cigarette

Cost per cigarette is calculated as:

`cost per cigarette = purchase price / estimated cigarettes per purchase`

This applies to both packs and roll-your-own.

## 10.3 Smoking rate

Average cigarettes per day is user-provided.

For time-based calculations, the app derives a proportional consumption rate from that daily value.

Conceptually:

`cigarettes per hour = average cigarettes per day / 24`

## 10.4 Cigarettes avoided

Cigarettes avoided is estimated from:

- elapsed smoke-free time in the relevant period
- average cigarettes per day

Conceptually:

`cigarettes avoided = elapsed time × estimated smoking rate`

The product should keep sufficient precision internally for consistent rollups, but display values in user-friendly form.

### Display principle

- headline values should feel simple and readable
- the app should not imply impossible precision
- values may be rounded for display while retaining consistent internal calculations

## 10.5 Money saved

Money saved is calculated as:

`money saved = cigarettes avoided × cost per cigarette`

Money saved should always be communicated as an estimate.

## 10.6 Progress periods

The MVP supports:

- today
- this week
- this month
- this year
- all time

The product does not support custom date ranges in MVP.

### Period semantics

Each period should reflect the portion of the current chapter and/or historical activity that falls within that period.

The exact implementation mechanics are an engineering concern, but the product behavior should feel calendar-based and intuitive.

## 10.7 Goal progress

Goal progress is based on current chapter money saved only.

Conceptually:

`goal progress = current chapter money saved / current chapter goal amount`

If there is no active goal, progress should not be shown as zero; instead the product should invite the user to create a goal.

## 10.8 Longest streak

Longest streak is the maximum duration of any chapter, including the active chapter if applicable.

## 10.9 Cumulative savings

Cumulative savings is the sum of money saved across all chapters.

This exists alongside, not instead of, chapter-based goal progress.

## 10.10 Currency handling

Currency is selected by the user.

For MVP:

- currency is treated as the user’s display and calculation context
- the app does not perform historical currency conversion
- the app does not normalize across exchange rates

If a user changes currency later, the MVP should treat the new value as the current configuration context rather than attempting historical financial accuracy across currencies.

## 11. State and history rules

## 11.1 Active versus completed chapters

There may be:

- one active chapter
- zero or more completed chapters

## 11.2 Past chapter immutability

Past chapters are immutable in MVP.

That means:

- past dates do not change
- past metrics do not recalculate
- past smoking-profile snapshots do not change
- past slip-up records do not change through ordinary settings edits

## 11.3 Current chapter mutability

The current chapter may be corrected.

This includes:

- quit date/time
- smoking-cost profile
- average cigarettes per day
- goal amount

These edits recalculate the active chapter only.

## 11.4 Why current chapter edits are allowed

The product accepts that users may:

- forget their actual quit date
- misremember pack price
- estimate differently after reflection

MVP favors practical correction over rigid data purity inside the active chapter.

## 11.5 Why past chapters do not update

Once a chapter ends, it becomes part of the user’s history.

The product promise is that history remains stable. What happened in the past stays in the past.

## 11.6 Slip-up consequences

In MVP, logging a slip-up means:

- the active chapter ends
- its final metrics are preserved
- the app offers a restart flow
- the user may create a new chapter immediately or later

## 12. Edge cases and empty states

## 12.1 No active chapter

Possible after a slip-up if the user does not restart immediately.

Expected behavior:

- Home shows a calm empty state
- the app invites the user to start a new chapter
- history, longest streak, and cumulative savings remain visible where appropriate

## 12.2 No goal set

Expected behavior:

- money saved still appears on Home
- Goal prompts the user to create one
- onboarding does not require a goal

## 12.3 No slip-up data yet

Expected behavior:

- Insights shows a clear empty state
- the app does not fabricate patterns

## 12.4 User unsure about roll-your-own yield

Expected behavior:

- accept an estimate
- explain implicitly or explicitly that money outputs depend on that estimate
- do not force a grams-based calculation

## 12.5 User forgot quit date/time

Expected behavior:

- default onboarding and restart to now
- allow later correction for the active chapter

## 12.6 User edits only the date, not the time

Expected behavior:

- keep the existing/default time rather than forcing an unknown state

## 13. Tone, copy, and content guidelines

## 13.1 Preferred language

Preferred user-facing language:

- chapter
- smoke-free time
- slip-up
- money saved
- cigarettes avoided
- longest streak

## 13.2 Neutral language for chapter endings

Preferred wording patterns:

- “This chapter ended”
- “You can start a new chapter now”
- “Log a slip-up”

Avoid:

- “You failed”
- “You broke your streak”
- “You cheated”
- “You relapsed again”
- “Start over from zero” as a shaming phrase

## 13.3 Tone constraints

The product should not sound:

- childish
- preachy
- clinical
- over-gamified
- euphoric

The product should sound:

- steady
- humane
- grounded
- credible

## 13.4 Estimate language

Money saved and cigarettes avoided should be labeled or framed as estimates in a way that is visible but not noisy.

The product should not present these metrics as medically precise or financially exact.

## 14. Explicit MVP non-goals

The following are explicitly out of scope for MVP:

- push notifications or reminder scheduling
- reduction coaching
- preserving a chapter after smoking
- medical recovery claims
- body metrics or physiology claims
- “grams of tobacco avoided” or similar body-adjacent calculations
- future savings projections such as 7-day, 30-day, or 1-year forecasts
- custom date-range analysis
- AI-generated advice
- predictive trigger warnings
- causal interpretations of slip-ups
- account creation
- cloud sync
- social sharing
- community features
- coach/clinician dashboards
- multi-user profiles
- grams-based roll-your-own modeling
- separate paper/filter cost modeling
- heavy journaling features

## 15. Future directions intentionally deferred

These are not MVP commitments, but they are preserved as plausible future directions:

- push notifications
- reflective reminders
- deeper trend analysis
- more advanced pattern summaries
- intra-chapter cost/rate change events
- more flexible goal systems
- cloud sync/export
- privacy-preserving backup options

These should not influence the MVP architecture or UX scope in a way that complicates the first release.

## 16. Acceptance summary for MVP definition

The MVP should be considered correctly defined if it preserves all of the following:

- one active chapter at a time
- any smoked cigarette ends the chapter
- slip-up logging stays calm and non-punitive
- smoke-free time, cigarettes avoided, and money saved are central
- money and cigarette outputs are communicated as estimates
- goal progress is chapter-specific
- cumulative savings persists across chapters
- longest streak is visible and meaningful
- past chapters remain immutable
- current chapter can be corrected
- insights summarize slip-up data without pretending to diagnose or coach
- the product stays small, private, and credible

## 17. Final scope statement

Luma MVP is a chapter-based quit tracker for people who have stopped smoking.

It helps them see honest progress, preserve history, save toward a personal goal, and record slip-up context for later reflection.

It is intentionally not a medical app, not a reduction-coaching app, not a social product, and not a prediction engine.

Its value comes from calm clarity, trustworthy rules, and restrained scope.
