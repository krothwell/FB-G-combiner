function PostReplyReply ()
{
}

PostReplyReply.prototype = new PostBase();
PostReplyReply.prototype.__proto__ = PostBase.prototype;

PostReplyReply.prototype.writerStr;
PostReplyReply.prototype.parentBox;
PostReplyReply.prototype.profilePictureStr;

PostReplyReply.prototype.setWriter = function (writerStr)
{
	this.writerStr = writerStr;
}

PostReplyReply.prototype.setParentBox = function (parentBox)
{
	this.parentBox = parentBox;
}

PostReplyReply.prototype.setProfilePictureStr = function (profilePictureStr)
{
	this.profilePictureStr = profilePictureStr;
}
