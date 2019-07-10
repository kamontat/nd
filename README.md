# ND - Novel Downloader

Work in process... stay tune :)

- [Usecase part](#Usecase-part)
- [Business part](#Business-part)
- [Technical part](#Technical-part)
  - [Libraries creator](#Libraries-creator)

## Usecase part

... [WIP]

## Business part

... [WIP]

## Technical part

### Libraries creator

1. Create folder called `nd-*`
2. Add `package.json`

```json
{
  "name": "nd-*",
  "version": "0.0.1-alpha.1",
  "description": "description template",
  "dependencies": {
    "nd-logger": "./modules/nd-logger",
    "nd-error": "./modules/nd-error"
  },
  "changelog": {
    "0.0.1-alpha.1": "first version template"
  }
}
```

3. add `index.ts`

```typescript
import Package from "./package.json";

export const XXX = () => {}

export { Package }
```

4. run install via `yarn add ./modules/nd-*`
5. add to Makefile (section **lib** and **loc**)
6. add to version command and version detail [link](./src/constants/content.ts)
   1. function `VERSION_FULL`
   2. function `VERSION_FULL_DETAIL`
