
define(
	[
	],
	function define_koBindings_collapse()
	{
		return {
			init: function initCollapse(element, valueAccessor, allBindings, _dep, bindingContext)
			{
				var openLabel = Loc(bindingContext.$data._locContext + "collapse_more");
				var closeLabel = Loc(bindingContext.$data._locContext + "collapse_less");
				var button = document.createElement("BUTTON");
				button.className = "collapse_button";
				var start = valueAccessor() || 'closed';
				button.innerText = ((start === "closed")?openLabel:closeLabel);

				var display = element.style.display;

				button.addEventListener("click", function toggleCollapsible()
				{
					if (button.innerText === openLabel)
					{
						element.style.display = display;
						button.innerText = closeLabel;
					}
					else
					{
						element.style.display = "none";
						button.innerText = openLabel;
					}
				});

				element.parentNode.insertBefore(button, element);

				if (start === "closed")
					{ element.style.display = "none"; }
			},
			update: function updateCollapse(element, valueAccessor, allBindings, _dep, bindingContext)
			{

			}
		};
	}
)