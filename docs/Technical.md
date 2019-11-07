### Sonarqube report

##### v1.0.0-beta.5

![image](docs/assets/sonarqube/report-v1.0.0-beta.5.png)

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
6. add to version command and version detail [link](./src/constants/content.ts)
   1. function `VERSION_FULL`
   2. function `VERSION_FULL_DETAIL`

### Deployment

1. run `yarn build` to build executation file
2. run follow command (only for mac user)

```bash
# defined bin path
export BIN_PATH="/usr/local/bin"

# move execute file to bin path
mv dist/bin/nd-macos ${BIN_PATH}/nd

# move node file to bin path
mv node_modules/grpc/src/node/extension_binary/node-v72-darwin-x64-unknown/grpc_node.node ${BIN_PATH}
```