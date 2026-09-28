# HAC Signal UI — Real-Data Mode

This build does not preload demo claims, fake users, mock analytics, preset cases, or synthetic AI outputs.

## Run

```bash
npm install
npm run dev:all
```

- UI: http://localhost:5173
- API: http://localhost:3001/api

## Data behavior

- Claims, reviewer notes and review decisions are persisted locally in `server/data/runtime/workflow.json`.
- HAC configuration is persisted in `server/data/runtime/config.json`.
- Clinical reference rules are persisted in `server/data/runtime/reference-codes.json`.
- The application starts with no claims and no reference catalog.
- Analytics are calculated only from claims currently stored in the backend.
- Clinical/AI pathway evidence is not fabricated. Component C returns `UNKNOWN` until an approved relationship map or trained AI model is connected.
- Authentication is not simulated. Connect a real identity/SSO provider before enabling login.

## Important

The A–E scoring rules are application logic derived from the supplied HAC scoring specification. Stored claim/reference data must come from actual user input, import, or an integrated source system.
