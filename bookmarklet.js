var jslib = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
script = document.createElement('script');
script.src = jslib;
script.onload = script.onreadystatechange = function(){

	jQuery.noConflict();
	jQuery(function(){
		
		// function return color for given points
		var getColorForAmount = function(a){
			
			var colors = [
				{ amount: 100,	color: "#FF0000",},
				{ amount: 50,	color: "#FF4000",},
				{ amount: 20,	color: "#FF7700",},
				{ amount: 10,	color: "#FF9500",},
				{ amount: 5,	color: "#FFBF00",},
				{ amount: 0,	color: "#FFFF00",},
			];
			
			for(var c in colors){
				if(a >= colors[c].amount){
					return colors[c].color;
				}
			}
			
			return colors[colors.length].color;
		};
		
		// function check if passed e.href.domain == href.domain from header
		var proxyExist = function(e){
			return (jQuery("#chrome-title a").length) ? jQuery("#chrome-title a").attr("href").split("/")[2] != e.attr("href").split("/")[2] : false;
		};
		
		// simple bubble sort
		var sortRows = function(attr){
			jQuery("#entries .entry").each(function(d, el){
				var currentElement = jQuery(el);
				
				while(parseInt(currentElement.prev().attr(attr)) < parseInt(currentElement.attr(attr))) {
				   currentElement.prev().before(currentElement);
				};
			});
		};
		
		var showAjaxLoader = function(buttonNode){
			jQuery("img", buttonNode).attr("src", "http://i.imgur.com/qOFiG.gif");
		}
		
		var showLogo = function(buttonNode, favicon){
			jQuery("img", buttonNode).attr("src", favicon);
		}
		
		// function sets "pointsAttr" to each row
		var getPoints = function(portalObj, buttonNode){
		
			var apiurl = portalObj.apiurl;
			var pointsAttr = portalObj.pointsAttr;
			var favicon = portalObj.favicon;
			
			// number of active ajax request
			var AJAX_REQUEST = 0;
			
			jQuery("#entries .entry").each(function(d, e){
			
				showAjaxLoader(buttonNode);
				
				(function(){
				
					var points = jQuery(e).attr(pointsAttr) || 0;
				
					if(jQuery(e).attr(pointsAttr) !== undefined){
						sortRows(pointsAttr);
						jQuery(".collapsed", e).css("background-color", getColorForAmount(points));
						return;
					}
				
					var callback = function(url){
						
						AJAX_REQUEST++;
						
						try{
							jQuery.ajax({
								url: apiurl + url,
								crossDomain: true,
								dataType: "json",
								success: function(data) {
								
									var points = data[pointsAttr] || 0;
									jQuery(e).attr(pointsAttr, points);
									
									jQuery(".entry-title", e).html("[" + "<img style=\"margin-bottom: -3px\" src=\"" + favicon + "\">" + points + "] " + jQuery(".entry-title", e).html());
									jQuery(".collapsed", e).css("background-color", getColorForAmount(points));

									AJAX_REQUEST--;
									if(AJAX_REQUEST == 0){
										sortRows(pointsAttr);
										showLogo(buttonNode, favicon);
									}
								},
							});
						}catch(e){
							// twitter sometimes generate error...
							AJAX_REQUEST--;
						}
					}
					
					if(proxyExist(jQuery(".entry-original", e))){
						jQuery.getJSON("http://json-longurl.appspot.com/?url=" + jQuery(".entry-original", e).attr("href") + "&callback=?", function(data){
							callback(data.url);
						});
					}
					else{
						callback(jQuery(".entry-original", e).attr("href"))
					}
				})();
			});
		};
		
		var portals = [
			{
				label: "Facebook.com",
				apiurl: "https://graph.facebook.com/",
				favicon: "https://s-static.ak.facebook.com/rsrc.php/yi/r/q9U99v3_saj.ico",
				pointsAttr: "shares",
			},
			{
				label: "Twitter.com",
				apiurl: "http://urls.api.twitter.com/1/urls/count.json?callback=?&url=",
				favicon: "https://twitter.com/favicons/favicon.ico",
				pointsAttr: "count",
			}
		];
		
		var button = null;
		for(var p in portals){
		
			button = jQuery("<div id=\"\" class=\"goog-inline-block jfk-button jfk-button-standard viewer-buttons\"><img class=\"jfk-button-img\" src=\"" + portals[p].favicon + "\" /></div>");
			button.click((function(p, b){
			
					return function(){
						getPoints(p, b)
					}
				})(portals[p], button));
			
			jQuery("#viewer-refresh").before(button);
		}
		
	});

}

document.body.appendChild(script);
void(0);