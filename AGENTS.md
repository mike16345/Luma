# AGENTS.md

## 1. Required reading before making changes

Every agent must read these files before changing code:

- [docs/superpowers/specs/2026-07-15-luma-mvp-design.md](C:/Users/micha/Desktop/Luma/docs/superpowers/specs/2026-07-15-luma-mvp-design.md)
- [docs/superpowers/plans/2026-07-15-luma-mvp-implementation-plan.md](C:/Users/micha/Desktop/Luma/docs/superpowers/plans/2026-07-15-luma-mvp-implementation-plan.md) once it exists
- [AGENTS.md](C:/Users/micha/Desktop/Luma/AGENTS.md)

If a task would change the product contract, stop and update the spec first.

If a task would change implementation sequencing or architecture boundaries, update the implementation plan before changing code.

## 2. External docs to consult

When an agent needs current Expo guidance, use Context7 before making stack-sensitive changes.

Preferred Context7 doc targets:

- `/websites/expo_dev`
- `/websites/expo_dev_versions`

Use these for:

- current Expo SDK baseline
- `create-expo-app` commands
- `expo install` compatibility rules
- Expo Router conventions
- `expo-sqlite`, `expo-sqlite/localStorage`, and `expo-secure-store`
- Expo testing guidance

Do not guess current Expo package compatibility.

## 3. Repository philosophy

- This repository is an Expo-first mobile app.
- Prefer Expo-managed packages and official Expo patterns over third-party abstractions when Expo already provides a solid solution.
- Keep the app local-first. The canonical data model lives on-device.
- Keep product behavior honest. Do not add loopholes that weaken smoke-free metrics.
- Keep scope restrained. This MVP is not a medical app, not a reduction-coaching app, not a prediction engine, and not a social product.

## 4. Product rules that must not drift

- There is only one active chapter at a time.
- Any smoked cigarette ends the current chapter.
- A logged slip-up closes the chapter, then offers a brief restart flow.
- Past chapters are immutable.
- Current chapter inputs may be corrected, and only the current chapter recalculates.
- Core metrics are smoke-free time, cigarettes avoided, and money saved.
- Money saved and cigarettes avoided must be communicated as estimates.
- Supported progress periods are today, this week, this month, this year, and all time.
- One active savings goal exists per chapter.
- Goal progress resets with a new chapter.
- Cumulative savings persists across chapters.
- User-facing language should prefer `chapter`, `slip-up`, and `smoke-free time`.
- Do not introduce medical or body-recovery claims.

## 5. Approved stack baseline

Use this stack unless the spec and plan are intentionally updated:

- Expo SDK 57 as the project baseline
- `create-expo-app` standard TypeScript template
- Expo Router for navigation
- TypeScript with strict mode enabled
- `expo-sqlite` for canonical domain data and migrations
- `expo-sqlite/localStorage/install` only for tiny non-sensitive preferences when key-value storage is sufficient
- `expo-secure-store` only if the app later introduces genuinely sensitive values
- `react-native-safe-area-context` for safe area handling
- `react-native-reanimated` for motion already supported by Expo
- `react-native-gesture-handler` where native gestures are needed
- `expo-haptics` only for restrained, intentional feedback
- `jest-expo` and `@testing-library/react-native` for tests
- Expo Router testing utilities such as `renderRouter` for route-level tests

Package rules:

- Use `npx create-expo-app@latest ... --template default@sdk-57` when scaffolding or recreating the app baseline.
- Use `npx expo install` for Expo-managed or native dependencies.
- Do not implement features that require packages absent from `package.json` unless the user explicitly approves installing the package. Prefer building with the native packages already present in the current development build to avoid forcing new dev builds for every experiment.
- Do not use plain `npm install` for Expo SDK packages unless there is a specific reason and it is documented in the plan.
- Do not introduce AsyncStorage.

## 6. Architecture rules

### Route structure

- The `app/` directory is for routes and route layouts only.
- Do not place business logic, reusable components, data access, or tests inside `app/`.
- Route files should stay thin and compose feature modules from `src/`.

