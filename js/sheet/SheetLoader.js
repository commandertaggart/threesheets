
define(
	[
		'text',
		'JSXTransformer',
		'react',
		'util/Localizer',

		'jsx!sheet/Sheet',
		'jsx!sheet/Section',
		'jsx!sheet/Block',

		'jsx!sheet/field/TextField'
	],
	function define_SheetLoader(text, jsx, React, Localizer,
		/* Layout components */ Sheet, Section, Block, 
		/* Field types */ TextField)
	{
		function SheetLoader(url, container)
		{
			text.get(url + ".jsx", function (jsx_text)
			{
				if (jsx_text)
				{
					var blocks = {};
					var layouts = {};
					var loc = Localizer;

					try
					{
						console.log(jsx_text);
						var code = jsx.transform("/** @jsx React.DOM */\n" + jsx_text);
						console.log(code.code);
						eval(code.code);

						var layout = window.__appParams.layout || 'default';
						if (layouts[layout])
						{
							React.renderComponent(layouts[layout](), container);
						}
					}
					catch (err)
					{
						container.innerText = err.stack || err.message || err.toString();
					}
				}
			});
		}

		return SheetLoader;
	}
);