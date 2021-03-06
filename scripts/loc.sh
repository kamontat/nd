#!/usr/bin/env bash

run_cloc() {
  local title
  local filename="$1"
  local packages="$2"
  shift 2

  printf "generate %-20s:  => " "$filename"

  root="$packages"
  [[ "$packages" == "index.ts" ]] && root="./packages/nd-core"

  title="$(node -p "const package = require('$root/package.json'); package.name + ': \`v' + package.version + '\`'")\n\n"

  cloc \
    "$packages" $@ \
    --md \
    --fullpath \
    --hide-rate \
    --quiet \
    --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer|reports)" \
    --not-match-f="(.*)\.spec\.ts" \
    --report-file ./docs/reports/loc/$filename &&
    prepend "$filename" "$title" &&
    echo "completed" || echo "failure"

}

prepend() {
  local report="./docs/reports/loc/$1"
  local content
  shift

  content="$(cat "$report")"
  printf "$*$content" >$report

}

append() {
  local filename="$1"
  shift

  printf "$@" >>./docs/reports/loc/$filename
}

if [[ $1 == 'lib' ]]; then
  run_cloc "LOC-ADMIN.md" "./packages/nd-admin" "./admin.ts"
  run_cloc "LOC-AUTH.md" "./packages/nd-auth"
  run_cloc "LOC-CLI_BUILDER.md" "./packages/nd-commandline-interpreter"
  run_cloc "LOC-CONFIG.md" "./packages/nd-config"
  run_cloc "LOC-CONTENT.md" "./packages/nd-content"
  run_cloc "LOC-CORE.md" "./packages/nd-core"
  run_cloc "LOC-DATABASE.md" "./packages/nd-database"
  run_cloc "LOC-DEBUG.md" "./packages/nd-debug"
  run_cloc "LOC-DECODER.md" "./packages/nd-decoder"
  run_cloc "LOC-DOWNLOADER.md" "./packages/nd-downloader"
  run_cloc "LOC-ERROR.md" "./packages/nd-error"
  run_cloc "LOC-FBASE.md" "./packages/nd-fbase"
  run_cloc "LOC-FILE.md" "./packages/nd-file"
  run_cloc "LOC-FORMATTER.md" "./packages/nd-formatter"
  run_cloc "LOC-HELPER.md" "./packages/nd-helper"
  run_cloc "LOC-HTML_GEN.md" "./packages/nd-html-generator"
  run_cloc "LOC-LOGGER.md" "./packages/nd-logger"
  run_cloc "LOC-NOVEL.md" "./packages/nd-novel"
  run_cloc "LOC-RESOURCE.md" "./packages/nd-resource"
  run_cloc "LOC-SECURITY.md" "./packages/nd-security"
  run_cloc "LOC-THREAD.md" "./packages/nd-thread"
else
  run_cloc "README.md" "index.ts" "admin.ts" "src" "packages" "docs" "scripts"

  append "README.md" "\n\nCreate date is $(date "+%d/%m/%Y - %H:%M:%S")"
fi
