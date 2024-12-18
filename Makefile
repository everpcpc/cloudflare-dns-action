default: build

init:
	npm install

build: init
	npx ncc build src/index.js -o dist
