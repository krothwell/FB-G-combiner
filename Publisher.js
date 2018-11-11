var postBoxes;
var postBoxesArray;

//tracks the last post read, if post is hidden, defaults to a-1
var currentArticleID = "a-1"; 

/* Publisher class used to start adding elements to page */
function Publisher () {
    // receives postBoxesArray, calls next task.
    this.startWork = function (ipostBoxes, ipostBoxesArray) {
        postBoxes = ipostBoxes;
        postBoxesArray = ipostBoxesArray;
        console.log(postBoxesArray);
        console.log(postBoxes);
        this.addNewsSummaries();
    }
    
    /* creates initial Post elements (Date, time, title, network(s))
    and puts them in to a structure, also adds read post and hide post
    buttons (hide post button is initially hidden) */
    this.addNewsSummaries = function ()
    {
        for (var i = 0; i < postBoxesArray.length; i ++)
        {
            smoothScroll();

            var post = postBoxesArray[i][0];
            var dateVal = post.dateStr;
            var timeVal = post.timeStr;
            var title = post.copyArray[0];           
            var newArticle = document.createElement('article');
            newArticle.id = "a" + i;
            
            //header
            var newHeaderAnchor = document.createElement('a');
            newHeaderAnchor.id = "headerID" + i;
            newHeaderAnchor.className = "headerAnchor";
            var newHeader = document.createElement('header');
            newHeader.className = "articleHeader";
            var dateTime = document.createElement('div');
            dateTime.id = "dateTime";
            var dateText = document.createTextNode(dateVal);
            var newDate = document.createElement('p');
            newDate.className = "dateP";
            var timeText = document.createTextNode(timeVal);
            var newTime = document.createElement('p');
            newTime.className = "timeP";
            var newH2 = document.createElement('h2');
            var h2Txt = document.createTextNode(title);
            var postNetwork = document.createElement('div');
            postNetwork.className = "postNetwork";
            for (var j = 0; j < post.networkArray.length; j++) {
                var postNetworkURL = document.createElement('a');
                var postOriginImg = document.createElement('img');
                if (post.networkArray[j] === 'facebook') {
                    postNetworkURL.href = post.postUrlFb;
                    postOriginImg.src = 'resources/facebookC.png';
                    postOriginImg.alt = "Reply to the post \"" + title + "\" on Facebook"
                }
                else if (post.networkArray[j] === 'google+') {
                    postNetworkURL.href = post.postUrlGp;
                    postOriginImg.src = 'resources/googleC.png';
                    postOriginImg.alt = "Reply to the post \"" + title + "\" on Google+"
                     
                }
                postNetworkURL.target = "_blank";
                postNetworkURL.appendChild(postOriginImg);
                postNetwork.appendChild(postNetworkURL);
            }
            newDate.appendChild(dateText);
            newTime.appendChild(timeText);
            dateTime.appendChild(newDate);
            dateTime.appendChild(newTime);
            newHeader.appendChild(dateTime);
            newH2.appendChild(h2Txt);
            newHeader.appendChild(newH2);
            newHeader.appendChild(postNetwork);
            newArticle.appendChild(newHeaderAnchor);
            newArticle.appendChild(newHeader);

            //article body
            var articleBody = document.createElement('div');
            articleBody.className = "articleBody";
            newArticle.appendChild(articleBody);

            //read button
            var readBtnAnchor = document.createElement('a');
            readBtnAnchor.href = "#headerID" + i;
            readBtnAnchor.className = "readBtnAlink";
            var readBtn = document.createElement('div');
            readBtn.className = "readBtn";
            var readBtnTxt = document.createTextNode("Read post");
            readBtn.appendChild(readBtnTxt);
            readBtnAnchor.appendChild(readBtn);
            newArticle.appendChild(readBtnAnchor);                            
            readBtn.addEventListener('click', expandPost);
            
            //hide button
            var hideBtn = document.createElement('div');
            hideBtn.className = "hideBtn";
            var hideBtnTxt = document.createTextNode("Hide post");
            hideBtn.appendChild(hideBtnTxt);
            hideBtn.addEventListener('click', hidePost);
            newArticle.appendChild(hideBtn);
            //section middle div
            var sectMid = document.getElementById('sectMid');
            sectMid.appendChild(newArticle);
        }
    }
}

/* Adds further elements under post header for images, text and
    a button to add comments */
