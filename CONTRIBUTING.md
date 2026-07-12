# Contributing

The project is currently in product and UX design.

## Documentation changes

- Keep requirements, screens, and architecture consistent.
- Add significant decisions as ADRs under `docs/adr/`.
- Update the roadmap when scope moves between MVP and later phases.
- Preserve the local-first and low-friction product principles.

## Future code conventions

- Kotlin formatting through the project formatter and lint configuration
- Small, focused commits
- Tests for recurrence, completion, recommendation, and session logic
- No secrets or private API keys in source control
- Room schema changes must include version and migration updates

## Commit examples

```text
docs: refine direct intervention flow
feat: add area and subarea entities
test: cover completion-based recurrence
fix: prevent duplicate remembered list entries
```
