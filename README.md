# Chronicle Chat

Chronicle Chat turns LLM conversations into reviewable meaning-event streams.

It is designed as a generic WebUI Chat-based MVP for the broader Resonance Architecture and Meaning Operating System work. The first goal is not to build another chat UI. The first goal is to preserve decisions, rejected options, suspended questions, contested interpretations, and meaning changes as structured records.

## Current Status

This repository is in early development.

The initial implementation follows ADR-0001:

- prompt as Loop Constitution;
- Meaning Event Ledger as the core;
- `accepted`, `rejected`, `suspended`, and `contested` as first-class states;
- T-RDE and test-first development;
- small modules rather than large monoliths;
- Japanese and English i18n from the beginning.

## Development

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Type-check:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

## Roadmap

See GitHub Issue #1 for the generic MVP roadmap.

## License

Apache-2.0