### Source layout

Unless the plan is intentionally revised, organize source like this:

- `src/components/ui` for shared UI primitives
- `src/features/<feature>` for feature-specific components, hooks, selectors, and helpers
- `src/db` for database client, schema, migrations, and repositories
- `src/lib` for domain calculations, formatting, dates, and storage adapters
- `src/theme` for tokens and theme helpers
- `src/types` for shared domain types
- `src/test` for shared test utilities

### Data boundaries

- SQLite is the source of truth for chapters and slip-ups.
- Repositories own SQL access. Screens and UI components must not execute SQL directly.
- If simple key-value storage is needed, wrap it in a typed storage module. Do not scatter raw `globalThis.localStorage` calls through screens.
- Keep calculations pure and isolated from UI and persistence.

### State boundaries

- Start with React state, hooks, and repository-backed selectors.
- Do not add Zustand, Redux, TanStack Query, or another global abstraction unless the app has a demonstrated need for it and the plan is updated first.
- This app has no server-state requirement in the MVP. Do not add a server-state stack preemptively.
- Repository-backed feature screens should follow the established page pattern: a feature service loads repository data, a selector builds a UI-safe view model, a `use-<feature>-view-model` hook owns loading/error/refresh state, and the route file only renders the feature screen.
- For a single screen flow, instantiate the feature hook once at the screen boundary and pass state/actions into child forms. Do not create a second copy of the same flow hook inside the form component.

## 7. UI and UX rules

- The app should feel calm, private, credible, and non-punitive.
- Avoid celebratory or gamified language that undermines tone.
- Avoid shame-based language such as `failed`, `cheated`, or `broke your streak`.
- Prefer concise copy and explicit labels.
- Keep Home focused on the three primary metrics first.
- Weekly summary belongs on Home, not in a separate screen.
- Insights are descriptive, not interpretive. Do not add coaching or causal claims.
- Use `@expo/ui` where native controls provide a clear product or platform benefit, especially for input controls, platform-native affordances, and future form-heavy flows.
- When using `@expo/ui` Jetpack Compose-backed components on Android, each Compose component such as `Button` or `OutlinedButton` must render as a direct child of a `Host`. Do not put a React Native `View` or other non-Compose wrapper between `Host` and the Expo UI component; for grouped controls, wrap each Expo UI control in its own `Host` or use Expo UI layout components.
- Use Expo UI modifiers for native Expo UI layout and presentation. Do not size or decorate Expo UI controls with React Native `style` props when a platform modifier exists. Prefer Jetpack Compose modifiers such as `fillMaxWidth()`/`width(...)` on Android and SwiftUI modifiers such as `frame(...)`/`buttonStyle(...)`/`controlSize(...)` on iOS.
- Do not pass percentage strings such as `width: "100%"` to `@expo/ui` native component styles. Jetpack Compose-backed props may expect numeric records and can crash when given strings. Use Expo UI modifiers or React Native wrappers outside the `Host` boundary.
- Components that are intentionally Expo UI wrappers should not silently fall back to React Native controls. Use platform-specific Expo UI files for iOS and Android, and use the universal `@expo/ui` export for default or web fallback behavior unless there is an explicit product reason to do otherwise.
- Prefer shared React Native components when behavior and presentation are meaningfully identical across iOS, Android, and web.
- Split platform-specific components when native behavior, accessibility, layout conventions, or `@expo/ui` APIs diverge enough that a shared abstraction would hide important platform differences.
- Keep platform-specific files focused and explicit, for example `component.ios.tsx`, `component.android.tsx`, or a named specialized component when the distinction is product-level rather than operating-system-level.

## 8. Coding conventions

