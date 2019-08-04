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
		./modules/**/*.spec.ts ./src/**/*.spec.ts

lib:
ifeq "$(quite)" "true"
	@$(npm_client) add \
		./modules/nd-logger \
		./modules/nd-commandline-interpreter \
		./modules/nd-security \
		./modules/nd-helper \
		./modules/nd-config \
		./modules/nd-error \
		./modules/nd-admin \
		./modules/nd-formatter \
		./modules/nd-downloader \
		./modules/nd-novel \
		./modules/nd-decoder \
		./modules/nd-html-generator \
		./modules/nd-file \
		./modules/nd-thread \
		./modules/nd-resource >/dev/null
else
	@$(npm_client) add \
		./modules/nd-logger \
		./modules/nd-commandline-interpreter \
		./modules/nd-security \
		./modules/nd-helper \
		./modules/nd-config \
		./modules/nd-error \
		./modules/nd-admin \
		./modules/nd-formatter \
		./modules/nd-downloader \
		./modules/nd-novel \
		./modules/nd-decoder \
		./modules/nd-html-generator \
		./modules/nd-file \
		./modules/nd-thread \
		./modules/nd-resource
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
	npx pkg . --out-path dist/bin

clean:
ifeq "$(all)" "true"
	rm -rf node_modules yarn.lock
endif
	rm -rf dist .nyc_output coverage reports/**/*.html

loc:
ifeq "$(type)" "lib"
	@cloc ./index.ts ./package.json ./src --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-CORE.md
	@cloc ./modules/nd-logger --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-LOGGER.md
	@cloc ./modules/nd-commandline-interpreter --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-CLI_BUILDER.md
	@cloc ./modules/nd-security --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-SECURITY.md
	@cloc ./modules/nd-helper --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-HELPER.md
	@cloc ./modules/nd-config --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-CONFIG.md
	@cloc ./modules/nd-error --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-ERROR.md
	@cloc ./admin.ts ./modules/nd-admin --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-ADMIN.md
	@cloc ./modules/nd-formatter --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-FORMATTER.md
	@cloc ./modules/nd-downloader --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-DOWNLOADER.md
	@cloc ./modules/nd-novel --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-NOVEL.md
	@cloc ./modules/nd-decoder --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-DECODER.md
	@cloc ./modules/nd-file --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-FILE.md
	@cloc ./modules/nd-html-generator --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-HTML_GEN.md
	@cloc ./modules/nd-thread --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-THREAD.md
	@cloc ./modules/nd-resource --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer)" --md > ./reports/loc/LOC-RESOURCE.md
else
	cloc . --fullpath --not-match-d="(node_modules|.nyc_output|coverage|dist|webpack-visualizer|reports)" --md > ./reports/loc/LOC.md

	@printf "\nCreate date is " >> ./reports/loc/LOC.md
	@date "+%d/%m/%Y - %H:%M:%S" >> ./reports/loc/LOC.md
endif