
define(
	[
	],
	function define_koBindings_autoSize()
	{
		return {
			init: function initAutoSize(element, valueAccessor, allBindings, _dep, bindingContext)
			{
				var params = valueAccessor() || {};

				if (element.nodeName === "TEXTAREA")
				{
					function resize()
					{
						setTimeout(function ()
						{
							var height = element.scrollHeight;
							if (height > 0)
							{
								height = Math.max(height, params.min || 55);
								//console.log("resizing textarea to " + height);
								element.style.height = 'auto';
								element.style.height = height + 'px';
							}
						}, 0);
					}

					element.addEventListener('keypress', resize);
					resize();
				}
				else
				{
					console.warn("Knockout binding 'autosize' only works with TEXTAREA elements.");
				}
			},
			update: function updateAutoSize(element, valueAccessor, allBindings, _dep, bindingContext)
			{
			}
		};
	}
)