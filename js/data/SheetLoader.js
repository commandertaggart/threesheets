
define(
	[
		'knockout',
		'jquery',
		'data/ajax',
		'data/Sheet',
		'util/Localizer'
	],
	function define_SheetLoader(ko, $, ajax, Sheet, Localizer)
	{
		function SheetLoader(config, loadedCallback)
		{
			this._config = config;
			
			config.views = Object.keys(config.views).map(function (k) { return { id: k, view: config.views[k] } });
			config.strings = Object.keys(config.strings).map(function (k) { return { id: k, strings: config.strings[k] } });
			
			ajax([
				{
					url: config.model,
					dataType: 'script'
				},
				{
					url: config.style,
					dataType: 'stylesheet'
				},
				{
					url: config.dataUrl + config.dataRoot,
					dataType: 'json'
				},
				config.views.map(function (item) { return { url: item.view, dataType: 'html' } }),
				config.strings.map(function (item) { return { url: item.strings, dataType: 'json' } })
			], this.loaded.bind(this, loadedCallback));

		}
		
		SheetLoader.prototype.loaded = function loaded(callback, parts)
		{
			var Model = parts[0];
			var data = parts[2];
			var views = {};
			var strings = {};
			
			if (Model == null)
			{ throw new Error("Model did not load."); }
			if (data == null || data.status !== "success")
			{ throw new Error("Data did not load correctly."); }
			
			this._config.views.forEach(function (view, index)
			{
				if (parts[3][index])
				{ views[view.id] = parts[3][index]; }
			});
			if (views.main == null)
			{ throw new Error("No main view found"); }
			
			this._config.strings.forEach(function (set, index)
			{
				if (parts[4][index])
				{ Localizer.addStrings(set.id, parts[4][index]); }
				else
				{ console.warn("Could not load string set: " + set.id); }
			});
			
			var $doc = $(document.body);
			
			$doc.append(views.main);
			
			for (var v in views)
			{
				if (v !== "main")
				{
					$doc.find("[data-child-view='" + v + "']").html(views[v]);
				}
			}
					
			var sheet = window.__sheet = new Sheet(data.content, Model, data.access, this._config.contentUrl);
			ko.applyBindings(sheet.model);

			if (callback)
			{ callback(sheet); }
		}

		return SheetLoader;
	}
);