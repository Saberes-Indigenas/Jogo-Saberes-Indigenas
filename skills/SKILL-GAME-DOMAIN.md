---
name: jogo-saberes-indigenas-domain
description: Domain knowledge and architecture conventions specific to the Jogo Saberes Indígenas project (Bororo/Bóe culture game, clan data model, Zustand store slices, sound system, asset pipeline). Use alongside SKILL-REACT/SKILL-TYPESCRIPT/SKILL-CSS/SKILL-TAILWIND/SKILL-UI/SKILL-UX for any change that touches game data, game logic, or the play experience.
---

# Jogo Saberes Indígenas — Domain & Architecture

You are contributing to an educational drag-and-drop game that teaches the clan
system of the Bororo (Bóe) people to indigenous children. The game is not a
generic template — every design and data decision must respect the cultural
source material in `documentation/`. Apply this skill together with the
generic React/TypeScript/CSS/Tailwind/UI/UX skills, never instead of them.

## Game Proposal

- Core loop: children drag animal/bird/fish/snake items onto the correct
  **clan** target (an "oca"/hut on the `bororo-stage`). Correct drops award
  urucum seeds and, on streaks, feathers (`FEATHER_STREAK_REQUIREMENT` in
  `src/config/gameSession.ts`).
- The game is organized in rounds (`DEFAULT_MAX_ROUNDS`, batches of
  `TAMANHO_LOTE` items per round from `src/config/layoutConstants.ts`).
- Content teaches real Bóe ethnotaxonomy: every clan groups animals under
  Bóe-language categories (`KIEGE` = birds, `BAREGE` = animals, `KARE` =
  fish, `AWAGE` = snakes). Each item carries both its Bóe name (`name_boe`)
  and Portuguese name (`name`) — never show one without making the other
  discoverable, since bilingual reinforcement is the pedagogical point.
- Clans belong to the two Bororo moieties, encoded as color, not as a
  separate field: red (`#b52323`, `COLORS.CLAN_TUGOAREGE`) for
  Aroroe/Iwagududoge/Apiborege/Paiwoe, black (`#000000`,
  `COLORS.CLAN_ECERAE`) for Bakoro Ecerae/Bokodori Ecerae/Kie/Badojeba. Keep
  new clans mapped to the correct moiety color — it is cultural information,
  not decoration.

## Source of Truth for Content

- `documentation/animals.md` (APÊNDICE 4, a real school field-research
  document with named informants) is the **only** authoritative source for
  clan/animal/name data. Never invent or "improve" a Bóe name, a Portuguese
  gloss, or a clan assignment — if something is ambiguous or missing in the
  source document, ask the user rather than guessing.
- Content flows one direction: `documentation/animals.md` → hardcoded `data`
  list in `gerar-json.py` → `public/game-data.json` (consumed at runtime).
  Do not hand-edit `public/game-data.json` for content changes that should
  exist in the source list — edit `gerar-json.py`'s `data` array and
  regenerate (`python gerar-json.py`), so the JSON stays reproducible.
- `gerar-json.py` matches each `Clan_Name/BoeClean_PortClean.webp` file in
  `src/assets/clans/<CLAN_NAME>/` against the hardcoded entries to recover
  accented/spaced display names and build `item_<port_id>_<clan_id_suffix>`
  IDs. When adding an animal, add both the `.webp` asset (correct filename
  convention) and the source-document entry — a mismatch silently falls back
  to an ugly camelCase-split name instead of the real one.
- Missing illustrations fall back to `/animals/animal_generico.webp`
  (`GENERIC_IMAGE` in `gerar-json.py`) — don't leave `image` empty instead.

## Data Model (`src/types.ts`)

- `Clan { id, name, name_boe? }` — `id` is always `clan_<clan_id_suffix>`.
- `Item { id, name, name_boe, icon, correct_clan_id, color, clan, media?, fact? }`
  — `color` must match the item's clan moiety color; `correct_clan_id` must
  reference an existing `Clan.id`.
