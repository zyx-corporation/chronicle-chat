# ADR-0001: Loop Engineering Constitution for Chronicle Chat

Status: Proposed

Date: 2026-06-22

Author: Tomoyuki Kano

## Context

Chronicle Chat is not intended to be a conventional LLM chat UI. Its purpose is to turn conversations with AI into a traceable stream of decisions, suspensions, contested interpretations, and meaning changes. This requires a different engineering posture from ordinary prompt engineering or simple RAG-based chat.

In a single-turn prompt, a bad output can often be corrected by the next instruction. In a loop, however, the initial purpose, evaluation criteria, authority boundaries, memory policy, and stop conditions shape the entire recursive process. A poorly specified loop can amplify errors, silently resolve suspended questions, or convert tentative interpretations into false certainty.

Therefore, Chronicle Chat must treat initial prompts and design documents as a loop constitution. The constitution defines what the system must preserve, what it may transform, where it must stop, and how it must record meaning changes.

This ADR establishes the initial engineering policy for building Chronicle Chat as a loop-based Meaning Operating System component under the broader Resonance Architecture.

## Decision

We will build Chronicle Chat as a loop-engineered system whose core is a Meaning Event Ledger and whose runtime behavior is governed by explicit loop prompts, testable RDE criteria, and human review boundaries.

The first implementation will be a generic WebUI Chat-based MVP. Domain-specific variants will come later only after the general-purpose meaning loop is validated.

The system will be designed around these core concepts:

- conversation as a Meaning Event Stream;
- prompt as Loop Constitution;
- meaning events as ledger entries;
- accepted, rejected, suspended, and contested as first-class states;
- T-RDE as a testable meaning-deviation evaluation discipline;
- TDD and test-first development for implementation;
- issue-driven roadmap and issue-sized implementation branches;
- small, cohesive modules rather than large monolithic modules;
- i18n from the beginning, with Japanese and English treated as first-class languages.

## Terminology

### Resonance Architecture

The top-level architecture for systems that observe meaning, reception, resonance, and meaning change instead of only retrieving knowledge.

### MOS: Meaning Operating System

The operating layer that coordinates Experience, Meaning, Chronicle, ΔM, and RDE flows.

### Chronicle Chat

A chat interface that records the history of meaning formation. It is not only a Q&A UI, but a loop that extracts, evaluates, preserves, suspends, and audits meaning events.

### Meaning Event

A structured event describing a meaningful change or interpretation in a conversation. It should include claim, evidence, confidence, importance, state, and audit notes.

### T-RDE

T-RDE means Testable Resonant Deviation Evaluation in this project. It converts RDE checks into explicit, testable criteria. A T-RDE check must identify preserved elements, transformed elements, supplemented elements, unresolved elements, deviation risks, and the next update policy.

### ΔM

ΔM means meaning change. In Chronicle Chat, ΔM is not merely a semantic diff of words. It is a structured change in intention, interpretation, value, context, or decision state.

## Architectural Direction

The initial architecture will be layered.

```text
WebUI Chat
  ↓
Loop Hook / Pipeline
  ↓
Chronicle API
  ↓
Meaning Event Ledger
  ↓
LLM Workers
  ↓
T-RDE Auditor
  ↓
Human Review Boundary
  ↓
Recursive Update
```

The first version may use Open WebUI or a compatible WebUI Chat as the interaction surface. Chronicle Chat must remain loosely coupled to the UI so that it can later be embedded into other chat interfaces.

## Loop Runtime

Each chat turn may trigger a loop. The loop must remain lightweight and should not interrupt the user unless uncertainty, importance, or value conflict crosses a review threshold.

Minimum loop stages:

1. Response Loop: generate or receive the normal assistant response.
2. Experience Extraction Loop: extract the user experience, reaction, decision, question, or hesitation.
3. Meaning Synthesis Loop: generate meaning candidates and ΔM candidates.
4. T-RDE Audit Loop: evaluate preservation, transformation, supplementation, unresolved items, and deviation risks.
5. Chronicle Update Loop: write accepted, rejected, suspended, or contested records to the ledger.

## Human Review Policy

Chronicle Chat must not require human confirmation for every event. That would make the system unusable. Human review is required only when the routing score indicates meaningful risk.

Review routing is based on:

- uncertainty;
- importance;
- value conflict;
- irreversible action risk;
- user-declared sensitivity;
- deviation from prior accepted intent.

The system must always preserve the human right to suspend judgment. `suspended` is not an error state. It is a valid and valuable state.

Meaning event states:

- `accepted`: adopted as current working interpretation;
- `rejected`: explicitly rejected;
- `suspended`: judgment intentionally deferred;
- `contested`: multiple interpretations coexist.

## T-RDE Policy

Every non-trivial meaning event should be auditable with T-RDE.

A T-RDE record should contain:

- preserved elements: original intent, value, constraints, or design philosophy retained;
- transformed elements: implementation, expression, structure, or process changed;
- supplemented elements: missing tests, documents, examples, or operational rules added;
- unresolved elements: unknowns, assumptions, suspended questions, or unverified hypotheses;
- deviation risks: stronger claims, false certainty, hidden value shifts, implementation convenience replacing theory;
- next update policy: what should be checked or revised in the next loop.

T-RDE must be implemented as testable logic where possible. For example, tests should verify that suspended questions are not silently converted into accepted claims, that evidence is attached to meaning claims, and that contested interpretations remain visible.

## TDD and Test-First Policy

Development must follow TDD where practical.

