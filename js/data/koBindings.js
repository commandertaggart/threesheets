
define(
	[
		'knockout',
		'util/Localizer'
	],
	function define_KnockoutBindings(ko, Loc)
	{
		ko.bindingHandlers.label = {
			init: function initLabel(element, valueAccessor, allBindings, _dep_, bindingContext)
			{
				var key = valueAccessor();
				if (key === undefined)
				{
					key = element.getAttribute('data-bind').split(",");
					key = key.map(function (s) { return s.split(":"); });
					key = key.filter(function (s)
					{
						s = s[0].trim();
						return s === 'value' || s === 'with' || s === 'foreach';
					});

					if (key.length > 0)
						{ key = key[0][1].trim(); }
					else
						{ return; }
				}

				var lbl = document.createElement("DIV");
				lbl.className = "attribute-label";
				lbl.id = key;
				lbl.innerHTML = Loc(key);
				element.parentNode.insertBefore(lbl, element);

				ko.utils.domNodeDisposal.addDisposeCallback(element, function _cleanup()
				{
					lbl.parentNode.removeChild(lbl);
				});
			},
			update: function updateLabel(element, valueAccessor, allBindings, _dep_, bindingContext)
			{
				
			}
		};
	}
);