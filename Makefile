.PHONY: all
all: src/vendor

.PHONY: src/vendor
src/vendor:
	$(MAKE) -C src/vendor/

.PHONY: clean
clean:
	$(MAKE) -C src/vendor/ $@
	$(RM) *.zip

.PHONY: archive
archive:
	$(MAKE) -C src/ $@
