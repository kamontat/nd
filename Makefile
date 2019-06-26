npm_client=yarn

test:
	@TS_NODE_SKIP_IGNORE=true \
	NODE_ENV="$(mode)" \
	nyc \
		mocha \
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
		./modules/nd-error >/dev/null
else
	@$(npm_client) add \
		./modules/nd-logger \
		./modules/nd-commandline-interpreter \
		./modules/nd-security \
		./modules/nd-helper \
		./modules/nd-config \
		./modules/nd-error
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
	rm -rf dist .nyc_output coverage reports/**
