/* class is used for the three classes Post, PostReply and PostReplyReply to 
inherit common attributes and methods from.  */

function PostBase()
{
}
PostBase.prototype.idStr; //used to make further api calls, e.g. attachments
PostBase.prototype.timeStampInt; //time used to sort posts
PostBase.prototype.copyArray; //the text
PostBase.prototype.dateStr; //to indicate date submitted
PostBase.prototype.timeStr; //to indicate time submitted
PostBase.prototype.networkArray; //should indicate if fb/google/etc 
PostBase.prototype.attachments; //may have attachments such as images

PostBase.prototype.setInitialData = function (
											idStr,
											timeStampInt,
											copyArray,
											dateStr,
											timeStr,
											networkStr
											)
{
	this.idStr = idStr;
	this.timeStampInt = timeStampInt;
	this.copyArray = copyArray;
	this.dateStr = dateStr;
	this.timeStr = timeStr;
	this.networkArray = [networkStr];
}

PostBase.prototype.setAttachments = function (attachments) 
{
		this.attachments = attachments;
}

PostBase.prototype.setNetwork = function (networkStr) 
{
		this.networkArray.push(networkStr);
}