npm_client=yarn

lint:
ifeq "$(fix)" "true"
	@$(npm_client) eslint . --ext .ts --fix
else
	@$(npm_client) eslint . --ext .ts
endif

test:
	@TS_NODE_SKIP_IGNORE=true \
	TS_NODE_IGNORE=false \
	NODE_ENV="$(mode)" \
		$(npm_client) \
		nyc ava

lib:
ifeq "$(quite)" "true"
	@$(npm_client) add \
		./packages/nd-core \
		./packages/nd-logger \
		./packages/nd-commandline-interpreter \
		./packages/nd-security \
		./packages/nd-helper \
		./packages/nd-config \
		./packages/nd-error \
		./packages/nd-admin \
		./packages/nd-formatter \
		./packages/nd-downloader \
		./packages/nd-content \
		./packages/nd-novel \
		./packages/nd-decoder \
		./packages/nd-html-generator \
		./packages/nd-file \
		./packages/nd-thread \
		./packages/nd-resource \
		./packages/nd-debug \
		./packages/nd-database >/dev/null
else
	@$(npm_client) add \
		./packages/nd-core \
		./packages/nd-logger \
		./packages/nd-commandline-interpreter \
		./packages/nd-security \
		./packages/nd-helper \
		./packages/nd-config \
		./packages/nd-error \
		./packages/nd-admin \
		./packages/nd-formatter \
		./packages/nd-downloader \
		./packages/nd-content \
		./packages/nd-novel \
		./packages/nd-decoder \
		./packages/nd-html-generator \
		./packages/nd-file \
		./packages/nd-thread \
		./packages/nd-resource \
		./packages/nd-debug \
		./packages/nd-database
endif

compile: lib
ifeq "$(quite)" "true"
	@NODE_ENV="$(mode)" \
	$(npm_client) webpack >/dev/null
else
	@NODE_ENV="$(mode)" \
	$(npm_client) webpack
endif

build: compile
	npx pkg . --out-path dist/bin --targets "node12-macos-x64,node12-linux-x64,node12-alpine-x64,node12-win-x64"

clean:
ifeq "$(all)" "true"
	rm -rf node_modules yarn.lock
endif
	rm -rf dist .nyc_output coverage ./docs/reports/**/*.html .caches

loc:
	@sh ./scripts/loc.sh $(type)

apidoc:
	@$(npm_client) typedoc
ifeq "$(publish)" "true"
	@$(npm_client) gh-pages \
		--dist docs/api \
		--message "chore(gh-pages): publish new apidoc" \
		--dotfiles
endif

changelog:
	@git chglog --config .gitgo/chglog/config.yml --output docs/reports/CHANGELOG.md --tag-filter-pattern "^v"