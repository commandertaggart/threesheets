
define(
	[
		'util/Localizer'
	],
	function define_koBindings_loctext(Loc)
	{
		return {
			init: function initLocText(element, valueAccessor, allBindings, _dep, bindingContext)
			{
				var key = valueAccessor();
				if (key)
				{
					key = Loc(key);
					element.innerText = key;
				}
			}
		};
	}
)