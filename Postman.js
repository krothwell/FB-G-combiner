/* postMan makes all api calls*/

function Postman () {
    
    this.aSynchOn = true;
    
    /* address parameter is used to make api call, returnPosts is the function that
    the data is delivered to, instruction 1 and 2 provide further parameters, used
    if the function the data returned to requires args passed to them */
    this.getPosts = function (address, returnPosts, instruction, instruction2) {
		var qryData = new XMLHttpRequest();
        if (typeof returnPosts == 'undefined')
		{
			console.log("Error: return function is undefined");
		}
		if (typeof instruction === 'undefined')
        {
            qryData.addEventListener('load', returnPosts);
        }
        else if (typeof instruction2 === 'undefined')
        {
        	qryData.addEventListener('load', function() {
        	returnPosts(this, instruction);
            });
        }
        else {
            qryData.addEventListener('load', function() {
        	returnPosts(this, instruction, instruction2);
            });
        }
		qryData.open(
			'GET', 
			address,
            this.aSynchOn
		);
		qryData.send();
        
    }
    
    /* works in the same way as getPosts but uses jquery to request JSONP */
    this.getPostsAjax = function (address, returnPosts, instruction) {
        //console.log("instruction: " + instruction);
        //console.log("getPostsAjax: Attempting GET from " + address);
        $.ajax({
            type: 'GET',
            url: address,
            data: {},
            dataType: 'jsonp',
            success: function(response) 
            { 
                returnPosts(response, instruction);
            }
        });
    }
    
    this.toString = function (address) {
        this.getPosts(this.printToConsole, address);
    }
    
    this.printToConsole = function () {
        console.log(this.response);
    }
    
    this.setAsynch = function (trueFalse) {
        this.aSynchOn = trueFalse;
    }
}
