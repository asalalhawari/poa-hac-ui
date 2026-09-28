# Real-Data Mode

The application deliberately distinguishes implemented calculation logic from unavailable external integrations.

## Real and persisted
- Claim CRUD
- Review queue
- HAC calculation from submitted claim fields
- Notes and reviewer decisions
- Configuration changes
- Clinical reference CRUD/import
- Analytics derived from stored claims

## Not connected yet
- Production payer/provider claim feed
- Enterprise database
- Official external ICD/CPT catalog feed
- AI patient-path model / learned network
- SSO / user directory

When one of these is unavailable, the UI shows an empty/unavailable state instead of generating substitute data.
