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