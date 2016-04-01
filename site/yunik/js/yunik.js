var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
	
	
jQuery(document).ready(function($){	

	$('.cbp-filter-item').click(function(){ $.waypoints('refresh'); });
	/* IE fixes */
	if ((window.BrowserDetect.browser === "Mozilla" && window.BrowserDetect.version == 11) || window.BrowserDetect.browser === "Explorer" && window.BrowserDetect.version < 11){
		$('.overlay-pattern').add($('.testimonials-slide-content .img-container img')).addClass('ie');
		$('.cbp-item') .mouseenter().mouseleave();
		$(window).resize();
	}
	if (window.BrowserDetect.browser === "Explorer" && window.BrowserDetect.version < 10){ $('.navbar').addClass('oldie'); }
	if (window.BrowserDetect.browser === "Explorer"){ $('audio').addClass('ie'); }
	
	/* projects category filter */
	if ($('.cbp-l-filters-dropdownHeader').length){
		$('.cbp-l-filters-dropdownHeader').click(function(){
			$(this).siblings('ul').toggleClass('opened');
		});
		$('.cbp-l-filters-dropdownList li').click(function(){
			$(this).parent().removeClass('opened');
		});
	}

	/* initialize the youtube player */
	if ($(".player").length) { $(".player").each(function(){ $(this).mb_YTPlayer(); }); }

	/* import the animate.css if the browser is not mobile device */
	if (!isMobile.any()){
		$('head').append('<link rel="stylesheet" href="css/animate.css" type="text/css" />');
	} else {
		$('#option_wrapper').add($('.option_btn')).remove();
	}


	/* active first tab */
	$('.panel-group').each(function(){ $(this).children().first().addClass('active'); });
	
	/* mailchimp tweaks */
	if ($('#mc-embedded-subscribe').length){
		$('#mce-EMAIL').after($('#mc-embedded-subscribe'));
		$('#mce-EMAIL').val('NOME DA CIDADE');
		$('#mce-EMAIL').focus(function(){
			if ($(this).val() == 'NOME DA CIDADE')
				$(this).val('');
		});
		$('#mce-EMAIL').blur(function(){
			if ($(this).val() == ''){
				$(this).val('NOME DA CIDADE');
			}
		});
		$('#mc-embedded-subscribe').parents('.form').find('label').remove();
	}
	
	/* TESTIMONIALS */
	if ($('#testimonials').length){
		$('.testimonial-box-nav li a').each(function(e){
			if (e == 0) $(this).parents('#testimonials').children( $(this).attr('href') ).css('display','block').siblings('.testimonial').css('display','none');
			$(this).mouseenter(function(){
				$(this).addClass('active').parent().siblings().children('a').removeClass('active');
				$(this).parents('#testimonials').children( $(this).attr('href') ).css('display','block').siblings('.testimonial').css('display','none');
				$.waypoints('refresh');
			}).click(function(e){
				e.preventDefault();
			});
		});
	}
	
	/* DESIGNARE SPECIAL TABS */
	if ($('.special_tabs').length){
	
		$('.special_tabs').each(function(e){
		
			$(this).addClass('st-'+e);
			$el = $('.st-'+e);
			
			$el.children("p, br").remove();

			$el.append('<div class="tab-selector col-sm-1" />');
			$el.find('.label').appendTo($el.children('.tab-selector'));
			$el.append('<div class="tab-container col-sm-11" />');
			$el.find('.content').appendTo($el.children('.tab-container'));
			
			$el.find('.tab-selector > .label').eq(0).addClass('current');
			$el.find('.tab-container > .content').eq(0).addClass('current').css({
				'opacity':1,
				'top':'0%'
			});
			
			if ($el.find('.tab-container > .content').find('img.aligncenter').length){
		    	$el.find('.tab-container > .content').find('img.aligncenter').parents('p').css('text-align','center');
		    }
			
			$el.css('min-height', $el.find('.tab-selector').height());
			if ($el.find('.tab-container > .content').eq(0).height() > $el.find('.tab-selector').height())
				$el.animate({'height': $el.find('.tab-container > .content').eq(0).height()}, 1000, 'easeInOutExpo');
			else $(this).parents('.special_tabs').animate({'height': $(this).parents('.tab-selector').height()}, 1000, 'easeInOutExpo');
			for ( var i = 1; i < $el.find('.tab-container > .content').length; i++){
				$el.find('.tab-container > .content').eq(i).css({
					'position':'absolute',
					'margin-top':'100%',
					opacity:0
				});
			}
			
			var elm = $(this).attr('class').split("special_tabs ");
			var elm = elm[1];
			
			$('.'+elm).find('.tab-selector > .label').each(function(){
			
				if (!$(this).find('.designare_fa_special_tabs').length){
					$(this).find('.tab_title').css('padding-left','10px');
				}
								
				$(this).click(function(){
				
					if (!$(this).hasClass('current')){
						var filterClass = $(this).attr('class').toString();
						var randid = filterClass.replace("label ","");
						$nextEl = $('.'+elm).find('.tab-container > .content.'+randid);
						if ($nextEl.height() > $(this).parents('.tab-selector').height())
							$(this).parents('.special_tabs').stop().animate({'height': $nextEl.height()}, 1000, 'easeInOutExpo');
						else 
							$(this).parents('.special_tabs').stop().animate({'height': $(this).parents('.tab-selector').height()}, 1000, 'easeInOutExpo');
						$nextEl.css({'margin-top':'100%','top':'0%', 'display':'block'});
						$current = $('.'+elm).find('.tab-container .current');
						var id = $current.attr('class').split(" ");
							id = id[1];
						$('.'+elm).find('.tab-selector > .label.'+id).css({'color':'#5c5c5c'});
						$('.'+elm).find('.tab-selector > .label.'+id+'.current').css({'color':'#5c5c5c'});
						$current.stop().animate({'margin-top':'100%', opacity:0}, 1000, 'easeInOutExpo', function(){
							$(this).css('display','none');
						}); 
						$('.'+elm).find('.tab-selector > .label.'+id).removeClass('current');
						$current.removeClass('current');
						$current.animate({
							'margin-top': '-100%',
							opacity: 0
						}, 1000, 'easeInOutExpo', function(){
							$(this).css({'margin-top':'100%'});
						});
						$('.'+elm).find('.tab-selector > .label.'+randid).css({'color': $('').html() });
						$('.'+elm).find('.tab-selector > .label.'+randid).addClass('current');
						$('.'+elm).find('.tab-selector > label.'+randid).css('color', $('').html());
						$('.'+elm).find('.tab-container > .content.'+randid).css('display','block');
						$('.'+elm).find('.tab-container > .content.'+randid).addClass('current').stop().animate({ 'margin-top': '0%', opacity:1 },1000, 'easeInOutExpo', function(){
							$(this).css('display','block');
							if ($(this).find('.services-graph').length){
								var id = $(this).find('.services-graph').attr('id');
								sliding_horizontal_graph(id,3000);
							}
							
							if (window.BrowserDetect.browser == "Explorer" && window.BrowserDetect.version == 8){
								if ($(this).find('.recent_testimonials').length){
									$(this).css('width','100%');
								}
							}
							
						});
					}		
				});
				
			});
			
		});
	}
	/* END: DESIGNARE SPECIAL TABS */
	
	
	/*----------------------------------------------------*/
	// CONTACT FORM
	/*----------------------------------------------------*/    
	
	if ($('#contact_form').length){
		$('#contact_form .service-input').val($('#contact_form .service select').val());
		$('#contact_form .service select').change(function(){ $('#contact_form .service-input').val($('#contact_form .service').val()); });
	}
	
	if (window.BrowserDetect.browser === "Explorer" && window.BrowserDetect.version < 10){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur();
	}
	
	if (window.BrowserDetect.browser === "Explorer"){
		$('.contact-form select').focus(function(){ $(this).css('color','black'); }).blur(function(){ $(this).css('color','black'); }).blur();	
	}
	
	//if submit button is clicked
	$('.contact-form #submit').click(function () {		
		
		$(this).find('[placeholder]').each(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
			}
		});
		
		var name = $('input[name=name]');
		var email = $('input[name=email]');
		var subject = $('input[name=subject]');
		var comment = $('textarea[name=message]');

		if (name.val()=='') {
			name.addClass('hightlight');
			return false;
		} else name.removeClass('hightlight');
		
		if (email.val()=='') {
			email.addClass('hightlight');
			return false;
		} else email.removeClass('hightlight');

		//E-mail address validation
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(reg.test(email.val()) == false) {		 
			email.addClass('hightlight');
			return false;
		} else email.removeClass('hightlight');	  
		
		if (comment.val()=='') {
			comment.addClass('hightlight');
			return false;
		} else comment.removeClass('hightlight');
		
		//organize the data properly
		var data = 'name=' + name.val() + '&email=' + email.val() + '&subject=' + 
		subject.val() + '&comment='  + encodeURIComponent(comment.val());
		
		//disabled all the text fields
		$('.contact input, .contact textarea').attr('disabled','true');
		
		//show the loading sign
		$('.loading').show();
		
		//start the ajax
		$.ajax({
			//this is the php file that processes the data and send mail
			url: "contact-form/send.php",	
			type: "GET",
			data: data,				
			cache: false,
			
			//success
			success: function (html) {				
				//if process.php returned 1/true (send mail success)
				if (html==1) {					
					//clear the form
					$('.contact-form input, .contact-form textarea').val('');
					$('.contact-form select').val($('.contact-form select option').eq(0).val());
					if (window.BrowserDetect.browser === "Explorer" && window.BrowserDetect.version < 10){
						$('[placeholder]').focus(function() {
							var input = $(this);
							if (input.val() == input.attr('placeholder')) {
								input.val('');
								input.removeClass('placeholder');
							}
						}).blur(function() {
							var input = $(this);
							if (input.val() == '' || input.val() == input.attr('placeholder')) {
								input.addClass('placeholder');
								input.val(input.attr('placeholder'));
							}
						}).blur();
					}
					//show the success message
					$('.form-success').slideDown('slow');
					setTimeout(function(){
						$('.form-success').slideUp('slow');
					}, 5000);
					
				//if process.php returned 0/false (send mail failed)
				} else alert('An unexpected error occured. Please try again later.');				
			}		
		});
		return false;
	});
	
	
	/*----------------------------------------------------*/
	// SKILLS BARS
	/*----------------------------------------------------*/ 
	$(window).scroll(function(){
		$('.skillbar').each(function(){
			if ($(this).hasClass('notinview')){
				$(this).find('.pointerval .value').html('0%');
				if (isScrolledIntoView($(this).attr('id'))){
		    		$(this).removeClass('notinview');
		     		$(this).find('.skill-bar-percent').animate({
						width:jQuery(this).closest('.skillbar').attr('data-percent')
					},{
						duration : 2000, //the duration in ms of the bar animation
						easing: 'easeInOutExpo', //the easing effect of the animation
						step: function(now, fx){
							$(this).siblings('.pointerval').css('left',parseFloat(now, 10)+'%').find('.value').text(parseInt(now, 10)+'%');
						}
					});       
		        }
			}
		});
	});
	
	
	/*----------------------------------------------------*/
	// GRAPHICS
	/*----------------------------------------------------*/    
	function sliding_horizontal_graph(id, speed){
	    $("#" + id + " li span").each(function(i){                                  
	        var cur_li = $("#" + id + " li").eq(i).find("span");
	        var w = cur_li.attr("title");
	        cur_li.animate({width: w + "%"}, speed);
	    })
	}
	function graph_init(id, speed){
	    $(window).scroll(function(){
	    	if ($('#'+id).hasClass('notinview')){	    	
		    	if (isScrolledIntoView(id)){
		    		$('#'+id).removeClass('notinview');
		            sliding_horizontal_graph(id, speed);
		        }
	    	}
	    });
	    
	    if (isScrolledIntoView(id)){
	        sliding_horizontal_graph(id, speed);
	    }
	}
	
	/*----------------------------------------------------*/
	// PRELOADER CALLING
	/*----------------------------------------------------*/    

	$(".everything").queryLoader2({
        barColor: "#000",
        backgroundColor: "#fff",
        percentage: true,
        barHeight: 1,
        completeAnimation: "fade",
        deepSearch: true,
        minimumTime: 500,
        onComplete: function(){
	        $('body > #load').fadeOut(1000, function(){
		        $(this).remove();
	        });
        }
    });
	
	
	/*----------------------------------------------------*/
	// FLEXSLIDER
	/*----------------------------------------------------*/ 
	if ( window.BrowserDetect.browser === "Safari" ) {
		  $('.flexslider').flexslider({						
			animation: "slide",
			slideshow: false,
			slideshowSpeed: 3500,
			animationDuration: 500,
			directionNav: true,
			controlNav: false,						
			useCSS: false
		  });
	 }
	
	if ($('#testimonials-slider.flexslider').length){
		$('#testimonials-slider.flexslider').flexslider({						
			animation: "slide",
			slideshow: true,
			slideshowSpeed: 3500,
			animationDuration: 1000,
			directionNav: true,
			controlNav: true,
			smootheHeight:true,
			after: function(slider) {
			  slider.removeClass('loading');
			}
			
		});	
	}
	
	if ($('#slider1.flexslider').length || $('#slider2.flexslider').length){
		$('#slider1.flexslider, #slider2.flexslider').flexslider({						
			animation: "fade",
			slideshow: true,
			slideshowSpeed: 3500,
			animationDuration: 1000,
			directionNav: true,
			controlNav: true,
			smootheHeight:true,
			after: function(slider) {
			  slider.removeClass('loading');
			}
			
		});
	}
	
	if ($('#text-slider.flexslider').length){
		$('#text-slider.flexslider').flexslider({						
			animation: "slide",
			direction: "vertical",
			slideshow: true,
			slideshowSpeed: 3500,
			animationDuration: 1000,
			directionNav: false,
			controlNav: true,
			smootheHeight:true,
			after: function(slider) {
			  slider.removeClass('loading');
			}
		});	
	}
	
	if ($('#agency-slider.flexslider').length){
		$('#agency-slider.flexslider').flexslider({						
			animation: "fade",
			slideshow: true,
			slideshowSpeed: 3500,
			animationDuration: 1000,
			directionNav: false,
			controlNav: false,
			smootheHeight:true,
			after: function(slider) {
			  slider.removeClass('loading');
			}
			
		});		
	}
	
	/*----------------------------------------------------*/
	// MAKE VIDEOS RESPONSIVES
	/*----------------------------------------------------*/ 
	$(".video-wrapper").fitVids();
	
	$('.grid .figcaption a.thumb-link, .socialdiv a, .carousel-item a').tooltip()
	
		
	/*----------------------------------------------------*/
	// TABS Bootstrap INIT
	/*----------------------------------------------------*/
	$('#htabs a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  
	})
	$('#htabs a:first').tab('show')
	/*----------------------------------------------------*/
	// TABS Blog INIT
	/*----------------------------------------------------*/ 
	$("#blog-tabs").tytabs({
		tabinit:"1",
		fadespeed:"fast"
	});	
	$('.tabs li').eq(0).click();
	
	
	/*----------------------------------------------------*/
	// FLEXSLIDER
	/*----------------------------------------------------*/ 
	if ( window.BrowserDetect.browser === "Safari" ) {
		  $('.flexslider').flexslider({						
			animation: "slide",
			slideshow: false,
			slideshowSpeed: 3500,
			animationDuration: 500,
			directionNav: true,
			controlNav: false,						
			useCSS: false
		  });
	 }
	
	/* SCROLL TOP BUTTON */
	$("#back-top").hide();
	
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		$('#back-top a').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 1000);
			return false;
		});
	});
	
});

