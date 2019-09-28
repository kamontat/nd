npm_client=yarn

test:
	@TS_NODE_SKIP_IGNORE=true \
	NODE_ENV="$(mode)" \
	nyc \
		mocha \
		--no-timeouts \
		--reporter mochawesome \
		--reporter-options reportPageTitle=ND\ Test\ Reporter,reportTitle=Report,charts=true,cdn=true,reportDir=reports,timestamp=,inline=true,reportFilename=mocha-report \
		--require ts-node/register \
		./packages/**/*.spec.ts ./src/**/*.spec.ts

lib:
ifeq "$(quite)" "true"
	@$(npm_client) add \
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
	rm -rf dist .nyc_output coverage ./docs/reports/**/*.html

loc:
ifeq "$(type)" "lib"
	@cloc ./index.ts ./package.json ./src --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-CORE.md
	@cloc ./packages/nd-logger --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-LOGGER.md
	@cloc ./packages/nd-commandline-interpreter --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-CLI_BUILDER.md
	@cloc ./packages/nd-security --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-SECURITY.md
	@cloc ./packages/nd-helper --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-HELPER.md
	@cloc ./packages/nd-config --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-CONFIG.md
	@cloc ./packages/nd-error --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-ERROR.md
	@cloc ./admin.ts ./packages/nd-admin --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-ADMIN.md
	@cloc ./packages/nd-formatter --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-FORMATTER.md
	@cloc ./packages/nd-downloader --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-DOWNLOADER.md
	@cloc ./packages/nd-content --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-CONTENT.md
	@cloc ./packages/nd-novel --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-NOVEL.md
	@cloc ./packages/nd-decoder --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-DECODER.md
	@cloc ./packages/nd-file --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-FILE.md
	@cloc ./packages/nd-html-generator --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-HTML_GEN.md
	@cloc ./packages/nd-thread --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-THREAD.md
	@cloc ./packages/nd-resource --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-RESOURCE.md
	@cloc ./packages/nd-debug --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-DEBUG.md
	@cloc ./packages/nd-database --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./docs/reports/loc/LOC-DATABASE.md
else
	cloc . --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer|reports)" --md > ./docs/reports/loc/LOC.md

	@printf "\nCreate date is " >> ./docs/reports/loc/LOC.md
	@date "+%d/%m/%Y - %H:%M:%S" >> ./docs/reports/loc/LOC.md
endif

changelog:
	@git chglog --config .gitgo/chglog/config.yml --output docs/reports/CHANGELOG.md --tag-filter-pattern "^v"