var expandPost = function () {
    this.removeEventListener('click', expandPost);
    this.addEventListener('click', showPost);
    //we need the index so that we can refer to the post array
    var postIndex = parseInt(this.parentElement.parentElement.id.slice(1));
    var articleID = this.parentElement.parentElement.id;
    currentArticleID = articleID;
    var thisArticle = this.parentElement.parentElement;

    $("#" + articleID).css("min-height", "95vh");
    $("#" + articleID + " .readBtn").css("display", "none");
    $("#" + articleID + " .hideBtn").css("display", "inline-block");
    //now we get the values from the post array
    var post = postBoxesArray[postIndex][0];
    //console.log(post);
    
    /*a div is used for the body of the post, held on the same level as the header element
    this div must be identified to append the further post content to*/
    var body = this.parentElement.parentElement.childNodes[2];
    
    
    //firstImg, if found this will be a large image added to the start of the post
    var firstImg = post.attachments;
    if (typeof firstImg == 'object')
        {
            firstImg = post.attachments[0];
        }
    
    if (typeof firstImg != 'undefined') {
        var imageDiv = document.createElement('div');
        imageDiv.className = "aImg";
        var imgLink = document.createElement('a'); //hook images up to lightbox!
        imgLink.href = firstImg;
        var img1 = document.createElement('img');
        img1.src = firstImg;
        imgLink.setAttribute("data-lightbox", post.copyArray[0]);
        imgLink.appendChild(img1);
        imageDiv.appendChild(imgLink);
        body.appendChild(imageDiv);

    //furtherImgs
        if (typeof post.attachments == 'object')
            {
                var imagesDiv = document.createElement('div')
                    imagesDiv.className = 'aImgs';
                for (var i = 1; i < post.attachments.length; i++)
                    {
                        var imgLink = document.createElement('a'); //hook images up to lightbox!
                            imgLink.href = post.attachments[i];
                            imgX = document.createElement('img');
                            imgX.src = post.attachments[i];
                            imgLink.setAttribute("data-lightbox", post.copyArray[0]);
                            //imgLink.rel = "lightbox";
                            imgLink.appendChild(imgX);
                            imagesDiv.appendChild(imgLink);
                    }
                body.appendChild(imagesDiv);
            }

    }
    
    //text
    var bodyTxtDiv = appendParagraphs(1, post.copyArray, 'div');
    bodyTxtDiv.className = "aBodyTxt";
    body.appendChild(bodyTxtDiv);
    
    //comments btn
    var commentsBtn = document.createElement('div');
    commentsBtn.className = "commentsBtn";
    var commentsBtnTxt = document.createTextNode(post.replyInt + " Comments");
    commentsBtn.appendChild(commentsBtnTxt);
    commentsBtn.addEventListener('click', function () {
            expandComments(body, post);
            this.removeEventListener('click', arguments.callee);
        });
    body.appendChild(commentsBtn);
    setNavBtnVisibility();
}

/* hides the articleBody element, returning Post appearence to
its summary state */
var hidePost = function () {
    var articleID = this.parentElement.id;
    $("#" + articleID + " .readBtn").css("display", "inline-block");
    $("#" + articleID + " .hideBtn").css("display", "none");
    $("#" + articleID).css("min-height", "auto");
    $("#" + articleID + " .articleBody" ).css("display", "none");
    currentArticleID = "a-1"; //reset last viewed article to default
    setNavBtnVisibility();
    //$("#prevA").css("display", "none");
}

/* unhides the articleBody element showing expanded post elements 
and comments if they have previously left expanded. */
var showPost = function () {
    var articleID = this.parentElement.parentElement.id;
    $("#" + articleID + " .readBtn").css("display", "none");
    $("#" + articleID + " .hideBtn").css("display", "inline-block");
    $("#" + articleID + " .articleBody" ).css("display", "block");
    $("#" + articleID).css("min-height", "95vh");
    currentArticleID = articleID;
    setNavBtnVisibility();
}

/*  receives body (html element containing button) and post,
    find comment button and assign hideComments to its click, call 
    addCommentsToPage. */
var expandComments = function (body, post) {
    //console.log(body);
    var btn = body.getElementsByClassName("commentsBtn")[0];
    btn.addEventListener('click', hideComments);
    addCommentsToPage (body, post, false);
}

