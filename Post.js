/* Post objects store all the data collected from APIs for a post.
The post class inherits from the PostBase class and adds the following
atrributes: 
•	childBox – holds PostReply objects related to the post in a hash table
•	childBoxArray – holds PostReply objects related to the post in an array
•	replyInt – holds the number of comments
•	postUrlFb – holds the Facebook URL to the original post
•	postUrlGp – holds the Google+ URL to the original post

Further methods are added to deal with these attributes

*/
function Post ()
{
    this.childBox = {};
    this.childBoxArray = [];

    this.setChildBox = function (key, value)
    {
	   this.childBox[key] = value;
    }
    
    this.setChildArray = function (value)
    {
        var tempArray = [];
        tempArray[0] = value;
        tempArray[1] = value.timeStampInt;
        this.childBoxArray.push(tempArray);
    }
    
    /* sorts the array of postReplys, and calls the sortChildBoxArray
    function for each postReply in the childBoxArray */
    this.sortChildBox = function ()
    {
        //console.log(this.childBoxArray);
        if (this.childBoxArray.length > 0) {
            this.childBoxArray.sort(function(a, b) {return a[1] - b[1]});
            for (var key in this.childBox)
                {
                    this.childBox[key].sortChildBox();
                }
            }
        return;
    }
}

Post.prototype = new PostBase();
Post.prototype.__proto__ = PostBase.prototype;


Post.prototype.replyInt = 0;
Post.prototype.postUrlFb = '';
Post.prototype.postUrlGp = '';

Post.prototype.setReplyInt = function (replyNumber)
{
        this.replyInt = this.replyInt + replyNumber;
}

Post.prototype.setURL = function (urlStr, network)
{
    if (network == 'fb') {
        this.postUrlFb = urlStr;
    }
    else if (network == 'gp') {
        this.postUrlGp = urlStr;
    }
}




