#!/usr/bin/env bash
# shellcheck disable=SC1000

# generate by create-script-file v4.0.1
# link (https://github.com/Template-generator/create-script-file/tree/v4.0.1)

# set -x #DEBUG - Display commands and their arguments as they are executed.
# set -v #VERBOSE - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.

#/ -----------------------------------
#/ Description:  ...
#/ How to:       ...
#/               ...
#/ Option:       --help | -h | -? | help | h | ?
#/                   > show this message
#/               --version | -v | version | v
#/                   > show command version
#/ -----------------------------------
#/ Create by:    Kamontat Chantrachirathumrong <work@kamontat.net>
#/ Since:        24/06/2019
#/ -----------------------------------
#/ Error code    1      -- error
#/ -----------------------------------
#/ Known bug:    ...
#/ -----------------------------------
#// Version:      0.0.1   -- description
#//               0.0.2b1 -- beta-format
#//               0.0.2a1 -- alpha-format

install_hub() {
  local root="/tmp/bin"

  mkdir "$root"

  local url="https://github.com/github/hub/releases/download/v2.12.8/hub-linux-amd64-2.12.8.tgz"
  local path="$root/hub.tgz"
  local bin="$root/hub-linux-amd64-2.12.8/bin/hub"

  if test -f "$bin"; then
    HUB_CLI="$bin"
    return 0
  fi

  curl -sLo "$path" "$url"
  tar -xvzf "$path" -C /tmp

  if ! test -f "$bin"; then
    echo "execuable file of hub command not exist" >&2 && exit 1
  fi

  HUB_CLI="$bin"
}

HUB_CLI="hub"
if ! command -v "${HUB_CLI}"; then
  echo "Hub is not exist, Start to install from github"
  install_hub
fi

if [[ "$CI" == "true" ]]; then
  echo "Start as CI"
fi

CI=${CI:-false}
if [[ "$1" == "ci" ]] || [[ "$1" == "CI" ]] || [[ "$ENV" == "CI" ]]; then
  CI=true
fi

echo "Help:

1. make change in src folder
2. commit all changes
3. update package.json version and changelog
4. start this command
---------------------------"

echo "Starting...   release core cli"

VERSION=$(node -p -e "require('./packages/nd-core/package.json').version")
RELEASE_NOTE=$(node -p -e "require('./packages/nd-core/package.json').changelog['${VERSION}'].message")
RELEASE_NOTE_DATE=$(node -p -e "require('./packages/nd-core/package.json').changelog['${VERSION}'].date")
[[ "$RELEASE_NOTE" == "undefined" ]] && RELEASE_NOTE="NOT FOUND; please update release note first!"

echo "Creating...   tag ${VERSION} 
Release note is ${RELEASE_NOTE} at ${RELEASE_NOTE_DATE}
"

if [[ "$CI" == "true" ]]; then
  printf "[wait 5 second for continue]: "
  sleep 5
  echo "run as CI"
else
  printf "[press enter for continue]: "
  read -r ans
  echo "run as USER"
fi

TAG_NAME="v${VERSION}"

echo "Starting...   update line of code and add to commit"

yarn loc
git add docs/reports/loc

echo "Starting...   update CHANGELOG and add to commit"

yarn helper changelog
git add docs/reports/CHANGELOG.md

echo "Starting...   commit package.json (assume you just update package.json)"

# commit changes in package.json

git add package.json # add package.json
git commit --allow-empty --message "chore(release): ${TAG_NAME} [skip ci]

release note: $RELEASE_NOTE
update at:    $RELEASE_NOTE_DATE
"

# tag that changes
echo "Starting...   create git tag $TAG_NAME"

git tag "$TAG_NAME"

echo "Starting...   build executable package (using pkg command)"

yarn build

echo "Starting...   push all final change and tag to Github"

git push
git push --tags

echo "Starting... create release on Github (assume you have hub command installed)"

"${HUB_CLI}" release create -d \
  -m "Draft new version via deployment script" \
  -a ./dist/bin/nd-alpine \
  -a ./dist/bin/nd-linux \
  -a ./dist/bin/nd-macos \
  -a ./dist/bin/nd-win.exe \
  "$TAG_NAME"
