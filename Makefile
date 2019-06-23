npm_client=yarn

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
	rm -rf dist modules/nd-*/dist