/*----------------------------------------------------*/
/* BLOG ISOTOPE
/*----------------------------------------------------*/
(function(e){"use strict";e.Isotope.prototype._getMasonryGutterColumns=function(){var e=this.options.masonry&&this.options.masonry.gutterWidth||0;var t=this.element.width();this.masonry.columnWidth=this.options.masonry&&this.options.masonry.columnWidth||this.$filteredAtoms.outerWidth(true)||t;this.masonry.columnWidth+=e;this.masonry.cols=Math.floor((t+e)/this.masonry.columnWidth);this.masonry.cols=Math.max(this.masonry.cols,1)};e.Isotope.prototype._masonryReset=function(){this.masonry={};this._getMasonryGutterColumns();var e=this.masonry.cols;this.masonry.colYs=[];while(e--){this.masonry.colYs.push(0)}};e.Isotope.prototype._masonryResizeChanged=function(){var e=this.masonry.cols;this._getMasonryGutterColumns();return this.masonry.cols!==e};e(document).ready(function(){var t=e(".journal");var n=0;var r=0;var i=function(){var e=parseInt(t.data("columns"));var i=t.data("gutterSpace");var s=t.width();var o=0;if(isNaN(i)){i=.02}else if(i>.05||i<0){i=.02}if(s<568){e=1}else if(s<768){e-=2}else if(s<991){e-=1;if(e<2){e=2}}if(e<1){e=1}r=Math.floor(s*i);var u=r*(e-1);var a=s-u;n=Math.floor(a/e);o=r;if(1==e){o=20}t.children(".journal-post").css({width:n+"px",marginBottom:o+"px"})};i();t.isotope({itemSelector:".journal-post",resizable:false,masonry:{columnWidth:n,gutterWidth:r}});t.imagesLoaded(function(){i();t.isotope({itemSelector:".journal-post",resizable:false,masonry:{columnWidth:n,gutterWidth:r}})});e(window).smartresize(function(){i();t.isotope({masonry:{columnWidth:n,gutterWidth:r}})});var s=e(".wc-shortcodes-filtering .wc-shortcodes-term");s.click(function(i){i.preventDefault();s.removeClass("wc-shortcodes-term-active");e(this).addClass("wc-shortcodes-term-active");var o=e(this).attr("data-filter");t.isotope({filter:o,masonry:{columnWidth:n,gutterWidth:r}});return false})})})(jQuery)


