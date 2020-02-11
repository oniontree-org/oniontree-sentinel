.PHONY: all
all: src/js src/vendor

.PHONY: src/js
src/js:
	$(MAKE) -C src/js/

.PHONY: src/vendor
src/vendor:
	$(MAKE) -C src/vendor/

.PHONY: clean
clean:
	$(MAKE) -C src/js/ $@
	$(MAKE) -C src/vendor/ $@
