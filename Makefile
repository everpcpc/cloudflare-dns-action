default: build

init:
	npm install

build: init
	ncc build src/index.js -o dist