/*----------------------------------------------------*/
/* FULLSCREEN IMAGE HEIGHT
/*----------------------------------------------------*/	     
	  
function homeImgHeight(){
  var window_height = $(window).height();
  $('#home').css({'height':window_height});
}
homeImgHeight();
    
$(window).bind('resize',function() {
  homeImgHeight();
});	 




/*----------------------------------------------------*/
/* SELECT MENU ITEMS WITH WAYPOINTS
/*----------------------------------------------------*/
$(function() {
	var nav_container = $(".navbar");
	var nav = $(".navbar");
	var top_spacing = 0;
	var sections = $("section.nav-sections");
	var navigation_links = $(".nav a");
	
	sections.waypoint({
		handler: function(event, direction) {
			var active_section;
			active_section = $(this);
			if (direction === "up") active_section = active_section.prev();

			var active_link = $('.nav a[href="#' + active_section.attr("id") + '"]');
			/* window.location.hash = active_section.attr("id")+"/"; */
			navigation_links.removeClass("selected");
			active_link.addClass("selected");
		},
		offset: 80
	});
});

jQuery(window).load(function(){   
	
	/* menu navigation with scrollTop animation */
	$('a.nav-to[href*=#]:not([href=#])').each(function() {
		var $this = $(this);
		var isMenu = ($this.parents('.navbar').length) ? true : false;
		if ($this.children('.sub-arrow').length){
			$this.click(function(e){
				e.preventDefault();
				var target = $(this.hash);
			    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			    if (target.length) {
					if (!$this.children('.sub-arrow').is(':hover')){
						$('html,body').animate({
				          scrollTop: target.offset().top - 50
				        }, {
					        duration: 1000,
					        easing: "easeOutQuad",
					        complete: function(){
						        if ($('.navbar-toggle').is(':visible') && isMenu){
							        $('.navbar-toggle').trigger('click');
						        } 
					        }
				        });
					}
				}
			});
		} else {
			$this.click(function(e){
				e.preventDefault();
				var target = $(this.hash);
			    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			    if (target.length) {
					$('html,body').animate({
					  scrollTop: target.offset().top - 50
					}, {
						duration: 1200,
						easing: "easeOutQuad",
						complete: function(){
							if ($('.navbar-toggle').is(':visible') && isMenu){
								 $('.navbar-toggle').trigger('click');
							}
						}
					});			    
			    }
			});
		}
    });
    	
	/* fire the youtubeplayer ready event  */
	if ($(".player").length) { $(document).trigger("YTAPIReady"); }
	
	
	/* OWL carousels */
	if(jQuery().owlCarousel) { 
		if (jQuery("#services-carousel").length){
			jQuery("#services-carousel").owlCarousel({
	    		navigation : false,
				items : 3,
				itemsCustom : false,
				itemsDesktop : [1199,3],
				itemsDesktopSmall : [980,3],
				itemsTablet: [768,2],
				itemsTabletSmall: false,
				itemsMobile : [479,1],
			});			
		}
		if (jQuery("#logos-carousel").length){
			jQuery("#logos-carousel").owlCarousel({
	    		navigation : false,
				items : 6,
				autoPlay : 2000,
				stopOnHover : true,
				itemsCustom : false,
				itemsDesktop : [1199,4],
				itemsDesktopSmall : [980,3],
				itemsTablet: [768,3],
				itemsTabletSmall: false,
				itemsMobile : [479,2],
			});	
		}
		if (jQuery("#logos-carousel-noanimation").length){
			jQuery("#logos-carousel-noanimation").owlCarousel({
	    		navigation : false,
				items : 6,
				pagination : false,
				autoPlay : false,
				stopOnHover : true,
				itemsCustom : false,
				itemsDesktop : [1199,4],
				itemsDesktopSmall : [980,3],
				itemsTablet: [768,3],
				itemsTabletSmall: false,
				itemsMobile : [479,2],
			});
			
		}
	}
	
	/*----------------------------------------------------*/
	/* TWITTER CALLBACK FUNCTION
	/*----------------------------------------------------*/
	if ($('#twitter-feed').length) {
		$('#twitter-feed').tweet({
			username: 'DesignareThemes',
			join_text: 'auto',
			avatar_size: 0,
			count: 4
		});

		$('#twitter-feed').find('ul').addClass('slides');
		$('#twitter-feed').find('ul li').addClass('slide');
		$('#twitter-feed').contents().wrapAll('<div class="flexslider">');
	}

	// Twitter feed
	if ($('#twitter-widget').length) {
		$('#twitter-widget').tweet({
			username: 'DesignareThemes',
			join_text: 'auto',
			avatar_size: 0,
			count: 4
		});
	}

	$('.twitter-slider .flexslider').flexslider({						
		animation: "slide",
		slideshow: true,
		slideshowSpeed: 3500,
		animationDuration: 1000,
		directionNav: false,
		controlNav: true,
		smootheHeight:true,
		after: function(slider) {
			slider.removeClass('loading');
		}
	});
	
	/* BEGIN: ANIMATED CONTENTS */
	/* define if you want to display the contents animation (true|false) */
	var effectsOnMobiles = false;
	
	var doAnimations = false;
	if (isMobile.any() && effectsOnMobiles) doAnimations = true;
	if (isMobile.any() && !effectsOnMobiles) doAnimations = false;
	if (!isMobile.any()) doAnimations = true;
	
	if (isMobile.any()){
		$('.parallax').css('background-attachment','scroll');
		$('#intro-block .intro-text .intro-big').css('opacity', '1');
	} 
	
	if (doAnimations){
		$('.animated').each(function(e){
			var el = $(this);
			var classes = $(el).attr('class').split(" ");
			var delay = false;
			for (var i=0; i<classes.length; i++){
				if (classes[i].indexOf("delay-") > -1){
					delay = classes[i].slice(6,classes[i].length)/1000;
				}
			}
			if (window.BrowserDetect.browser === "Explorer" && window.BrowserDetect.version < 10){
				$(el).removeClass(effect).addClass('notinview').css({
					opacity: 0
				});
				$(el).waypoint({
					handler: function() {
						if ($(this).hasClass('notinview')){
							$(this).removeClass('notinview');	
							var elem = $(this);
							setTimeout(function(){
								$(elem).animate({
									opacity: 1
								}, 1000);
							}, delay*1000);
						}
					},
					offset: '95%',
					triggerOnce: true
				}, function(){ $.waypoints("refresh"); });
			} else {
				var effect = getEffect($(el));
				$(el).removeClass(effect).addClass('notinview').css({
					'-webkit-animation-delay': delay+'s',
					'-moz-animation-delay': delay+'s',
					'animation-delay': delay+'s',
					opacity: 0
				});
				$(el).waypoint({
					handler: function() {
						if ($(this).hasClass('notinview')){
							$(this).addClass(effect).removeClass('notinview');	
							$(this).css('opacity', 1);	
						}
					},
					offset: '75%',
					triggerOnce: true
				}, function(){ $.waypoints("refresh"); });	
			}
		});
	}
	  
});

