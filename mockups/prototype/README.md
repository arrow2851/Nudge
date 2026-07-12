# Nudge Interactive Prototype

This folder contains the high-fidelity browser prototype used to validate Nudge before native Android implementation.

## Run

Open `index.html` directly, or serve the folder with any static server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Implemented prototype flows

- Today dashboard and progress
- Quick Win recommendations
- Universal Quick Add
- Task and chore completion
- Light, Moderate, and Deep grading
- Areas, rooms, and room reset flow
- One-time and recurring task views
- Reusable lists, remembered suggestions, and shopping sessions
- Simulated five-minute direct intervention
- Focus-task experience
- Gemini-style command review and confirmation
- History, insights, templates, search, and settings
- Browser persistence through `localStorage`

## Prototype limitations

The following are intentionally simulated until the Android build:

- UsageStatsManager app detection
- Background/direct activity launch permissions
- Android notifications and widgets
- Real Gemini API requests
- Room/DataStore persistence
- Device services such as driving and call detection

## Android translation map

| Prototype | Android implementation |
|---|---|
| Page renderer | Jetpack Compose screen/composable |
| JavaScript state | ViewModel + StateFlow |
| localStorage | Room + DataStore |
| CSS design tokens | Material 3 theme tokens |
| Browser routes | Navigation Compose |
| Simulated redirect | UsageStatsManager + intervention coordinator |
| Local Gemini parser | Gemini function calling through secure backend |
