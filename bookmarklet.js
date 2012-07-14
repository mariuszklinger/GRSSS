var jslib = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
script = document.createElement('script');
script.src = jslib;
script.onload = script.onreadystatechange = function(){
	jQuery.noConflict();
	jQuery(function(){

		var min_values = [5, 10, 50, 100, 500, 1000];
		
		// function check if passed e.href.domain == href.domain from header
		var proxyExist = function(e){
			return jQuery("#chrome-title a").attr("href").split("/")[2] != e.attr("href").split("/")[2];
		};
		
		var portals = [
			{
				label: "FB",
				url: "https://graph.facebook.com/",
				search: function(amount){
				
					jQuery("#entries .entry").each(function(d, e){
					
							if(jQuery(e).attr("shares")){
							
								if(jQuery(e).attr("shares") >= amount){
									jQuery(".collapsed", e).css("background-color", "#D979C7");
								}
								
								return;
							}
					
							var callback = function(url){
								jQuery.ajax({
									url: "https://graph.facebook.com/" + url,
									crossDomain: true,
									dataType: "json",
									success: function(data) {
										jQuery(e).attr("shares", data.shares);
										
										if(("shares" in data) && (data.shares >= amount)){
											jQuery(".collapsed", e).css("background-color", "#D979C7");
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
						}
					);
				}
			},
			{
				label: "TW",
				url: "http://urls.api.twitter.com/1/urls/count.json?callback=?&url=",
				search: function(amount){
					
					jQuery("#entries .entry").each(function(d, e){
					
							var callback = function(url){
							
								jQuery.getJSON("http://urls.api.twitter.com/1/urls/count.json?url=" + url + "&callback=?", function(data){
									if(("count" in data) && (data.count >= amount)){
										jQuery(".collapsed", e).css("background-color", "blue");
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
						}
					);
				}
			}
		];
		
		// events
		var select_box = jQuery("<select></select>");
		var select_box_string = "";
		
		// add blank option
		select_box.append(jQuery("<option></option>"));
		
		for(var p in portals){
			for(var c in min_values){
				var current_option = jQuery("<option>" + portals[p].label + " > " + min_values[c] + "</option>");
				
				var getClickCallback = function(a, p){
					return function(){
						p.search(a, p);
					}
				}
				current_option.click(getClickCallback(min_values[c], portals[p]));
				
				select_box.append(current_option);
			}
		}
		
		var select_box_wrapper = jQuery("<div>").append(select_box);
		select_box_wrapper.attr("class", jQuery("#viewer-refresh").attr("class"));
		
		jQuery("#viewer-refresh").after(select_box_wrapper);
	});

}

document.body.appendChild(script);
void(0);