function getEffect(el){
	var effects = ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "tada", "wobble", "bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig", "fadeOutUp", "fadeOutUpBig", "flip", "flipInX", "flipInY", "flipOutX", "flipOutY", "lightSpeedIn", "lightSpeedOut", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "slideInDown", "slideInLeft", "slideInRight", "slideOutLeft", "slideOutRight", "slideOutUp", "hinge", "rollIn", "rollOut"]
	var effect = false;
	for (var i=0; i<effects.length; i++){
		if (el.hasClass(effects[i])) {
			effect = effects[i];
		} 
	}
	effect = effect.toString();
	return effect;
}


/*----------------------------------------------------*/
/* PARALLAX STUFF
/*----------------------------------------------------*/		
$(window).bind('load', function() { 
							  
	parallaxInit();	
	$.waypoints("refresh");
	var t=setTimeout(function(){$.waypoints("refresh");},3000);
	
	if ((window.BrowserDetect.browser === "Mozilla" && window.BrowserDetect.version == 11) || window.BrowserDetect.browser === "Explorer" && window.BrowserDetect.version == 10){
		$('.team img').each(function(){ $(this).hoverizr(); });
		$('.team canvas').css('left','2px');
	}
	
	if (window.BrowserDetect.browser === "Explorer"){
		$('.gm-style img').css('max-width','1000px');
	}
	
});


