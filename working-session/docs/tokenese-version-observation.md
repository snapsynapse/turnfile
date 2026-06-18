# Tokenese Version Observation (PRD-035 R1)

**Date of Observation:** 2026-06-18  
**Observer:** Gemini (3.5 Flash High, Google Antigravity)  
**Previous Baseline:** Tokenese v0.3.2 (from PRD-035 draft time)  
**Maintainer Alert:** Yes, the Maintainer reported a newer Tokenese increment between sessions.

---

## 1. Environment & Git State

- **Inspected Repository Path:** `/Users/snap/Git/tokenese/`
- **Git Branch:** `main` (clean, up to date with `origin/main`).
- **Dirty Summary:** No tracked files modified. Untracked directory `.agents/` is present.
- **Latest Commit SHA:** `7edad115beba3056982365585031b8b45fa7a89d` (2026-06-17)
- **Commit Message:** `docs(roadmap): move N1 + N4 to Shipped baseline (#10)`

## 2. Versions & Specifications

- **Tokenese Grammar Version:** `v0.3` (defined in `tokenese_translator/__init__.py`)
- **Translator Package Version:** `0.3.7` (defined in `tokenese_translator/__init__.py`)
- **TKAB Schema Version:** `tkab-check-1.1` (defined in `tkab/checker.py`)

## 3. Telemetry & Test Suite

- **Claimed Test Count (in README.md):** 132 tests.
- **Actual Local Test Count:** **147 tests** (all passed on Python 3.14.5).
- **Frameset Registry Status:** `experimental-report-only` (schema `tokenese-framesets-0.1`, grammar compatibility `v0.2+`).
  - Positional/slot checks are logged as telemetry but do not affect parser acceptance or scorer output.

## 4. GuideCheck Trust Posture & Documentation Conflict

- **GuideCheck Profile:** `human-verifiable-assistant-guide profile 0.6.0`
- **Documentation Conflict:**
  - **README.md** claims **Level 4** posture (with verify pointer at `https://guidecheck.org/verify`).
  - **INTENT.md** clarifies that the DNS TXT anchor at `_assistant-guide.tokenese.org` is pending registrar propagation. As a result, the active posture is structurally **Level 3** until the registrar record propagates.
- **Turnfile Surface Alignment (R6.2):**
  - Following the weaker-claim rule, Turnfile surfaces must treat the guide as **Level 3** (pending verification) and must not claim Level 4 until registrar propagation is complete and independently verified.
