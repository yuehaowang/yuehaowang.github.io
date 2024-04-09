var ShareUtils = function () {throw "ShareUtils cannot be instantiated";};

ShareUtils.Api = {
	QZONE : "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&pics={pic}&summary={content}",
	WEIBO : "http://service.weibo.com/share/share.php?url={url}&title={content}&pic={pic}&searchPic=false",
	TQQ : "http://share.v.t.qq.com/index.php?c=share&a=index&url={url}&title={title}&appkey=801cf76d3cfc44ada52ec13114e84a96",
	RENREN : "http://widget.renren.com/dialog/share?resourceUrl={url}&srcUrl={url}&title={title}&description={content}",
	DOUBAN : "http://www.douban.com/share/service?href={url}&name={title}&text={content}&image={pic}",
	FACEBOOK : "https://www.facebook.com/sharer/sharer.php?u={url}&t={title}&pic={pic}",
	TWITTER : "https://twitter.com/intent/tweet?text={title}&url={url}",
	LINKEDIN : "https://www.linkedin.com/shareArticle?title={title}&summary={content}&mini=true&url={url}&ro=true",
	QQ : "http://connect.qq.com/widget/shareqq/index.html?url={url}&desc={title}&pics={pic}"
};

ShareUtils.replaceApiUrl = function (apiUrl, opt) {
	opt = opt || {};

	var url = encodeURIComponent(opt.url || window.location.href),
		title = encodeURIComponent(opt.title || document.title),
		content = encodeURIComponent(opt.content || "Share URL"),
		pic = encodeURIComponent(opt.pic || "");

	return apiUrl.replace("{url}", url).replace("{title}", title).replace("{content}", content).replace("{pic}", pic);
};

ShareUtils.share = function (api, opt, callback) {
	window.open(ShareUtils.replaceApiUrl(api, opt));
};