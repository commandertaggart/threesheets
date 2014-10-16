
define(
	[
		'knockout',
		'data/ajax',
		'data/Sheet',
		'util/Localizer'
	],
	function define_SheetLoader(ko, ajax, Sheet, Localizer)
	{
		function SheetLoader(charId, source, callback)
		{
			var container = document.getElementById("container") || document.body;
			var head = document.getElementsByTagName("HEAD")[0];

			source.loadCharacter(charId, function charLoaded(error, charData, access)
			{
				if (error)
					{ throw error; }
				else
				{
					source.loadSystem(charData.enumerate.system, function systemLoaded(error, model, view, strings)
					{
						if (error)
							{ throw error; }
						else
						{
							var style = document.createElement("LINK");
							style.type = "text/css";
							style.rel = "stylesheet";
							style.href = source._config.contentUrl + "systems/" + 
								charData.enumerate.system + "/style.css";
							head.appendChild(style);

							Localizer.addStrings(charData.enumerate.system, strings);

							container.innerHTML = view;

							var sheet = window.__sheet = new Sheet(charData, model, access, source);

							ko.applyBindings(sheet.model);

							callback(sheet);
						}
					});
				}
			});
		}

		return SheetLoader;
	}
);