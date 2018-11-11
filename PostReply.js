/* PostReply objects hold comments on posts and are added to Post objects
childBox and childBoxArray attributes. They inherit from PostReplyReply which in turn
inherits from PostBase. It also adds the following attributes and methods to deal with them:

•	childBox – holds PostReplyReply objects related to the PostReply in a hash table 
•	childBoxArray – holds PostReplyReply objects related to the PostReply in an Array 
*/

function PostReply ()
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
    
    this.sortChildBox = function ()
    {
        this.childBoxArray.sort(function(a, b) {return a[1] - b[1]});
        
    }
}

PostReply.prototype = new PostReplyReply();
PostReply.prototype.__proto__ = PostReplyReply.prototype;
PostReply.prototype.getChildBox = function ()
{
	return this.childBox;
}

PostReply.prototype.sortChildBox = function()
{
    
}