Before implementing a core behavior, add tests that define the expected behavior. This is especially important for:

- meaning event state transitions;
- suspended and contested handling;
- T-RDE output structure;
- i18n message resolution;
- ledger write/read behavior;
- review routing thresholds;
- prompt contract validation.

The minimal acceptable loop for implementation work is:

```text
Issue
  ↓
Branch
  ↓
Failing test
  ↓
Implementation
  ↓
Passing test
  ↓
T-RDE review note
  ↓
Pull request
```

## Design Pattern Policy

Use design patterns where they reduce complexity or protect boundaries. Do not over-pattern the MVP.

Recommended initial patterns:

- Strategy: for pluggable LLM workers and review routing policies;
- Repository: for ledger persistence abstraction;
- Command: for loop actions such as extract, synthesize, audit, and record;
- State Machine: for meaning event state transitions;
- Adapter: for WebUI Chat, OpenAI-compatible APIs, and future UI integrations;
- Policy Object: for loop constitution and permission boundaries.

Avoid patterns that add ceremony without reducing risk. The goal is a small, testable system, not a framework showcase.

## Module Size and Code Organization

Avoid giant modules. Files should be small enough to review easily.

Initial guidance:

- keep domain models separate from infrastructure;
- keep prompt templates separate from worker code;
- keep persistence separate from extraction logic;
- keep UI integration separate from ledger semantics;
- prefer cohesive modules under roughly 200-300 lines when feasible;
- split earlier when a module mixes responsibilities.

Suggested structure:

```text
src/
  domain/
    meaning-event.ts
    rde-record.ts
    review-state.ts
  ledger/
    meaning-ledger.repository.ts
  loops/
    experience-extractor.ts
    meaning-synthesizer.ts
    trde-auditor.ts
    review-router.ts
  prompts/
    loop-constitution.ts
    experience-extractor.prompt.ts
    meaning-synthesizer.prompt.ts
    trde-auditor.prompt.ts
  i18n/
    messages.ts
    ja.ts
    en.ts
  adapters/
    webui/
    openai-compatible/
  tests/
```

The concrete language and framework are not fixed by this ADR, but the initial preference is TypeScript for WebUI integration unless later technical discovery strongly favors another stack.

## i18n Policy

Chronicle Chat must support i18n from the beginning.

Initial supported languages:

- Japanese (`ja`);
- English (`en`).

Principles:

- never hard-code user-facing strings in business logic;
- keep prompt language and UI language configurable separately;
- preserve original user language in evidence records;
- allow meaning labels to have localized display names but stable internal identifiers;
- avoid translating evidence in a way that changes meaning;
- when translation is required, store both original and translated text with provenance.

Stable internal keys should be English-like identifiers, for example `meaning_event.status.suspended`, while UI rendering can use Japanese or English.

## Roadmap and Issue Policy

All roadmap items must be tracked as GitHub Issues. Implementation tasks should be small enough to fit into separate branches.

Branch naming convention:

```text
feat/<issue-number>-short-topic
docs/<issue-number>-short-topic
test/<issue-number>-short-topic
fix/<issue-number>-short-topic
```

Each implementation issue should include:

- goal;
- scope;
- non-goals;
- acceptance criteria;
- TDD/test-first notes;
- T-RDE notes;
- suggested branch name.

The initial roadmap should be issue-driven:

1. define project skeleton and test runner;
2. implement domain model for Meaning Event;
3. implement Meaning Event Ledger persistence;
4. implement loop prompt contracts;
5. implement Experience Extractor worker;
6. implement Meaning Synthesizer worker;
7. implement T-RDE Auditor worker;
8. implement Review Router;
9. implement WebUI Chat adapter/hook;
10. implement Chronicle Panel MVP;
11. implement i18n foundation;
12. write end-to-end loop smoke test.

## Security and Privacy Policy

Chronicle Chat stores conversation-derived meaning events. This is more sensitive than ordinary chat logs because it records decisions, hesitations, interpretations, and suspended judgments.

Minimum principles:

- do not store secrets in meaning events;
- preserve evidence provenance;
- allow users to mark events private or non-persistent;
- separate raw conversation logs from derived meaning events when possible;
- log model outputs and prompt versions for auditability;
- avoid sending private evidence to external LLM providers unless explicitly configured.

## Consequences

This decision makes Chronicle Chat slower to build than a normal chat wrapper, but much safer as a loop-based system. It gives the project a clear implementation discipline and protects the core idea from degenerating into a generic chat history summarizer.

The main cost is increased design overhead. The main benefit is that the system can preserve meaning boundaries, suspended judgments, and RDE auditability from the beginning.

## Alternatives Considered

### Simple chat history summarizer

Rejected. It would lose suspended questions, contested interpretations, and ΔM structure.

### Pure RAG system

Rejected as the core architecture. RAG is useful for retrieval, but Chronicle Chat needs to track meaning change, not only retrieve knowledge.

### Single-agent autonomous loop

Rejected for MVP. A single agent would be too likely to collapse extraction, interpretation, and audit into one opaque output.

### Manual-only reflection journal

Rejected as the primary implementation. Human reflection is essential, but the system must reduce cognitive burden by surfacing only meaningful boundaries.

## Acceptance Criteria for this ADR

- The project has a written loop constitution policy.
- The project treats prompt files as versioned design assets.
- Initial roadmap items are created as GitHub Issues.
- Implementation work is issue-sized and branch-based.
- TDD and T-RDE are explicitly required for core logic.
- Suspended and contested states are first-class concepts.
- i18n is included in the initial architecture.
