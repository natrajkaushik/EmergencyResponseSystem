 $(document).ready(function(){

  var currentUser;

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

	var lastUpdate = new Date();
	var allMarkers = [];

  function autoUpdate() {
    	$.ajax({
        	type: "GET",
        	url: "/locations/?mobile=" + encodeURIComponent(currentUser) + "&timestamp=" + lastUpdate,
        	dataType: 'json'
      }).done(function(jsonData){
        console.log(jsonData);
        // 1. Check if jsonData is empty. If empty skip to 4.
        //    Else we received some fresh data.
        if(!jQuery.isEmptyObject(jsonData)) {

          // 2. Update lastUpdate from the jsonData with the timestamp from
          //    the server. Don't use JavaScript to update the timestamp,
          //    because the time on the client and on the server will
          //    never be exactly in sync.

          lastUpdate = jsonData.timestamp;

          // 3. Add new markers on Google Map.
          var locations = jsonData.locations;
          
          $.each(locations, addMarker);

          for(var i=0; i < allMarkers.length; i++) {
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
    	map.setZoom(map.getZoom());
      	var location = new google.maps.LatLng(raw_location[0],raw_location[1]);
      	marker = new google.maps.Marker({
        	position: location,
        	map: map,
        	icon: finish
      	});
      	allMarkers.push(marker);
      	map.panTo(location);
    };

    initialize();
   

    var userData;

    var getUsers = function(){
      $.ajax({
        url: "/users",
          type: "GET",
      }).done(function(data){
        if(data && data.length){
          userData = data;
          for(var i = 0; i < data.length; i++){
             $('.selectpicker').append($("<option></option>").attr("value",data[i].name).attr("id", data[i].mobile).text(data[i].name)); 
             $("#user-container").append(getUserInfoHTML(data[0]));
             currentUser = data[0].mobile;
             autoUpdate();
          }
        }
        $('.selectpicker').selectpicker();
      });  
    };

    getUsers();

    var getUserInfoHTML = function(data){
      var html =  "<div id=\"user-info-container\" class=\"container\">" + 
        "<div class=\"row\">" + 
            "<div id=\"user-info\" class=\"col-xs-12 col-sm-6 col-md-6\">" +
            "<div class=\"well well-sm\">" + 
                "<div class=\"row\">" + 
                    "<div class=\"col-sm-6 col-md-4\">" + 
                        "<img src=" + data.imageUrl + " class=\"img-rounded img-responsive\" />"+
                    "</div>" + 
                    "<div class=\"col-sm-6 col-md-8\">" + 
                        "<h4>" + data.name + 
                          "</h4>" + 
                        "<small><cite title=\"Atlanta, USA\">" + data.mobile + "<i class=\"glyphicon glyphicon-map-marker\">" + 
                        "</i></cite></small>" + 
                        "<p>" + 
                            "<i class=\"glyphicon glyphicon-envelope\"></i>" + data.email + "<br />" +                            
                        "</div>" + 
                    "</div>" +
                "</div>" + 
            "</div>" + 
        "</div>" + 
      "</div>";

      return html;
    };

    /* Displaying user info on select */
    $(".selectpicker").change(function(){
      $( "select option:selected" ).each(function() {
        $("#user-info-container").remove();

        var id = $(this).attr("id");
        currentUser = id;
        for(var j = 0; j < userData.length; j++){
          if(userData[j].mobile === id){
            $("#user-container").append(getUserInfoHTML(userData[j]));
          }
        }
      });
    });

});