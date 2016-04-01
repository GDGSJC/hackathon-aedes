/*
Name: 			Core Initializer
Written by: 	Crivos - (http://www.crivos.com)
Version: 		1.0
*/

var Core = {

	initialized: false,

	initialize: function() {

		if (this.initialized) return;
		this.initialized = true;

		this.build();
		this.events();

	},

	build: function() {

		// Adds browser version on html class.
		$.browserSelector();

		// Scroll to Top Button.
		$.scrollToTop();

		// Responsive Navigation.
		selectnav("mainMenu");

		// Header Search
		this.headerSearch();

		// Newsletter
		this.newsletter();

		// Featured Boxes
		this.featuredBoxes();

		// Flexslider
		this.flexSlider();

		// Tooltips
		$("a[rel=tooltip]").tooltip();

		// Sort
		this.sort();

		// Toggle
		this.toggle();

		// Twitter
		this.latestTweets();

		// Flickr Feed
		this.flickrFeed();

		// Fancybox
		this.fancybox();

	},

	events: function() {

		// Window Resize
		$(window).on("resize", function() {
			var timer = window.setTimeout(function() {
				window.clearTimeout(timer);

				// Flexslider
				Core.flexSlider();

				// Featured Boxes
				Core.featuredBoxes();

			}, 50);
		});

		// Bootstrap Dropdown Menu Fix
		$(".dropdown-menu a").on("touchstart", function(e) {
			window.location.href = $(this).attr("href");
		});

	},

	stickyMenu: function() {

		if($("body").hasClass("boxed"))
			return false;

		var header = $("body header:first"),
			headerHeight = header.height(),
			logo = header.find(".logo img"),
			logoWidth = logo.width(),
			logoHeight = logo.height(),
			$this = this,
			logoSmallHeight = 50;

		logo
			.css("height", logoSmallHeight);

		var logoSmallWidth = logo.width();

		logo
			.css("height", "auto")
			.css("width", "auto");

		var flatParentItems = $("header.flat-menu ul.nav-main > li > a");

		$this.checkStickyMenu = function() {

			if($(window).scrollTop() > ((headerHeight - 10) - logoSmallHeight) && $(window).width() > 768) {

				if($("body").hasClass("sticky-menu-active"))
					return false;

				logo.stop(true, true);

				$("body").addClass("sticky-menu-active").css("padding-top", headerHeight);
				flatParentItems.addClass("sticky-menu-active");

				logo.animate({
					width: logoSmallWidth,
					height: logoSmallHeight
				}, 250, function() {});

			} else {

				if($("body").hasClass("sticky-menu-active")) {

					$("body").removeClass("sticky-menu-active").css("padding-top", 0);
					flatParentItems.removeClass("sticky-menu-active");

					logo.animate({
						width: logoWidth,
						height: logoHeight
					}, 250, function() {

						logo.css({
							width: "auto",
							height: "auto"
						});

					});

				}

			}

		}

		$(window).on("scroll", function() {

			$this.checkStickyMenu();

		});

		$(window).on("resize", function() {

			$this.checkStickyMenu();

		});

		$this.checkStickyMenu();

	},

	headerSearch: function() {

		$("#searchForm").validate({
			rules: {
				q: {
					required: true
				}
			},
            errorPlacement: function(error, element) {

            },
			highlight: function (element) {
				$(element)
					.closest(".control-group")
					.removeClass("success")
					.addClass("error");
			},
			success: function (element) {
				$(element)
					.closest(".control-group")
					.removeClass("error")
					.addClass("success");
			}
		});

	},

	newsletter: function() {

		$("#newsletterForm").validate({
			submitHandler: function(form) {

				$.ajax({
					type: "POST",
					url: $("#newsletterForm").attr("action"),
					data: {
						"email": $("#newsletterForm #email").val()
					},
					dataType: "json",
					success: function (data) {
						if (data.response == "success") {

							$("#newsletterSuccess").removeClass("hidden");
							$("#newsletterError").addClass("hidden");

							$("#newsletterForm #email")
								.val("")
								.blur()
								.closest(".control-group")
								.removeClass("success")
								.removeClass("error");

						} else {

							$("#newsletterError").html(data.message);
							$("#newsletterError").removeClass("hidden");
							$("#newsletterSuccess").addClass("hidden");

							$("#newsletterForm #email")
								.blur()
								.closest(".control-group")
								.removeClass("success")
								.addClass("error");

						}
					}
				});

			},
			rules: {
				email: {
					required: true,
					email: true
				}
			},
            errorPlacement: function(error, element) {

            },
			highlight: function (element) {
				$(element)
					.closest(".control-group")
					.removeClass("success")
					.addClass("error");
			},
			success: function (element) {
				$(element)
					.closest(".control-group")
					.removeClass("error")
					.addClass("success");
			}
		});

	},

	featuredBoxes: function() {

		$("div.featured-box").css("height", "auto");

		$("div.featured-boxes").each(function() {

			var wrapper = $(this);
			var minBoxHeight = 0;

			$("div.featured-box", wrapper).each(function() {
				if($(this).height() > minBoxHeight)
					minBoxHeight = $(this).height();
			});

			$("div.featured-box", wrapper).height(minBoxHeight);

		});

	},

	flexSlider: function(options) {

		$("div.flexslider").each(function() {

			var slider = $(this);

			var defaults = {
				animationLoop: false,
				controlNav: true,
				directionNav: true
			}

			var config = $.extend({}, defaults, options, slider.data("plugin-options"));

			if(($(window).width() < 768 && slider.hasClass("normal-device")) || $(window).width() > 768 && slider.hasClass("small-device") || (!slider.hasClass("flexslider-init"))) {

				// Reset if already initialized.
				if(slider.find("div.flex-viewport") && typeof(config.maxVisibleItems) != "undefined") {

					var el = slider;

					el.find("li.clone").remove();

					var elClean = el.clone();

					elClean.find("div.flex-viewport").children().unwrap();

					elClean
						.find("ul.flex-direction-nav, ol.flex-control-nav")
						.remove()
						.end()
						.find("*").removeAttr("style").removeClass (function (index, css) {
							return (css.match (/\bflex\S+/g) || []).join(" ");
						});

					elClean.insertBefore(el);

					el.remove();

					slider = elClean;

				}

				// Set max visible items.
				if(typeof(config.maxVisibleItems) != "undefined") {

					slider.find("ul.slides li > div").unwrap();

					var items = slider.find("ul.slides").children("div");
					var visibleItems = config.maxVisibleItems;

					if($(window).width() < 768) {
						visibleItems = 1;
						slider
							.removeClass("normal-device")
							.addClass("small-device");
					} else {
						slider
							.removeClass("small-device")
							.addClass("normal-device");
					}

					for (var i = 0; i < items.length; i+= visibleItems) {
						var slice = items.slice(i,i + visibleItems);

						slice.wrapAll("<li></li>");
					}

				}

			}

			// Initialize Slider
			slider.flexslider(config).addClass("flexslider-init");

			if(config.controlNav)
				slider.addClass("flexslider-control-nav");

			if(config.directionNav)
				slider.addClass("flexslider-direction-nav");

		});

	},

	sort: function() {

		$("ul.sort-source").each(function() {

			var source = $(this);
			var destination = $("ul.sort-destination[data-sort-id=" + $(this).attr("data-sort-id") + "]");

			if(destination.get(0)) {

				var minParagraphHeight = 0;
				var paragraphs = $("span.thumb-info-caption p", destination);

				paragraphs.each(function() {
					if($(this).height() > minParagraphHeight)
						minParagraphHeight = $(this).height();
				});

				paragraphs.height(minParagraphHeight);

				$(window).load(function() {

					destination.isotope({
						itemSelector: "li",
						layoutMode : "fitRows"
					});

					source.find("a").click(function(e) {

						e.preventDefault();

						var $this = $(this);

						source.find("li.active").removeClass("active");
						$(this).parent().addClass("active");

						destination.isotope({
							filter: $this.parent().attr("data-option-value")
						});

						return false;

					});

				});

			}

		});

	},

	toggle: function() {

		$("section.toggle label").prepend($("<i />").addClass("icon-plus"));
		$("section.toggle label").prepend($("<i />").addClass("icon-minus"));

		if ($("html").hasClass("ie8")) {

			$("section.toggle input").click(function() {
				$(this).parent().toggleClass("active");
			});

		}

	},

	fancybox: function(options) {

		$(".fancybox").each(function() {

			var el = $(this);

			var config, defaults = {}
			if(el.data("plugin-options"))
				config = $.extend({}, defaults, options, el.data("plugin-options"));

			$(this).fancybox(config);

		});

	},

	flickrFeed: function(options) {

		$("ul.flickr-feed").each(function() {

			var el = $(this);

			var defaults = {
				limit: 6,
				qstrings: {
					id: ''
				},
				itemTemplate: '<li><a rel="flickr" href="{{image_b}}" class="fancybox"><span class="thumbnail"><img alt="{{title}}" src="{{image_s}}" /></span></a></li>'
			}

			var config = $.extend({}, defaults, options, el.data("plugin-options"));

			el.jflickrfeed(config, function(data) {

				$(".fancybox[rel=flickr]").fancybox();

			});

		});

	},

	latestTweets: function() {

		var wrapper = $("#tweet"),
			accountId = wrapper.data("account-id");

		if(wrapper.get(0) && accountId != "") {
			getTwitters("tweet", {
				id: accountId,
				count: 1
			});
		}

	}

};

Core.initialize();

$(window).load(function () {

	// Sticky Meny
	Core.stickyMenu();

});