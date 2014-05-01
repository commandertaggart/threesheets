

if (window.__requireConfig)
{
	requirejs.config(window.__requireConfig);
}

requirejs(
	[
		'knockout',
		//'text!' + window.__appParams.dataUrl,
		'text!../test/data.json',
		'text!../data/system/TST00/view.html',
		'../data/system/TST00/model',
		'data/Sheet'
		//'sheet/SheetLoader'
	],
	function begin(ko, data, view, modelMap, Sheet)
	{
		//console.log(window.__appParams.dataUrl + ":", data);
		//console.log(window.__appParams.layoutUrl);
		data = JSON.parse(data);

		var container = document.getElementById("container") || document.body;
		container.innerHTML = view;

		var sheet = window.__sheet = new Sheet(data, modelMap);

		ko.applyBindings(sheet);

		//window.__appParams.dataModel = new Sheet(data);

		//var loader = new SheetLoader(window.__appParams.layoutUrl, document.body);
	}
);