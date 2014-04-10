

if (window.__requireConfig)
{
	requirejs.config(window.__requireConfig);
}

requirejs(
	[
		'react',
		'text!' + window.__appParams.dataUrl,
		'sheet/SheetLoader',
		'data/DataModel'
	],
	function begin(React, data, SheetLoader, DataModel)
	{
		console.log(window.__appParams.dataUrl + ":", data);
		console.log(window.__appParams.layoutUrl);
		data = JSON.parse(data);

		window.__appParams.dataModel = new DataModel(data);

		var loader = new SheetLoader(window.__appParams.layoutUrl, document.body);
	}
);