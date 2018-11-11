/* this file creates initial objects are starts postOffice object to
collect APIs. Also contains some site functionality. */

window.onload = function () {
    var postman = new Postman();
    var postOffice = new PostOffice(postman);
    publisher = new Publisher();
    postOffice.startWork();

    /* when user scrolls, thetop of the window is compared to the height of
    the main header. If it exceeds the height then the nav becomes fixed to the
    top of the screen, if the user scrolls back up above the header it returns 
    to its original position*/
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        var headerHeight = $("#mainHeader").height();
    	if(scrollTop > headerHeight) {
			if ($( "nav" ).css("position") != "fixed") {
				$( "nav" ).css("position", "fixed");
                $( "nav" ).css("top", "0");
                //gap is filled by increasing margin to keep anchor links on target
                $( "#mainHeader" ).css("margin-bottom", "5vh");
                
        	}
    	}
        if(scrollTop < headerHeight) {
			if ($( "nav" ).css("position") == "fixed") {
				$( "nav" ).css("position", "relative");
                $( "nav" ).css("top", "auto");    
                //margin returned if header is returned to start position
                $( "#mainHeader" ).css("margin-bottom", "0vh");
        	}
    	}
    });
    
    // nav buttons link to appropriate functions in Publisher.js
    $("#prevA").click(function(event){		
        navPrevPost();
    });

    $("#returnA").click(function(event) {
        navReturn();
    }); 

    $("#nextA").click(function(event){		
        navNextPost();
    });
}

