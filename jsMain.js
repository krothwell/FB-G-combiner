/*global window*/
$(window).load(function () {
    
    /* initial position of left hand nav */
    var aimsParaOffset = $("#aimsP").offset().top;
    function positionSideNav() {
        $( "#sideNav" ).css("top", aimsParaOffset + "px");
    }
    
    positionSideNav();
    
    $(window).scroll(function () {
        aimsParaOffset = $("#aimsP").offset().top;
        var welcomeH2position = $("#welcomeH2").offset().top;
        var aimsH2position = $("#aimsH2").offset().top;
        var scrollTop = $(window).scrollTop()
        
        /* set left hannd nav to fixed position from top of
        page if aims section h2 passes optimal position */
    	if((aimsH2position - scrollTop) < welcomeH2position) {
			if ($( "#sideNav" ).css("position") === "absolute") {
				$( "#sideNav" ).css("position", "fixed");
				$( "#sideNav" ).css("top", "9.91em");
        	}
    	}
        
        /* set left hand nav back to original position if user
        scrolls up under aims section h2 optimal position */
		if((aimsH2position - scrollTop) > welcomeH2position) {
			if ($( "#sideNav" ).css("position") === "fixed") {
				$( "#sideNav" ).css("position", "absolute");
                aimsParaOffset = $("#aimsP").offset().top;
				$( "#sideNav" ).css("top", aimsParaOffset + "px");
        	}
    	}
    });
    
    /** the resize listener functions below are used because when
        the css is set to hide the welcome navigation when selecting
        an option from hamburger menu, if the width of the window is then 
        increased to default the css back with the media query, it
        does not change the css back to display the navigation.*/    
    $( window ).resize(function() {
        if($(window).width()>650){
            if($( "#welcomeNav" ).css("display") === "none"){
                $( "#welcomeNav" ).css("display", "block");
            }
        }
        if($(window).width()<650){
            if($( "#welcomeNav" ).css("display") === "block"){
                $( "#welcomeNav" ).css("display", "none");
            }
        }
    });
    
    /*smooth scroll to top of page */    
	$("a[href='#topAnchor']").click(function(){
		$('html, body').animate({
			scrollTop: $( $(this).attr('href') ).offset().top
		}, 500);
		return false;
		});
    
    /*smooth scroll to anchor */
    $("a").click(function(){
        if($(window).width() < 650){
            $( "#welcomeNav" ).css("display", "none");
        }
		$('html, body').animate({
			scrollTop: $( $(this).attr('href') ).offset().top
		}, 500);
		return false;
		});
    
    /*display welcome navigation when hamburger menu selected*/
    $("#hamburger").click(function(){
		$( "#welcomeNav" ).css("display", "block");
    })
})
