 $(document).ready(function(){

 	var assignEventHandlers = function(){
 		$("#logoutLnk").click(function(){
			$.ajax({
				url: "/logout",
	    		type: "POST",
	 		}).done(function(data){
	 			window.location = "/login";
	 		});
		});
 	};
	
	assignEventHandlers();

	var lastUpdate = '0';
	var allMarkers = [];

    function autoUpdate() {
    	$.ajax({
        	type: "GET",
        	url: "/locations",
        	dataType: 'json'
        }).done(function(jsonData){
    			// 1. Check if jsonData is empty. If empty skip to 4.
          		//    Else we received some fresh data.
          		//
          		console.log(jsonData);
          		if(!jQuery.isEmptyObject(jsonData)) {

            		// 2. Update lastUpdate from the jsonData with the timestamp from
            		//    the server. Don't use JavaScript to update the timestamp,
            		//    because the time on the client and on the server will
            		//    never be exactly in sync.
            		//

            		lastUpdate = jsonData.timestamp;

            		// 3. Add new markers on Google Map.
            		//

            		var locations = jsonData.locations;


            		$.each(locations, addMarker);

            		for (var i=0; i < allMarkers.length; i++) {
						if (i == 0) {
                			allMarkers[i].setIcon(start)
              			}

              			else if (i == allMarkers.length - 1) {
                			allMarkers[i].setIcon(finish)
              			}

              			else {
							allMarkers[i].setIcon(path)
              			}	
            		}

				}
          		// 4. Relaunch the autoUpdate() function in 5 seconds.
          		setTimeout(autoUpdate, 5000);
        	});
    }

    var map;
    var start = './images/start.png';
    var finish = './images/finish.png';
    var path = './images/path.png';

    function initialize() {
    	var gatech = new google.maps.LatLng(33.77658,-84.38993);
      	var mapOptions = {
        	zoom: 15,
        	center: gatech,
        	mapTypeId: google.maps.MapTypeId.ROADMAP
      	};
      	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    };

    // Function for adding a marker to the page.
    function addMarker(index, raw_location) {
    	map.setZoom(10);
      	var location = new google.maps.LatLng(raw_location[0],raw_location[1]);
      	console.log(location)
      	marker = new google.maps.Marker({
        	position: location,
        	map: map,
        	icon: finish
      	});
      	allMarkers.push(marker);
      	map.setZoom(15); // Zoom in after 1 sec
      	map.panTo(location);
    };

    initialize();
    autoUpdate();

});