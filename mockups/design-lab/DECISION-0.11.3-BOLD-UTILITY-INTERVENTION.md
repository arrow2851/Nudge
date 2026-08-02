# Decision — Bold Utility Intervention-to-action

**Date:** 2026-08-02  
**Version:** `0.11.3`

## Decision

Bold Utility may use direct hierarchy, thick rules, uppercase labels, and explicit action controls, but it may not turn continued app use or dismissal into an error, failure, fault, alarm, warning, or noncompliance state.

## Applied rules

- The four visible states are Available, Active, Complete, and Dismissed.
- The prompt says both continuing and switching are valid.
- Dismissal confirms that no action, Task, reminder, follow-up, penalty, or missed-opportunity state was created.
- Completion remains a reversible prototype state and does not create a score, streak, ranking, reward, or compliance measure.
- Directness is expressed through layout and action labels rather than pressure language.
- Existing routine and task state remain untouched.

## Validation consequence

The static validator requires Bold Utility’s optional-choice statements and rejects the pressure tokens `ERROR`, `FAILURE`, `FAILED`, `FAULT`, `ALARM`, `NONCOMPLIANCE`, and `WARNING` in the dedicated intervention renderer.

## Evidence boundary

This is a committed-source and validation-contract decision. Exact browser, physical Android, and actual screen-reader evidence remain pending.
