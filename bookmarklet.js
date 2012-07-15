var jslib = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
script = document.createElement('script');
script.src = jslib;
script.onload = script.onreadystatechange = function(){

	jQuery.noConflict();
	jQuery(function(){
		
		// function return color for given points
		var getColorForAmount = function(a){
			var colors = ["#FF0000", "#FF4000", "#FF7700", "#FF9500", "#FFBF00", "#FFFF00"];
			var amount = [100, 50, 20, 10, 5, 0];
			
			for(var am in amount){
				if(a >= amount[am]){
					return colors[am];
				}
			}
			
			return colors[colors.length];
		
		};
		
		// function check if passed e.href.domain == href.domain from header
		var proxyExist = function(e){
			return (jQuery("#chrome-title a").length) ? jQuery("#chrome-title a").attr("href").split("/")[2] != e.attr("href").split("/")[2] : false;
		};
		
		// simple bubble sort
		var sortRows = function(attr){
			jQuery("#entries .entry").each(function(d, el){
				while(parseInt(jQuery(el).prev().attr(attr)) < parseInt(jQuery(el).attr(attr))) {
				   jQuery(el).prev().before(jQuery(el));
				};
			});
		};
		
		// function sets "pointsAttr" to each row
		var getPoints = function(portalObj){
		
			var apiurl = portalObj.apiurl;
			var pointsAttr = portalObj.pointsAttr;
			var favicon = portalObj.favicon;
			
			// number of active ajax request
			var AJAX_REQUEST = 0;
			
			jQuery("#entries .entry").each(function(d, e){
				(function(){
				
					if(jQuery(e).attr(pointsAttr)){
						sortRows(pointsAttr);
						jQuery(".collapsed", e).css("background-color", getColorForAmount(jQuery(e).attr(pointsAttr)));
						return;
					}
				
					var callback = function(url){
						
						AJAX_REQUEST++;
						
						jQuery.ajax({
							url: apiurl + url,
							crossDomain: true,
							dataType: "json",
							success: function(data) {
								jQuery(e).attr(pointsAttr, data[pointsAttr] || 0);
								jQuery(".entry-title", e).html("[" + "<img style=\"margin-bottom: -3px\" src=\"" + favicon + "\">" + (data[pointsAttr] || 0) + "] " + jQuery(".entry-title", e).html());
								
								jQuery(".collapsed", e).css("background-color", getColorForAmount(data[pointsAttr] || 0));
								
								AJAX_REQUEST--;
								if(AJAX_REQUEST == 0){
									sortRows(pointsAttr);
								}
							}
						});
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
		
		var getClickCallback = function(p){
			return function(){
				getPoints(p);
			}
		}
		
		for(var p in portals){
		
			button = jQuery("<div class=\"goog-inline-block jfk-button jfk-button-standard viewer-buttons\"><img class=\"jfk-button-img\" src=\"" + portals[p].favicon + "\" /></div>");
			button.click(getClickCallback(portals[p]));
			
			jQuery("#viewer-refresh").before(button);
		}
		
	});

}

document.body.appendChild(script);
void(0);