
define(
	[
		'knockout',

		'data/bindings/label',
		'data/bindings/loctext',
		'data/bindings/collapse',
		'data/bindings/listTools',
		'data/bindings/listItemTools',
		'data/bindings/autoSize'
	],
	function define_KnockoutBindings(ko, Loc, label, loctext, listTools, listItemTools, autoSize)
	{
		ko.bindingHandlers.label = label;
		ko.bindingHandlers.loctext = loctext;
		ko.bindingHandlers.collapse = collapse;
		ko.bindingHandlers["list-tools"] = listTools;
		ko.bindingHandlers["list-item-tools"] = listItemTools;
		ko.bindingHandlers.autosize = autoSize;
	}
);