/* sort comments of post. For each comment create the comment elements (including
    date, time, profile picture, writer and text) and add to Post structure. 
    If the comment has replies, the function calls itself with the comment body of 
    the comment, the comment and postReplyReply as true. For each comment reply a
    an identical structure is made to the comment but within the comment body,
    "sub" is appended to html element class names so that the comment replies can be styled 
    differently*/
var addCommentsToPage = function (body, post, postReplyReply) {
    post.sortChildBox();
    var sub = "";
    
    if (postReplyReply) {
        sub = "sub";
    }
    
    
    var commentsBody = document.createElement('div');
        commentsBody.className = sub + "commentsBody";
    var comments = post.childBoxArray;
    
    for (var i = 0; i < comments.length; i++) {
        var comment = comments[i][0];
        var commentBody = document.createElement('div');
        commentBody.className = sub + "commentBody";
        //adding networks the post has bee publsihed to
        var commentNetwork = document.createElement('div');
        commentNetwork.className = sub + "commentNetwork";
        var commentOriginImg = document.createElement('img');
        if (comment.networkArray[0] === 'facebook') {
            commentOriginImg.src = 'resources/facebookC.png';
            commentOriginImg.alt = "Comment posted on Facebook";
        }
        else if (comment.networkArray[0] === 'google+') {
            commentOriginImg.src = 'resources/googleC.png';
            commentOriginImg.alt = "Comment posted on Google+";
        }
        
        commentNetwork.appendChild(commentOriginImg);
        var commentDate = document.createElement('div');
        commentDate.className = sub + "commentDate";
        var commentDateP = document.createElement('p');
        commentDateP.className = sub + "commentDateP";
        var commentDateText = document.createTextNode(comment.dateStr);
        commentDateP.appendChild(commentDateText);
        var commentTimeP = document.createElement('p');
        commentTimeP.className = sub + "commentTimeP";
        var commentTimeText = document.createTextNode(comment.timeStr);
        commentTimeP.appendChild(commentTimeText);
        commentDate.appendChild(commentDateP);
        commentDate.appendChild(commentTimeP);
        var commentProfile = document.createElement('div');
        commentProfile.className = sub + "commentProfile";
        var commentProfileImg = document.createElement('img');
        commentProfileImg.src = comment.profilePictureStr;
        commentProfileImg.alt = comment.writerStr;
        commentProfile.appendChild(commentProfileImg);
        var commentTxt = appendParagraphs(0, comment.copyArray, 'div', comment.writerStr);
        commentTxt.className = sub + "commentTxt";
        commentBody.appendChild(commentNetwork);
        commentBody.appendChild(commentDate);
        commentBody.appendChild(commentProfile);
        commentBody.appendChild(commentTxt);
        commentsBody.appendChild(commentBody);
        
        if (typeof comment.attachments != 'undefined') {
            //note that only facebook allows images to be added to a comment, and only one image
            var firstImg = comment.attachments;
            imageDiv = document.createElement('div');
            imageDiv.className = "aImg";
            var imgLink = document.createElement('a'); 
            imgLink.href = firstImg;
            var img1 = document.createElement('img');
            img1.src = firstImg;
            imgLink.setAttribute("data-lightbox", firstImg); //hook images up to lightbox!
            imgLink.appendChild(img1);
            imageDiv.appendChild(imgLink);
            commentTxt.appendChild(imageDiv);
        }
        
        if (typeof comment.childBoxArray != 'undefined') {
            var subComment = comment;
            if (subComment.childBoxArray.length > 0) {
                if (postReplyReply != true){
                    addCommentsToPage(commentBody, subComment, true);  
                }              
            }
        }
    }
    
    body.appendChild(commentsBody);
}

/*article id is gathered from button parent elements and used to
identify the commentsBody, the comments body is hidden, the commments
button is toggled to show comments next time its clicked*/ 
var hideComments = function () {
    this.removeEventListener('click', hideComments);
    this.addEventListener('click', showComments);
    var articleID = this.parentElement.parentElement.id;
    $("#" + articleID + " .articleBody .commentsBody" ).css("display", "none");
}

/*article id is gathered from button parent elements and used to
identify the commentsBody, the comments body is show, the commments
button is toggled to show hide next time its clicked*/
var showComments = function () {
    this.removeEventListener('click', showComments);
    this.addEventListener('click', hideComments);
    var articleID = this.parentElement.parentElement.id;
    $("#" + articleID + " .articleBody .commentsBody" ).css("display", "block");
}

