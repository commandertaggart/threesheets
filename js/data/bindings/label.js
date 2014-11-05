
define(
	[
		'knockout',
		'util/Localizer'
	],
	function define_koBindings_label(ko, Loc)
	{
		return {
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
						return s === 'value' || s === 'text' || s === 'with' || s === 'foreach';
					});

					if (key.length > 0)
						{ key = key[0][1].trim(); }
					else
						{ return; }

					key = bindingContext.$data._locContext + key;
				}

				var lbl = document.createElement("DIV");
				//lbl.id = key;
				lbl.innerHTML = Loc(key);
				var classes = element.className.split(" ");
				var inside = false;
				classes = classes.map(function (item)
				{
					if (item === "field")
						{ return item + "-label"; }
					else if (item === "section" ||
						item === "block" ||
						item === "list" ||
						item === "line")
					{
						inside = true;
						return item + "-label";
					}
					else
						{ return item; }
				});

				lbl.className = classes.join(" ") || "label";

				if (inside)
					{ element.insertBefore(lbl, element.firstChild); }
				else
					{ element.parentNode.insertBefore(lbl, element); }

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
)