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

echo "Help:

1. make change in src folder
2. commit all changes
3. update package.json version and changelog
4. start this command
---------------------------"

echo "Starting...   release core cli"

VERSION=$(node -p -e "require('./package.json').version")
RELEASE_NOTE=$(node -p -e "require('./package.json').changelog['${VERSION}'].message")
RELEASE_NOTE_DATE=$(node -p -e "require('./package.json').changelog['${VERSION}'].date")
[[ "$RELEASE_NOTE" == "undefined" ]] && RELEASE_NOTE="NOT FOUND; please update release note first!"

echo "Creating...   tag ${VERSION} 
Release note is ${RELEASE_NOTE} at ${RELEASE_NOTE_DATE}

[press ENTER to continue]"
read -r ans

TAG_NAME="v${VERSION}"

echo "Starting...   update line of code and add to commit message"

yarn loc
git add docs/reports/loc

echo "Starting...   commit package.json (assume you just update package.json)"

# commit changes in package.json

git add package.json # add package.json
git commit --allow-empty --message "chore(release): ${TAG_NAME} 

release note: $RELEASE_NOTE
update at:    $RELEASE_NOTE_DATE
"

# tag that changes

git tag "$TAG_NAME"

make build mode=production quite=true
