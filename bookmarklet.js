var jslib = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
script = document.createElement('script');
script.src = jslib;
script.onload = script.onreadystatechange = function(){
	jQuery.noConflict();
	jQuery(function(){

		var min_values = [10, 50, 100, 500, 1000, 10000];
		
		// function check if passed e.href.domain == href.domain from header
		var proxyExist = function(e){
			return jQuery("#chrome-title a").attr("href").split("/")[2] != e.attr("href").split("/")[2];
		};
		
		var expandURL = function(url){
			var expanded;
			/*
			jQuery.ajax({
				
				url: "http://json-longurl.appspot.com/?url=" + url,
				//url: "http://therealurl.appspot.com/?format=json&url=" + url,
				crossDomain: true,
				dataType: "json",
				async: false,
				success: function(data) {
					expanded = data.url;
				}
			});
			*/
			
			jQuery.getJSON("http://json-longurl.appspot.com/?url=" + url + "&callback=?", function(data){
				
					expanded = data.url;
			});
			
			return expanded;
		};
		
		var portals = [
			{
				label: "FB",
				url: "https://graph.facebook.com/",
				search: function(amount){
				
					jQuery("#entries .entry").each(function(d, e){
					
							var callback = function(url){
								jQuery.ajax({
									url: "https://graph.facebook.com/" + url,
									crossDomain: true,
									dataType: "json",
									success: function(data) {
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
			/*
			{
				label: "TW",
				url: "",
				search: function(amount){
					// TODO
					console.info("TWITTER TO DO");
				}
			}
			*/
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