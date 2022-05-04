/*global PhotoSwipe, PhotoSwipeUI_Default */

"use strict";
(function($, window) {

  var defaults = {
    itemSelector: ".imageHref",
    pswpSelector: ".pswp",
    tapToClose: false,
    closeOnScroll: false,
    clickToCloseNonZoomable: false,
    loop: false,
    spacing: 0,
    index: 0,
    defaultWidth: 800,
    history: true
  },
  galleryCounter = 1,
  doneTemplate = false;

  // The actual plugin constructor 
  function Plugin(elem, opts) { 
    var self = this;

    self.elem = $(elem); 
    self.items = [];
    self.opts = $.extend({}, defaults, opts, self.elem.metadata(), self.elem.data()); 
    
    self.opts.getThumbBoundsFn = self.opts.getThumbBoundsFn || function(index) {
      var item = self.items[index],
          offset = item.thumb.offset();

      if (offset) {
        return {
          x: offset.left,
          y: offset.top,
          w: item.thumbWidth,
          h: item.thumbHeight
        };
      }
    };
    self.opts.galleryUID = galleryCounter++;
    self.init(); 
  } 

  Plugin.prototype.init = function () { 
    var self = this, hash;

    self.loadTemplate();
    self.initItems();

    // process location hash
    if (self.opts.history) {
      hash = window.location.hash.match(/&gid=(\d+)&pid=(\d+)/);
      if (hash && hash.length === 3 && hash[1] == self.opts.galleryUID) {
        self.items[hash[2]-1].frame.trigger("click");
      }
    }

    // listen to an update event and harvest image items again
    self.elem.on("update", function(e) {
      self.initItems();
    });
  }; 

  Plugin.prototype.loadTemplate = function() {
    var self = this;

    if (doneTemplate) {
      return;
    }
    //console.log("addign photoswipe template");

    doneTemplate = true;
    $("body").append(`
<div class="pswp $zone $id" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
                <div class="pswp__counter"></div>
                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                <button class="pswp__button pswp__button--share" title="Share"></button>
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div> 
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
            </button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
            </button>
            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>
        </div>
    </div>
</div>`);
  };

  Plugin.prototype.addItem = function(elem) {
    var self = this;
        index = self.items.length,
        $elem = $(elem), 
        $thumb = $elem.find("img"),
        thumbWidth = $thumb.width(),
        thumbHeight = $thumb.height(),
        origWidth = $elem.metadata().origWidth || $elem.data("origWidth") || self.opts.defaultWidth,
        origHeight = $elem.metadata().origHeight || $elem.data("origHeight") || origWidth * thumbHeight / thumbWidth;

    self.items.push({
      index: index,
      w: origWidth,
      h: origHeight,
      frame: $elem,
      src: $elem.data("origUrl") || $elem.attr("href"),
      thumb: $thumb,
      thumbWidth: thumbWidth,
      thumbHeight: thumbHeight,
      msrc: $thumb.attr("src"),
      title: $elem.attr("title")
    });

    $elem.data("index", index);

    $elem.on("click", function(ev) {
      var index = $(this).data("index"),
          opts = $.extend({}, self.opts, {
            index: index
          });

      ev.preventDefault();

      self.pswp = new PhotoSwipe(self.getPswpElem(), PhotoSwipeUI_Default, self.items, opts);
      self.pswp.init();

      return false;
    });
  };

  Plugin.prototype.initItems = function() {
    var self = this, index = 0;

    self.items = [];

    if (self.elem.is(self.opts.itemSelector)) {
      self.addItem(self.elem);
    }
    self.elem.find(self.opts.itemSelector).each(function() {
      self.addItem(this);
    });

    //console.log("found "+self.items.length+" items in photoswipe");
  };

  // get the pswpElem as late as possible in case it has been injected async'ly
  Plugin.prototype.getPswpElem = function() {
    var self = this;

    if (typeof(self.pswpElem) === 'undefined' || self.pswpElem.length === 0) {
      self.pswpElem = $(self.opts.pswpSelector);
    }

    return self.pswpElem[0];
  };

  // A plugin wrapper around the constructor, 
  // preventing against multiple instantiations 
  $.fn.photoSwipe = function (opts) { 
    return this.each(function () { 
      if (!$.data(this, "photoSwipe")) { 
        $.data(this, "photoSwipe", new Plugin(this, opts)); 
      } 
    }); 
  };

  // Enable declarative widget instanziation 
  $(function() {
    $(".jqPhotoSwipe").livequery(function() {
      var $this = $(this);

      $this.photoSwipe();
    });

    // fired by angular-js
    $(window).on("locationChanged locationReloaded", function() {
      //console.log("### PHOTOSWIPE: detected a location change");
      galleryCounter = 1;
    });
  });


})(jQuery, window);