/* takes an array and of strings, and adds them to a new element - rElement is created with the
elementStr arg. If the array length is only one then there is no text so an empty
paragraph is added to rElement and it is returned, otherwise each string in the array
is added to rElement as a paragraph. If the writer is included as an arg, then
an initial paragraph is added to rElement (used for comments)*/
var appendParagraphs = function (startIndex, arrayInput, elementStr, writer) {
    var rElement = document.createElement(elementStr);
    
    if (typeof writer != 'undefined') {
        var para = document.createElement('p');
        para.className = "writerP";
        var paraTxt = document.createTextNode(writer + ":");
        para.appendChild(paraTxt);
        rElement.appendChild(para);
    }
    if (arrayInput.length == 1)
        {
            var para = document.createElement('p');
            if (typeof arrayInput[startIndex] == 'undefined'){
                var paraTxt = document.createTextNode("");
            }
            else {
                var paraTxt = document.createTextNode(arrayInput[startIndex]);
            }
            para.appendChild(paraTxt);
            rElement.appendChild(para);
            return rElement;
        }
    else {
        for (var y = startIndex; y < arrayInput.length; y++) {
            var para = document.createElement('p');
            var str = replaceUnicode(arrayInput[y]);
            var paraTxt = document.createTextNode(str);
            para.appendChild(paraTxt);
            rElement.appendChild(para);
        }
        return rElement;
    }
}

/* called by the diamond nav button in nav element, closes last read post and scrolls
to top of page */
var navReturn = function () {
    var articleID = currentArticleID;
    if (articleID != "a-1") {
        var article = document.getElementById(articleID);
        var btn = article.getElementsByClassName('hideBtn')[0];
        btn.click();
        currentArticleID = "a-1";
    }
    setNavBtnVisibility();
    
}

/* called by the down arrow nav button, scrolls the user to the next post down from
the last expanded post. If a post is hidden or no articles have been expanded, it defaults
to the first article.*/
var navNextPost = function () {
    var nextArticleID;
    if (typeof currentArticleID == "a-1") {
        nextArticleID = "a0";
    }
    else {
        var articleInt = parseInt(currentArticleID.slice(1));
        nextArticleID = "a" + (articleInt + 1);
    }
    
    var article = document.getElementById(nextArticleID);
    var btn = article.getElementsByClassName("readBtn")[0];
    btn.click();
    currentArticleID = nextArticleID;
}

/* called by the down arrow nav button,expands the post above the last post read */
var navPrevPost = function () {
    var prevArticleID;
    var articleInt = parseInt(currentArticleID.slice(1));
    if (articleInt == 1) {
        $("#prevA").css("display", "none");
    }
    prevArticleID = "a" + (articleInt - 1);
    var article = document.getElementById(prevArticleID);
    var btn = article.getElementsByClassName("readBtn")[0];
    btn.click();
    currentArticleID = prevArticleID;
}

/* replaces unicode in text with symbol equivalent, 
taken from:
http://stackoverflow.com/questions/30903627/replace-unicode-characters-with-characters-javascript */
var replaceUnicode = function (str) {
    return str.replace(/&#([0-9]{1,4});/gi, function(match, numStr) {
    var num = parseInt(numStr, 10); // read num as normal number
    return String.fromCharCode(num);
    });
}

/* When anchor links are selected, the page scrolls smoothly to the nav point, taken from:
http://www.sycha.com/jquery-smooth-scrolling-internal-anchor-links */
var smoothScroll = function () {
    $("html, body").stop();
    $(".readBtnAlink").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 300);
	});
        $(window).bind("mousewheel", function() {
        $("html, body").stop();
    });
}

// figures out if up and down nav buttons should be hidden or displayed
var setNavBtnVisibility = function () {
    var nextArticleInt = parseInt(currentArticleID.slice(1)) + 1;
    var currentArticleInt = parseInt(currentArticleID.slice(1));
    if (currentArticleInt+1 == postBoxesArray.length) {
        $("#nextA").css("display", "none");
    }
    else {
        $("#nextA").css("display", "block");
    }
    if (currentArticleInt <= 0) {
        $("#prevA").css("display", "none");
    }
    else {
        $("#prevA").css("display", "block");
    }
}

