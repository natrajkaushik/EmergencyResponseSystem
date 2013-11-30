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
});