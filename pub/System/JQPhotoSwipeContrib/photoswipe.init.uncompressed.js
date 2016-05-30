/*global PhotoSwipe, PhotoSwipeUI_Default */
"use strict";
(function($, window) {

  var defaults = {
    itemSelector: ".imageSimple, .imageHref",
    pswpSelector: ".pswp",
    tapToClose: false,
    closeOnScroll: false,
    clickToCloseNonZoomable: false,
    loop: false,
    spacing: 0,
    index: 0,
    defaultWidth: 800
  },
  galleryCounter = 1;

  // The actual plugin constructor 
  function Plugin(elem, opts) { 
    var self = this;

    self.$elem = $(elem); 

    self.opts = $.extend({}, defaults, opts, self.$elem.metadata(), self.$elem.data()); 
    
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
    var self = this, index = 0, hash;

    self.items = [];

    self.$elem.find(self.opts.itemSelector).each(function() {
      var $this = $(this), 
          $thumb = $this.find("img"),
          thumbWidth = $thumb.width(),
          thumbHeight = $thumb.height(),
          origWidth = $this.metadata().origWidth || $this.data("origWidth") || self.opts.defaultWidth,
          origHeight = $this.metadata().origHeight || $this.data("origHeight") || origWidth * thumbHeight / thumbWidth;

      self.items.push({
        index: index,
        w: origWidth,
        h: origHeight,
        frame: $this,
        src: $this.data("origUrl") || $this.attr("href"),
        thumb: $thumb,
        thumbWidth: thumbWidth,
        thumbHeight: thumbHeight,
        msrc: $thumb.attr("src"),
        title: $this.attr("title")
      });

      $this.data("index", index);

      $this.on("click", function(ev) {
        var index = $this.data("index"),
            opts = $.extend({}, self.opts, {
              index: index
            });

        ev.preventDefault();

        self.pswp = new PhotoSwipe(self.getPswpElem(), PhotoSwipeUI_Default, self.items, opts);
        self.pswp.init();

        return false;
      });

      index++;
    });

    // process location hash
    hash = window.location.hash.match(/&gid=(\d+)&pid=(\d+)/);
    if (hash && hash.length === 3 && hash[1] == self.opts.galleryUID) {
      self.items[hash[2]-1].frame.trigger("click");
    }
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
  $.fn.jqPhotoSwipe = function (opts) { 
    return this.each(function () { 
      if (!$.data(this, "jqPhotoSwipe")) { 
        $.data(this, "jqPhotoSwipe", new Plugin(this, opts)); 
      } 
    }); 
  };

  // Enable declarative widget instanziation 
  $(function() {
    $(".jqPhotoSwipe:not(.jqPhotoSwipeInited)").livequery(function() {
      var $this = $(this);

      $this.addClass("jqPhotoSwipeInited").jqPhotoSwipe();
    });

    // fired by angular-js
    $(window).on("locationChanged locationReloaded", function() {
      //console.log("### PHOTOSWIPE: detected a location change");
      galleryCounter = 1;
    });
  });


})(jQuery, window);
