GENERATED_SCRIPTS=service.js address.js

.PHONY: all
all: $(GENERATED_SCRIPTS)

$(GENERATED_SCRIPTS):
	oniontree-generate -oniontree "$(ONIONTREE_PATH)" -with-description=false -with-public-keys=false -template "$(addsuffix .in,$@)" > $@

.PHONY: clean
clean:
	$(RM) $(GENERATED_SCRIPTS)
