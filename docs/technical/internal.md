### How to create internal libraries

1. Create folder called `nd-*`
2. Add `package.json`

```json
{
  "name": "@nd/*",
  "version": "0.0.1-alpha.1",
  "description": "description template",
  "dependencies": {
    "@nd/logger": "./packages/nd-logger",
    "@nd/error": "./packages/nd-error"
  },
  "changelog": {
    "0.0.1-alpha.1": {
      "message": "changelog template",
      "date": "xx Oct 2019"
    }
  }
}
```

3. add `index.ts`

```typescript
import Package from "./package.json";

export const XXX = () => {}

export { Package }
```

4. run install via `yarn add ./packages/nd-*`
5. add to Makefile (section **lib**) and [loc.sh](scripts/loc.sh)
6. add to version command and version detail [link](packages/nd-core/constants/content.ts)
   1. function `VERSION_FULL`
   2. function `VERSION_FULL_DETAIL`

