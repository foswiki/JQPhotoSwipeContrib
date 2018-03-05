FOSWIKI_ROOT?=~/foswiki/core
TARGET=pkg.css pkg.js default-skin.png default-skin.svg preloader.gif
PKG_JS_SOURCE=photoswipe.uncompressed.js photoswipe-ui-default.uncompressed.js photoswipe.init.uncompressed.js
PKG_CSS_SOURCE=photoswipe.uncompressed.css default-skin.css

-include $(FOSWIKI_ROOT)/pub/System/JQueryPlugin/Makefile.include

all: $(TARGET) $(TARGET:.js=.js.gz) $(TARGET:.css=.css.gz)

.PHONY: git

git:
	git clone https://github.com/dimsemenov/PhotoSwipe.git git

pkg.uncompressed.js: $(PKG_JS_SOURCE)
	cat $(PKG_JS_SOURCE) > $@

pkg.uncompressed.css: $(PKG_CSS_SOURCE)
	cat $(PKG_CSS_SOURCE) > $@

ifneq (,$(wildcard git))
SUBDIR=default-skin

%.uncompressed.js: git/dist/%.js
	cp $< $@

%.uncompressed.css: git/dist/%.css
	cp $< $@

defaut-skin.uncompressed.css: git/dist/default-skin/%.css
	cp $< $@

default-skin.%: git/dist/default-skin/default-skin.%
	cp $< $@

preloader.gif: git/dist/default-skin/preloader.gif
	cp $< $@
endif

clean: 
	rm -f photoswipe.uncompressed.css \
	      photoswipe.css \
	      photoswipe.uncompressed.js \
	      photoswipe.js \
	      photoswipe-ui-default.uncompressed.js \
	      photoswipe-ui-default.js \
	      default-skin.* \
	      pkg.uncompressed.css \
	      pkg.uncompressed.js \
	      $(TARGET) *.gz