- Use TypeScript strict mode.
- Use PascalCase for React components and types.
- Use camelCase for functions, variables, selectors, and helpers.
- Use kebab-case for file names.
- Keep one primary responsibility per file.
- Prefer small, focused files over large orchestration files.
- Feature screens should stay as orchestration files. Do not place a screen's full component tree in one large file; split repeated or substantial sections into focused feature components. Prefer one primary component per file, with a maximum of two closely related components only when it keeps the file clearer.
- Use path aliases once configured; avoid deep relative import chains.
- Prefer guard clauses over deep nesting.
- Keep React route files thin and move logic into feature modules.
- Prefer Expo and React Native primitives over web assumptions.
- Do not use DOM APIs, CSS files, `className`, or browser-only layout assumptions in native code.
- Use the theme provider for app colors. New UI should read colors through `useThemeColors`/`useTheme` when it needs reactive theme values, and shared theme tokens should support both light and dark palettes.
- Use the i18n/language provider for language, text direction, and RTL-aware alignment. Keep reusable translation metadata under `src/i18n`; do not scatter raw language preference storage, `I18nManager` calls, or direction-switch reload logic through feature screens.
- React Native RTL direction changes require an app reload to fully apply on native platforms. Language changes may update text immediately, but LTR/RTL switching should persist the preference, update `I18nManager`, and let the centralized provider handle reload behavior.
- Developer-only UI must be gated with `__DEV__`, hidden behind an intentional unlock interaction, and kept out of production-facing product flows. Dev tools may use local preferences for non-sensitive debugging state, but they must not introduce accounts, sync, or user-visible product concepts.

## 9. Navigation rules

- Use Expo Router as the only navigation layer.
- Root layout should own bootstrap and top-level stacks.
- Tab layout should own the main destinations: Home, History, Insights, Settings.
- Goal should be a secondary screen, not a permanent top-level tab unless the spec changes.
- Slip-up logging and restart should be modal/task flows, not tabs.

## 10. Storage and persistence rules

- Canonical chapter history belongs in SQLite tables, not ad-hoc JSON blobs.
- Keep persistence schemas explicit and migration-backed.
- Store money in minor units where possible to avoid float drift.
- Keep timestamps ISO-based and timezone-safe.
- Persist only what the product contract actually needs.
- Do not add speculative tables or sync metadata for future features.

## 11. Testing rules

- Keep tests outside the `app/` directory so Expo Router does not treat them as routes.
- Use `jest-expo` as the base preset.
- Use `@testing-library/react-native` for component and route tests.
- Use Expo Router `renderRouter` utilities for routing behavior.
- Put deterministic product rules under unit tests first:
  - chapter ending
  - cigarettes avoided
  - money saved
  - longest streak
  - cumulative savings
  - progress period rollups
- New features should add or update tests in the same change.

## 12. Anti-patterns for this repo

- Do not introduce AsyncStorage.
- Do not put reusable components in `app/`.
- Do not run SQL in screens.
- Do not bury business rules in JSX.
- Do not add reduction coaching to this MVP.
- Do not add medical/body-stat claims to this MVP.
- Do not add cloud sync, accounts, or community features unless the spec changes.
- Do not add extra state-management libraries just because they are familiar.
- Do not install Expo-native packages with version numbers guessed by hand when `npx expo install` can resolve them.

## 13. Agent operating rules

- Treat this file as a living repository contract.
- When discussing project ideas, future features, package experiments, or roadmap options, update [docs/project-ideas.md](C:/Users/micha/Desktop/Luma/docs/project-ideas.md) in the same change. Add a short description at minimum, and expand it when product behavior, UX, data shape, or implementation constraints become clearer.
- When a rule becomes real through repeated implementation, add it here.
- When a reusable implementation pattern emerges during development, update this file in the same change so future agents and developers inherit the decision.
- When a rule stops being true because of an intentional architecture change, update this file in the same change.
- Prefer targeted patches over broad rewrites.
- If the nearest code and the plan disagree, follow the plan and update the code incrementally.
- If the code, plan, and spec disagree, stop and resolve the conflict explicitly instead of guessing.

## 14. Temporary local-machine workflow constraints

Unless told otherwise:

- Do not write a test for every feature while this temporary constraint is active.
- Do not run broad post-implementation validation suites after each small change or phase.
- Prefer lightweight, targeted checks only when they are needed to unblock the next step.
- Keep phase work small because this project is currently being developed on an 8 GB memory machine.
