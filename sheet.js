

if (window.__requireConfig)
{
	requirejs.config(window.__requireConfig);
}

requirejs(
	[
		'knockout',
		'data/ajax',
		'util/Localizer',
		'data/SheetLoader'
	],
	function begin(ko, ajax, Loc, SheetLoader)
	{
		ajax([{
			url: window.__appParams.config,
			dataType: 'json'
		}], function configLoaded(parts)
		{
			if (parts && parts[0])
			{
				if (parts[0].status === "success")
				{ new SheetLoader(parts[0].content); }
				else
				{ throw new Error("Could not load configuration: " + parts[0].error); }
			}
		});
	}
);

window.INFO = console.info.bind(console, "THREESHEETS: ");

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

