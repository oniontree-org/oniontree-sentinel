.PHONY: all
all:

.PHONY: archive
archive:
	zip \
	    -i "vendor/*" \
	    -i "*.js" \
	    -i "*.json" \
	    -i "*.html" \
	    -i "*.css" \
	    -i "*.png" \
	    -x "*Makefile" \
	    -r ../oniontree-sentinel.zip .