function parallaxInit(){
	if (!isMobile.any()){
		if (window.BrowserDetect.browser === "Safari"){
			$('#parallax-home').removeAttr('data-stellar-background-ratio');
		}
		if ($('.parallax').length || $('#parallax-home').length) $.stellar({responsive: true,  scrollProperty: 'scroll'});
	}
}

/*----------------------------------------------------*/
/* ACCORDION
/*----------------------------------------------------*/
(function() {
	var $container = $('.acc-container'),
		$trigger   = $('.acc-trigger');

	$container.hide();
	$trigger.first().addClass('active').next().show();

	var fullWidth = $container.outerWidth(true);
	$trigger.css('width', fullWidth);
	$container.css('width', fullWidth);
	
	$trigger.on('click', function(e) {
		if( $(this).next().is(':hidden') ) {
			$trigger.removeClass('active').next().slideUp(300);
			$(this).toggleClass('active').next().slideDown(300);
		}
		e.preventDefault();
	});
	// Resize
	$(window).on('resize', function() {
		fullWidth = $container.outerWidth(true)
		$trigger.css('width', $trigger.parent().width() );
		$container.css('width', $container.parent().width() );
	});
})();

/*----------------------------------------------------*/
/* TABS Blog
/*----------------------------------------------------*/
(function($){$.fn.tytabs=function(options){var defaults={prefixtabs:"tab",prefixcontent:"content",classcontent:"tabscontent",tabinit:"1",catchget:"tab",fadespeed:"normal"},opts=$.extend({},defaults,options);return this.each(function(){var obj=$(this);opts.classcontent="."+opts.classcontent;opts.prefixcontent="#"+opts.prefixcontent;function showTab(id){$(opts.classcontent,obj).stop(true,true);var contentvisible=$(opts.classcontent+":visible",obj);if(contentvisible.length>0){contentvisible.fadeOut(opts.fadespeed,function(){fadeincontent(id)})}else{fadeincontent(id)}$("#"+opts.prefixtabs+opts.tabinit).removeAttr("class");$("#"+opts.prefixtabs+id).attr("class","current");opts.tabinit=id}function fadeincontent(id){$(opts.prefixcontent+id,obj).fadeIn(opts.fadespeed)}$("ul.tabs li",obj).click(function(){showTab($(this).attr("id").replace(opts.prefixtabs,""));return false});var tab=getvars(opts.catchget);showTab(((tab&&$(opts.prefixcontent+tab).length==1)?tab:($(opts.prefixcontent+opts.tabinit).length==1)?opts.tabinit:"1"))})};function getvars(q,s){s=(s)?s:window.location.search;var re=new RegExp("&"+q+"=([^&]*)","i");return(s=s.replace(/^\?/,"&").match(re))?s=s[1]:s=""}})(jQuery);

