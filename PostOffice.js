/*PostOffice class is used to create an object which gathers and organises data of all posts, 
before sorting the data and passing it to the Publisher object.*/

function PostOffice(assignedPostman) {
    
    var postOffice = this; //this is lost in call backs so postOffice is used to refer to object instead.
    this.postman = assignedPostman;
    this.actorName;
	this.postLimit = 5;
    this.fbToken;
    this.postBoxes = {};
    this.postBoxesArray;
    this.monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                     ];
    this.fbPageID = "146701909019052";
    
    /*Starts post office, collects and arranges posts for news section of site
    before sending to the printer to put on page*/
    this.startWork = function () {
        this.getFbToken(postOffice.getFbPosts);
    };
	
    /* creates the address to get post data from google+ api and sends postman to
    get the data with callback function */
	this.getGooglePosts = function () {
		var googleAPIkey = 'AIzaSyAiKOVRPDKdDwXjr9Y5iksMZpbxr9uYQdU';
		var googlePageID = '116644372426775223925';
		var postAddress = 'https://www.googleapis.com/plus/v1/people/'
						+ googlePageID
						+ '/activities/public?key='
						+ googleAPIkey;
		postOffice.postman.getPosts(postAddress, postOffice.setTier1gpPosts);
	}
    
    /*requests token to use when requesting posts on facebook page*/
    this.getFbToken = function(startNextDuty) {
        var fbSecret = "100c3b85378fa7b559ec68eb7ea8c2b3"; 
		var fbID = '1656586657952204';
        var fbTokenAddress = 
            "https://graph.facebook.com/"
			+ "oauth/access_token?grant_type=client_credentials&client_id=" 
            + fbID 
            + "&client_secret=" 
            + fbSecret;
        postOffice.postman.getPosts(fbTokenAddress, startNextDuty);
		
    }
   	
    /* Facebook api token is retrieved and used to make call to graph api
    and get posts.*/
	this.getFbPosts = function() 
    {
		postOffice.fbToken = this.response;
        var postsAddress = 
            'https://graph.facebook.com/'
			+ postOffice.fbPageID
			+ "/posts?"
            + postOffice.fbToken;
        postOffice.postman.getPosts(postsAddress, postOffice.setTier1fbPosts);
    }
    
    /* receives facebook post data and parses it and passes as arg to getFbPostsInfo.
    calls getGooglePosts which starts data collection from Google apis. */
    this.setTier1fbPosts = function () 
    {
        var fbPosts;
        fbPosts = JSON.parse(this.response);
        var fbPosts = fbPosts.data;
		postOffice.getFbPostsInfo (fbPosts, 0, 1);
        postOffice.getGooglePosts();
	}
    
    /*receives post data and parses then passes data
    to getGpPostsInfo, with index and tier 1 then calls sortPostBoxes */
    this.setTier1gpPosts = function () 
    {
        var gpPosts;
        gpPosts = JSON.parse(this.response);
        var gpPosts = gpPosts.items;
		postOffice.getGpPostsInfo (gpPosts, 0, 1);
        postOffice.sortPostBoxes();
	}
    
    /*receives comment data and parses then passes data
    to getFbPostsInfo, with index and tier 2 and the
    parent Post object the comment will be stored in*/
	this.setTier2fbPosts = function (posts, parentPost) 
    {
		var fbPosts;
		fbPosts = JSON.parse(posts.response);
        var commentCount = fbPosts.summary.total_count;
        parentPost.setReplyInt(commentCount);
		var fbPosts = fbPosts.data;
		postOffice.getFbPostsInfo (fbPosts, 0, 2, parentPost);
	}
    
    /*receives comment data and parses then passes data
    to getGpPostsInfo, with index and tier 2 and the
    parent Post object the comment will be stored in*/
    this.setTier2GpPosts = function (posts, parentPost) 
    {
		var gpPosts;
        gpPosts = JSON.parse(posts.response);
		gpPosts = gpPosts.items;
		postOffice.getGpPostsInfo (gpPosts, 0, 2, parentPost);
	}
    
    /*receives comment replies data and parses, then passes data
    to getFbPostsInfo, with index and tier 3 and the
    parent PostReply object the comment reply will be stored in*/
	this.setTier3fbPosts = function (posts, parentPost) 
    {
		var fbPosts;
		fbPosts = JSON.parse(posts.response);
		var fbPosts = fbPosts.data;
		postOffice.getFbPostsInfo (fbPosts, 0, 3, parentPost);
	}
	
    /* receives parsed facebook data and cycles through each object, calling method
    to store required data on object properties.*/
	this.getFbPostsInfo = function(messageArray, index, tier, parentPost)
	{
		if (index == messageArray.length)
		{
			return
		}

        var msg = messageArray[index].message;
		//filter out anything that isn't a status update
		if(typeof msg != 'undefined')
			{
				postOffice.setFbPostData(messageArray[index], tier, parentPost);
			}
		postOffice.getFbPostsInfo(messageArray, index+1, tier, parentPost);
	}
	
    /* receives parsed Google+ data and cycles through each object, calling method
    to store required data on object properties.*/
    this.getGpPostsInfo = function(messageArray, index, tier, parentPost)
	{
		if (index == messageArray.length)
		{
			return
		}
        var msg = messageArray[index].kind;
		//filter out anything that isn't a status update
		if (msg == "plus#activity" || msg == "plus#comment")
			{
				postOffice.setGpPostData(messageArray[index], tier, parentPost);
			}
		postOffice.getGpPostsInfo(messageArray, index+1, tier, parentPost);
        
        if (tier == 1)
        {
            
        }
	}
    
    /* takes parsed facebook post objects and dissassembles the data to fit one of the required formats
    and stores in a postBox, then makes further API calls where data is not available 
    from the post object: 
    
    if tier == 1 (Post): calls for comments and images 
    at tier == 2 (PostReply): calls for a profile image, comment image and comment replies
    at tier == 3 (PostReplyReply): calls for a profile image and comment image
    */ 
	this.setFbPostData = function(msg, tier, parentPost)
	{
		var postID = (msg.id).toString(); 
		 //msgCopy is split by new lines in order to extract titles and paragraphs
        var msgCopy = msg.message.split("\n");
		//empty strings removed from array
			msgCopy = msgCopy.filter(Boolean);
		var msgDate = msg.created_time;
        var newDate = new Date(msgDate);
		//timestamp will be used to sort by date
        var timeStamp = parseInt(Date.parse(msgDate));
		//a readable date which will be used to inform audience
		var dateStr = (
				msgDate.slice(8,10)
				+ " " 
				+ postOffice.monthNames[newDate.getMonth()] 
				+ ", "
				+ msgDate.slice(0,4));
		// time of post will be formatted differently and therefore is kept seperate from date
		var timeStr = msgDate.slice(11,16) + " GMT";
		var newPost;
		// Determine object type for comment
		switch (tier)
		{
			case 1:
				newPost = new Post();
				break;
			case 2:
				newPost = new PostReply();
				break;
			case 3:
				newPost = new PostReplyReply();
				break;
		}
		// Default data applicable to all Post object types
		newPost.setInitialData(
								postID,
								timeStamp,
								msgCopy,
								dateStr,
								timeStr, 
								"facebook"
								)
	
		if (tier == 1)
		{
            
            var key = msgCopy[0].toString();
                key = key.trim();
            var refinedPostID = postID.split('_');
                refinedPostID = refinedPostID[1];
            var postUrl = 
                "https://www.facebook.com/permalink.php?story_fbid="  
                + refinedPostID + "&id=" + postOffice.fbPageID;
            newPost.setURL(postUrl, "fb");
             //removes key from post txt
            postOffice.postBoxes[key] = newPost;
            var postsImgAddress = 
            'https://graph.facebook.com/v2.0/' 
            + postID 
            + '/attachments?' 
            + postOffice.fbToken;
            postOffice.getFbPostReplies(postID, newPost);
            postOffice.postman.getPosts(postsImgAddress, postOffice.getFbMsgImg, newPost);
		}
		
		else if (tier == 2 || tier == 3)
		{
			var writerID = msg.from.id;
			newPost.setWriter(msg.from.name);
			newPost.setParentBox(parentPost);
            if (tier == 3)
                {
                    //console.log("parentPost");
                    //console.log(parentPost);
                }
            parentPost.setChildBox(postID, newPost);
            parentPost.setChildArray(newPost);
            var profileImgAddress = 
                "http://graph.facebook.com/" 
                + writerID
                + "/picture";
            
            var postReplyImgAddress = 
                'https://graph.facebook.com/v2.0/' 
                + postID 
                + '/?fields=attachment&' 
                + postOffice.fbToken;
            
            postOffice.postman.getPosts(
                postReplyImgAddress,
                postOffice.getFbCommentImg, 
                newPost
                );
            
            postOffice.postman.getPosts(
                profileImgAddress,
                postOffice.getFbProfileImg, 
                newPost
                );
            
			if (tier == 2) 
			{
                
				postOffice.getFbPostReplies(postID, newPost);
			}
		
			
		}
	}
    
    /* takes parsed Google+ post objects and dissassembles the data to fit one of the required formats
    and stores in a postBox, then makes further API calls where data is not available 
    from the post object: 
    
    if tier == 1 (Post): calls for comments and image(s) of Post and post comments
    */ 
    this.setGpPostData = function(msg, tier, parentPost)
	{
        //console.log(msg);
		var postID = (msg.id).toString(); 
		 //msgCopy is split by new lines in order to extract titles and paragraphs
        var msgCopy = msg.object.content.split("<br />");
        
		//empty strings removed from array
			msgCopy = msgCopy.filter(Boolean);
		var msgDate = msg.published;
        var newDate = new Date(msgDate);
		//timestamp will be used to sort by date
        var timeStamp = parseInt(Date.parse(msgDate));
		//a readable date which will be used to inform audience
		var dateStr = (
				msgDate.slice(8,10)
				+ " " 
				+ postOffice.monthNames[newDate.getMonth()] 
				+ ", "
				+ msgDate.slice(0,4));
		// time of post will be formatted differently and therefore is kept seperate from date
		var timeStr = msgDate.slice(11,16) + " GMT";
		var newPost;
		// Determine object type for comment
		switch (tier)
		{
			case 1:
				newPost = new Post();
				break;
			case 2:
				newPost = new PostReply();
				break;
		}
		// Default data applicable to all Post object types
		newPost.setInitialData(
								postID,
								timeStamp,
								msgCopy,
								dateStr,
								timeStr, 
								"google+"
								)
	
		if (tier == 1)
		{
            var key = msgCopy[0].toString();
                key = key.trim();
            
            var repliesURL = 
                msg.object.replies.selfLink
                + '?key=AIzaSyAiKOVRPDKdDwXjr9Y5iksMZpbxr9uYQdU';
            var replyInt = msg.object.replies.totalItems;
            var postUrl = msg.url;
            //if the post is not a duplicate then we add a new post box
            if(typeof postOffice.postBoxes[key] == 'undefined')
            {
                    postOffice.postBoxes[key] = newPost;
                    //If the post has images we need to collect them from the picasa API
                    if (typeof msg.object.attachments != 'undefined')
                    {
                        var imgType = msg.object.attachments[0].objectType;
                        var IDs = msg.object.attachments[0].id;
                            IDs = IDs.split('.');
                            var usrID = IDs[0];
                            var albumID = IDs[1];
                        //imgType determines the type of call made to the picasa api
                        if (imgType == 'album')
                        {
                            var postsImgAddress = 
                                'https://picasaweb.google.com/data/feed/api/user/'
                                + usrID
                                + '/albumid/'
                                + albumID + '?imgmax=1024&key=AIzaSyAiKOVRPDKdDwXjr9Y5iksMZpbxr9uYQdU';
                            postOffice.postman.getPostsAjax(postsImgAddress, postOffice.getGpMsgImg, newPost);
                        }
                        else
                        {
                            var postsImgAddress = 
                                'https://picasaweb.google.com/data/feed/api/user/'
                                + usrID
                                + '/photoid/'
                                + albumID + '?imgmax=1024&key=AIzaSyAiKOVRPDKdDwXjr9Y5iksMZpbxr9uYQdU';
                            postOffice.postman.getPostsAjax(postsImgAddress, postOffice.getGpSingleMsgImg, newPost);
                        }
                    }
            }
            else
            {
                newPost = postOffice.postBoxes[key];
                newPost.setNetwork("google+")
            }
            
            newPost.setReplyInt(replyInt);
            newPost.setURL(postUrl, "gp");
            postOffice.postman.getPosts(repliesURL, postOffice.setTier2GpPosts, newPost);
            
        }
        
		else if (tier == 2)
		{
			newPost.setWriter(msg.actor.displayName);
			newPost.setParentBox(parentPost);
            parentPost.setChildBox(postID, newPost);
            parentPost.setChildArray(newPost);
            newPost.setProfilePictureStr(msg.actor.image.url);
		}
	}
    
    /* receives post attachments data from the API and the facebook Post 
    object reference. Parses the data and adds the images to the Facebook Post
    attachments attribute. */
    
    this.getFbMsgImg = function(responseObj, post) 
    {
        var fbResponse = JSON.parse(responseObj.response);
        if (fbResponse.data.length > 0)
            {
                var dataObj = fbResponse.data[0];
                var mediaObj = dataObj.media;
                var imgSrc;
                var messageID = dataObj.target.id;
                var subAttachmentsObj = dataObj.subattachments;
                if (typeof mediaObj != 'undefined')
                    {
                        imgSrc = mediaObj.image.src;
                    }
                else {
                    var imgObjs = subAttachmentsObj.data
                    var imgSrc = []
                    
                    loopImageLinks(0)

                    function loopImageLinks(index) {
                        if(typeof imgObjs[index] == 'undefined') {
                            return;
                        }
                        imgObj = imgObjs[index].media.image.src;
                        imgSrc.push(imgObj);
                        index++;
                        loopImageLinks(index);
                    } 
                }
                post.setAttachments(imgSrc);
            }
		else
		{
			//console.log(post + "No images found");
		}
    }
    
    /* receives post reference, and images from the picasa API, 
    these images are added to the post attachments attribute */
    this.getGpMsgImg = function(responseObj, postRef) 
    {
        
        var index = 0;
        var imgs = [];
        var xml = $.parseXML(responseObj);
        loopImageLinks(index)
        function loopImageLinks(index){
            if(typeof xml.getElementsByTagName("entry")[index] == 'undefined')
                {
                    return;
                }
            var e = xml.getElementsByTagName("entry")[index];
            var c = e.getElementsByTagName("content")[0];
            var imgURL = c.getAttribute("src");
            imgs.push(imgURL);
            postRef.setAttachments(imgs);
            index++;
            loopImageLinks(index);
        } 
    }

    /* receives post reference, and single image from the picasa API, 
    the image is added to the post attachments attribute */
    this.getGpSingleMsgImg = function(responseObj, postRef)
    {
        var xml = $.parseXML(responseObj);
        var c = xml.getElementsByTagName("content")[0];
        var imgURL = c.getAttribute("url");
        postRef.setAttachments(imgURL);;
    }
    
	this.getFbCommentImg = function(responseObj, post) 
    {
        var fbResponse = JSON.parse(responseObj.response);
        if (typeof fbResponse.attachment !== 'undefined')
            {
                //N.b. only one attachment can be added to a facebook post
                var attachment = fbResponse.attachment.media.image.src; 
                post.setAttachments(attachment);
            }
		else
		{
			//console.log(post + "No image found");
		}
    }
    
    /* checks if the parentPost is a Post object or a PostReply object
    and makes a call to get post replies with the appropriate function call back
    (tier 2 or 3) */
    this.getFbPostReplies = function(postID, parentPost) 
    {
            postsAddress = 
                'https://graph.facebook.com/v2.0/' 
                + postID + '/comments?filter=toplevel&summary=true&' 
                + postOffice.fbToken;
			
			if (parentPost instanceof Post) 
			{
				postOffice.postman.getPosts(
                        postsAddress,
						postOffice.setTier2fbPosts,
						parentPost);
			}
			else
            {
				postOffice.postman.getPosts(
                    postsAddress,
					postOffice.setTier3fbPosts,
					parentPost);
			}

    }
    
    /* retrieves profile picture of writer from Facebook graph API
    and calls method from the postReply / postReplyReply parent object
    passed as arg to set the profile pic attribute*/
    
    this.getFbProfileImg = function(responseObj, parentPost) {
        var fbResponse = responseObj.responseURL;
        parentPost.setProfilePictureStr (fbResponse);
    }
    
    /* iterates over postBoxes hash table and adds the Post object to an array
    with the Post time stamp. this array is then added to another array and the array
    of arrays is sorted. The postBoxes array and hash table are passed to the publisher
    object function "startWork". This is where the PostOffices closes */
    this.sortPostBoxes = function() {
        var sortable = [];
        for (var postX in postOffice.postBoxes)
            {
                sortable.push([postOffice.postBoxes[postX], postOffice.postBoxes[postX].timeStampInt])
                //postOffice.postBoxes[postX].sortChildBox();
            }
        sortable.sort(function(a, b) {return b[1] - a[1]});
        postOffice.postBoxesArray = sortable;
        publisher.startWork(postOffice.postBoxes, postOffice.postBoxesArray)
    }
    
}