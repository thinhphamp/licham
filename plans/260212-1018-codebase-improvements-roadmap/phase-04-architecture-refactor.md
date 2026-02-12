# Phase 4: Architecture Refactor

## Objectives
- Standardize the project structure.
- Ensure data safety during backup/restore.

## Tasks

### 4.1 Service & Constants Cleanup
- [ ] Move large constants (Zodiac arrays, Can-Chi lookup tables) to `src/constants/lunar.ts`.
- [ ] Split `services/lunar/index.ts` into smaller specialized files.
- [ ] Centralize all shared Types in `src/types/`.

### 4.2 Backup Versioning
- [ ] Add a `version` field to the exported JSON object (`v1`, `v2`, etc.).
- [ ] Implement a `MigrationService` for imported data.
- [ ] Add file validation (checking file structure before overwriting store).

## Code Snippet (Conceptual)

```typescript
// src/services/dataService.ts
export const exportData = async () => {
    const data = {
        version: 2,
        events: get().events,
        settings: get().settings,
        exportDate: new Date().toISOString()
    };
    // ... logic to share/save file
}
```

## Success Criteria
- [ ] `services/lunar` contains strictly business logic.
- [ ] Legacy backup files (v1) can still be imported without crashing.
