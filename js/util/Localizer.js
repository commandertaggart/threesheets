
(function () {

var support = [ 'en' ];
var lang = document.documentElement.getAttribute('lang');

if (!lang)
	{ lang = support[0]; }
else
{
	lang = lang.toLowerCase();
	if (support.indexOf(lang) === -1)
	{
		if (support.indexOf(lang.substr(0,2) >= 0))
			{ lang = lang.substr(0,2); }
		else
			{ lang = support[0]; }
	}
}

var pseudoLoc = (window.__appParams.pseudoLoc === true);

var system = window.__appParams.system;

define(
	[
		'text!strings/' + lang + '.json'
	],
	function define_Localizer(global_strings)
	{
		var strings = { global: JSON.parse(global_strings) };
		
		function mark(s)
		{ return "##" + s + "##"; }

		function pseudo(s)
		{
			var p = "";

			for (var c = 0; c < s.length; ++c)
			{
				var ch = s.charCodeAt(c);
				if (ch >= 65 && ch <= 90)
					{ p += "W"; }
				else if (ch >= 97 && ch <= 122)
					{ p += "w"; }
				else
					{ p += String.fromCharCode(ch); }
			}
		}

		function Localizer(id, tokens)
		{
			if (id.charAt() === '`')
				{ return id.substr(1); }

			function _loc(target, id)
			{
				var bits = id.split('.');

				while (bits.length > 0)
				{
					var bit = bits.shift();
					if (bit in target)
					{
						target = target[bit];
					}
					else
						{ return null; }
				}

				if (typeof(target) === 'object' && "_" in target)
					{ target = target._; }

				if (typeof(target) === 'string')
				{
					if (tokens)
					{
						for (var t in tokens)
						{
							var r = new RegExp("\\{" + t + "\\}", "g");
							target = target.replace(r, tokens[t]);
						}
					}

					if (pseudoLoc)
						{ target = pseudo(target); }

					return target;
				}
			}

			var localized;
			var setindex = id.indexOf(':');
			if (setindex > -1)
			{
				var set = id.substr(0,setindex);
				id = id.substr(setindex+1);

				if (set === "")
					{ set  = "global"; }

				set = strings[set];

				if (set)
				{
					localized = _loc(set, id);
					if (localized)
						{ return localized; }
				}
			}

			for (setindex in strings)
			{
				var localized = _loc(strings[setindex], id);
				if (localized)
					{ return localized; }
			}

			return mark(id);
		}

		Localizer.addStrings =
		function addStrings(id, set)
		{
			strings[id] = set;
		};

		return Localizer;
	}
);

})();