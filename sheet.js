

if (window.__requireConfig)
{
	requirejs.config(window.__requireConfig);
}

requirejs(
	[
		'knockout',
		'jquery',
		'data/SheetLoader',
		'data/RemoteContentSource'
	],
	function begin(ko, $, SheetLoader, ContentSource)
	{
		var api_url = window.location.protocol + "//" + 
			window.location.host + ":5000" + 
			window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/")+1) + 
			"../../../server/api/v1/";
		var content_url = window.location.protocol + "//" + 
			window.location.host + ":5000" + 
			window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/")+1) + 
			"../../../server/data/";

		var source = new ContentSource({
			queryUrl: api_url,
			contentUrl: content_url
		});

		try
		{
			new SheetLoader(window.__appParams.data, source, function (sheet) {});
		}
		catch (error)
		{
			document.write("ERROR:<br />" + (error.stack || error.message || error.toString()));
		}
	}
);

window.threesheets = window.threesheets || {};

window.threesheets.toggleNotes = function toggleNotes()
{
	var notes = document.getElementById("notes");
	if (notes.style.display === "none")
		{ notes.style.display = "inline-block"; }
	else
		{ notes.style.display = "none"; }
}

window.threesheets.showNotesTab = function showNotesTab(tab)
{
	var tabs = ['comments', 'master', 'owner'];
	for (var i = 0; i < tabs.length; ++i)
	{
		var t = document.getElementById("notes-" + tabs[i]);
		t.style.display = ((tabs[i] === tab)?"inline-block":"none");
	}
}