/*----------------------------------------------------*/
/* Classie
/*----------------------------------------------------*/
( function( window ) {
	'use strict';
	function classReg( className ) {
	  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}
	var hasClass, addClass, removeClass;
	
	if ( 'classList' in document.documentElement ) {
	  hasClass = function( elem, c ) {
	    return elem.classList.contains( c );
	  };
	  addClass = function( elem, c ) {
	    elem.classList.add( c );
	  };
	  removeClass = function( elem, c ) {
	    elem.classList.remove( c );
	  };
	}
	else {
	  hasClass = function( elem, c ) {
	    return classReg( c ).test( elem.className );
	  };
	  addClass = function( elem, c ) {
	    if ( !hasClass( elem, c ) ) {
	      elem.className = elem.className + ' ' + c;
	    }
	  };
	  removeClass = function( elem, c ) {
	    elem.className = elem.className.replace( classReg( c ), ' ' );
	  };
	}
	
	function toggleClass( elem, c ) {
	  var fn = hasClass( elem, c ) ? removeClass : addClass;
	  fn( elem, c );
	}
	
	var classie = {
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass,
	  toggleClass: toggleClass,
	  has: hasClass,
	  add: addClass,
	  remove: removeClass,
	  toggle: toggleClass
	};
	
	if ( typeof define === 'function' && define.amd ) {
	  define( classie );
	} else {
	  window.classie = classie;
	}
})( window );

