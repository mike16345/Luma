# Luma Project Ideas

This document tracks feature ideas for Luma. Ideas may be near-term product work,
future roadmap items, or Expo/React Native package experiments that still fit the
app's grounded quit-tracking purpose.

## How To Use This Document

- Add new ideas when they come up in product or implementation discussions.
- Keep each idea tied to Luma's purpose: private, calm, local-first progress.
- Experimental features are welcome, but avoid ideas that would look random or
  unserious in a Play Store build.
- Use `Status` to show whether an idea is new, planned, in progress, deferred,
  or rejected.
- Expand an idea with more detail once we discuss product behavior, UX, data
  shape, or implementation constraints.

## Grounded Next

### History Chapter Details

Status: in progress

Add a detail view for each chapter in History. It should show start/end time,
duration, estimate metrics, goal context, and slip-up context if the chapter
ended with a logged slip-up. Past chapters remain read-only.

Current slice: chapter detail rows open from History and can show badges unlocked
during that chapter.

### Full Hebrew Translation Pass

Status: in progress

The app has language and RTL infrastructure, but much of the UI copy is still
English. Translate the main flows into Hebrew and verify layout, text alignment,
and button sizing in RTL.

Implementation note: app copy should live in separate readable translation files
under `src/i18n/translations`, with Hebrew stored as actual Hebrew text rather
than unicode escape sequences. Selectors that generate labels should receive the
translator from their feature hooks instead of embedding English strings.

### Better Native Date And Time Inputs

Status: planned

Replace free-form date/time text with more native-feeling input controls where
Expo UI or platform APIs provide a better experience. Keep ISO-safe persistence
and allow practical correction of active chapter dates.

### Profile Basics

Status: in progress

Add a small local profile with display name, optional avatar, language, currency,
and privacy preferences. This should remain local-first and should not introduce
accounts or sync.

Implementation note: use only packages currently installed in `package.json`.
Since `expo-image-picker` is not installed, avatar selection should use an
installed package such as `expo-document-picker` or defer richer image picking
until explicitly approved.

### Privacy Lock

Status: in progress

Use Face ID, fingerprint, or device authentication to protect opening Luma. Add
settings for enabling the lock and possibly a timeout period before requiring
authentication again.

Implementation note: use `expo-local-authentication`, which is already present
in `package.json`. Avoid adding new authentication packages unless explicitly
approved.

### Local Export And Share

Status: in progress

Export chapter history and slip-up summaries as a local file or share sheet item.
Good formats to consider: JSON for backup/import, PDF for readable reports, and
plain text for quick personal sharing.

Current slice: generate a single-chapter PDF report from Chapter Detail with
metrics, badges unlocked during that chapter, optional slip-up context, and a
local-only footer. Use installed Expo packages only: `expo-print` and
`expo-sharing`.

Next/current data slice: add Settings data backup actions. Export creates a
plain JSON backup containing canonical `chapters` and `slipUps`; import validates
the file and replaces the local chapter history rather than merging, to avoid
duplicate IDs and conflicting active chapters.

### Notifications And Reminders

Status: in progress

Add optional notification reminders. Keep them opt-in, quiet, and grounded:
check-ins, goal reminders, or encouragement to review progress. Avoid guilt or
medical claims.

Implementation note: first pass is local daily reminders through
`expo-notifications`, with permission handling, a user-selected check-in time,
and a test reminder from Settings. No push tokens, server delivery, or
background notification tasks are part of this slice.

## Expo And React Native Playground

### `expo-local-authentication`

Status: idea

Use for Face ID, fingerprint, or device credential app lock.

### `expo-image-picker`

Status: deferred

Use for profile avatar selection or a private goal image only if the user
explicitly approves installing it. It is not currently in `package.json`, so the
current profile image flow uses installed packages instead.

### `expo-notifications`

Status: in progress

Use for scheduled check-ins, optional daily reminders, or milestone nudges.

### `expo-file-system` And `expo-sharing`

Status: idea

Use for exporting local history, backups, or reports through the native share
sheet.

### `expo-print`

Status: in progress

Use for generating printable PDF progress reports.

### `expo-mail-composer`

Status: idea

Use for sending an export to yourself without building account sync.

### `expo-document-picker`

Status: idea

Use for importing a local backup file.

### `expo-clipboard`

Status: idea

Use for copying a concise progress summary or debug info.

### `expo-store-review`

Status: idea

Use for a restrained review prompt after meaningful usage. This should never
appear during onboarding or immediately after a slip-up.

### `expo-application`

Status: idea

Use in dev settings for app version, build info, and debugging metadata.

### `expo-haptics`

Status: idea

Use restrained tactile feedback for major actions such as starting a chapter,
logging a slip-up, saving settings, or unlocking dev tools.

### `expo-image`

Status: idea

Use for polished profile/avatar rendering and better image caching behavior.

### `expo-glass-effect`

Status: idea

Explore subtle glass surfaces for modals or privacy panels if it supports the
target platforms cleanly. Keep it restrained and avoid making the app feel like a
tech demo.

## Bigger Future Ideas

### Private Backup And Import

Status: in progress

Allow users to export and later restore their local data. This remains fully
local without accounts. First implementation uses a plain JSON backup from
Settings; encrypted or password-protected backups are deferred.

### Milestone Timeline

Status: in progress

Show a timeline of meaningful chapter moments: start, goal progress, slip-up
logging, restarts, and longest streak changes. Avoid medical recovery milestones.

Current slice: add a derived timeline to Chapter Detail. It shows the chapter
start, badges unlocked during that chapter, goal progress milestones, and the
chapter end or logged slip-up when present. Milestones based on cigarettes,
money, or goal progress are labeled as estimated and are not persisted as
separate records.

### Progress Badges

Status: in progress

Add restrained milestone badges for concrete progress such as money saved,
cigarettes avoided, and chapter duration. Examples: saved a meaningful amount of
money, avoided 100 cigarettes, reached 7 smoke-free days, reached 30 smoke-free
days. Badges should feel calm and credible rather than arcade-like, and should
avoid medical or body-recovery claims.

First slice: derive locked and unlocked badges from existing local metrics, show
code-rendered medallion icons, display progress bars under locked badges, and
format money thresholds in the user's current display currency.

Follow-up slice: add a full all-badges view from Home, keep the Home section as a
compact rail, and show a real check marker on unlocked badge icons.

### Goal Gallery

Status: idea

Let users attach a photo or label to their active savings goal. Keep it private
and local.

### Notification Schedule Settings

Status: idea

Let users choose reminder frequency, quiet hours, and notification types.

### Reasons I Quit

Status: in progress

Add a small private note card for user-authored reasons. This should be
lightweight, not a heavy journaling feature.

Current slice: support one private locally stored reason. Show it as a quiet card
on Home when present, and let the user create, edit, or remove it from Settings.
This stays outside chapter history and does not add accounts, sync, reminders,
or AI-generated prompts.

### Insight Filters

Status: idea

Filter insights by trigger, mood, alcohol involvement, time of day, or chapter.
Keep summaries descriptive rather than interpretive.

### App Lock Timeout Settings

Status: in progress

Let users decide when privacy lock should re-engage, for example immediately,
after one minute, or after five minutes.

Current slice: add a Settings picker for immediately, after one minute, and
after five minutes. Persist the choice locally with the profile preferences and
use it when deciding whether returning from the background should show the lock
screen.

### Home Widgets

Status: idea

Explore whether Expo has a practical route for home screen widgets or equivalent
platform integrations. Only pursue if it can show simple progress without
compromising privacy.

### Watch Companion

Status: deferred

Potential long-term experiment only if the app direction warrants it.