- Keep `GameData { clans, items }` as the runtime shape consumed from
  `public/game-data.json`; don't add fields to these interfaces without
  updating both `gerar-json.py`'s emitted shape and this file together.

## State Architecture (Zustand)

- Store is split into three slices combined in `src/store/useGameStore.ts`:
  `CoreSlice` (session/score/round progress, `src/store/coreSlice.ts`),
  `UiSlice` (transient feedback/messages/celebrations,
  `src/store/uiSlice.ts`), `DragDropSlice` (inventories, drag state,
  offerings, `src/store/dragDropSlice.ts`). Put new state in the slice that
  matches its lifecycle — don't grow one slice to cover another's concern.
- Slice creators are typed via `GameStoreCreator<T>` (a `StateCreator` bound
  to the full `GameStore`) in `src/store/types.ts`. Add new slice state/
  actions to that file's interfaces first, then implement in the slice.
- `useGameLogic.ts` is the only place that seeds the store from loaded game
  data/layout — don't call `setGameData`/`initGameSession` from components.
- The custom `set` in `useGameStore.ts` logs and traces whenever
  `isGameOver` flips back to `false` unexpectedly — this is a guard against a
  known class of bug (accidental state resets); don't remove it, and if you
  see that warning fire, treat it as a real bug, not noise.

## Session Economy (`src/config/gameSession.ts`)

- Feather capacity and urucum seed totals are pure functions of total
  deliveries (`getFeatherCapacity`, `calculateMaxUrucumSeeds`), not stored
  counters recomputed ad hoc — when changing reward balance, change the
  constants (`FEATHER_STREAK_REQUIREMENT`, `URUCUM_SEED_BASE_REWARD`,
  `FEATHER_REWARD_MULTIPLIER`) here, not scattered arithmetic in components.

## Sound System (`src/utils/soundManager.ts`)

- `soundManager` is a singleton class instance (already instantiated at
  module scope) — import and call it directly, don't instantiate `SoundManager`
  again.
- Every effect (`click`, `dragStart`, `dragEnd`, `success`, `error`,
  `feather`, `roundComplete`, `gameOver`) is synthesized live via the Web
  Audio API (`synth*` methods) — there are no bundled sound files for these,
  only `ambient` is a real Howler-loaded MP3. If you add a new sound type,
  add both a `synth*` fallback and wire it through `playSound`, matching the
  existing pattern; don't assume an asset file will be provided.
- Mute state and volume persist to `localStorage`
  (`jogo_saberes_muted`, `jogo_saberes_volume`) and drive `Howler.volume`
  globally — respect these keys rather than introducing new ones.
- Ambient audio only starts after a user gesture (`click`/`touchstart`
  listener) per browser autoplay policy — don't call `startAmbient()` on
  mount.

## Conventions Observed in This Codebase

- Files: kebab-case (`bororo-stage.tsx`, `clan-info-bubble.tsx`); CSS lives
  parallel in `src/css/<PascalComponentName>.css`, one file per component,
  imported by that component only.
- Stack: React 19 + TypeScript + Vite, Zustand for state, `@dnd-kit/core`
  and native HTML5 drag events (see `DragDropSlice`) for drag-and-drop,
  Konva/`react-konva` available for canvas-drawn scenery, Framer Motion for
  DOM-level animation, Howler for audio. Tailwind v4 (CSS-first `@theme`,
  no `tailwind.config.js`) per `SKILL-TAILWIND.md` — prefer it for new UI;
  existing component CSS files are not being migrated wholesale, don't
  rewrite them incidentally while fixing something else.
- Primary language of UI copy, comments, and commit-adjacent docs in this
  project is Portuguese (pt-BR) — match that for anything user-facing or
  code-adjacent in this repo, even though this skill file (like the other
  `SKILL-*.md` files) is in English.
- Audience is young children on shared/school hardware: keep interactive
  targets large (≥44×44px per `SKILL-UI.md`), avoid relying on
  fine-motor precision drag gestures, and keep feedback (sound + visual
  pulse) multi-modal — see `feedback-pulse.tsx` and `useGameStore`'s
  `feedbackPulse` state for the established pattern.