/*----------------------------------------------------*/
/* ANIMATE HEADER
/*----------------------------------------------------*/
var cbpAnimatedHeader = (function() {
	var docElem = document.documentElement,
		header = document.querySelector( '.navbar' ),
		didScroll = false,
		changeHeaderOn = 300;

	function init() {
		window.addEventListener( 'scroll', function( event ) {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false );
	}

	function scrollPage() {
		var sy = scrollY();
		if ( sy >= changeHeaderOn ) {
			classie.add( header, 'navbar-shrink' );
			$('.hide-on-start.oldie').animate({ top: '0px' },1000);
		}
		else {
			if (!$('body').hasClass('multipage')) {
				classie.remove( header, 'navbar-shrink' );
			}
			$('.hide-on-start.oldie').animate({ top: '-300px' },1000);
		}
		didScroll = false;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();

/*----------------------------------------------------*/
/* WAYPOINTS SCROLL INTO VIEW
/*----------------------------------------------------*/
function isScrolledIntoView(id){
    var elem = "#" + id;
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    if ($(elem).length > 0){
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
    }

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
      && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
}
function incrementNumerical(id, percent, speed){
	setTimeout(function(){
		var newVal = parseInt($(id+' .value').html(),10)+speed;

		if (newVal > percent) newVal = percent;
		$(id+' .value').html(newVal);
		if (newVal < percent){
			incrementNumerical(id, percent, speed);
		}
	}, 1);
}