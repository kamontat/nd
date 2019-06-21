npm_client=yarn

compile: 
ifeq "$(quite)" "true"
	@NODE_ENV="$(mode)" \
	$(npm_client) webpack >/dev/null
else
	@NODE_ENV="$(mode)" \
	$(npm_client) webpack
endif
	

clean:
	rm -rf dist modules/nd-*/dist
