
(function ()
{
	var main, baseUrl;

	if (typeof(global) === 'undefined')
	{
		main = window;
		baseUrl = './js';

		var data = window.location.search.substr(1);
		data = data.split("&");
		data = data.map(function (s) 
		{
			return s.split("=").map(function (s)
			{
				return decodeURIComponent(s);
			});
		});
		var params = {};
		for (var i = 0; i < data.length; ++i)
		{
			var d = data[i];
			var key = d[0];
			var val = d[1];
			if (key in params)
			{
				if (params[key] instanceof Array)
				{
					params[key].push(val);
				}
				else
				{
					params[key] = [params[key], value];
				}
			}
			else
			{
				params[key] = val;
			}
		}
		window.__appParams = params;
	}
	else
	{
		main = global;
		baseUrl = __dirname + '/js';

		// parse command line params
		global.__appParams = {};
	}


	main.__requireConfig = {
		baseUrl: baseUrl,
		paths: {
			'text': '../external/text/text',
			'knockout': '../external/knockout/knockout-3.1.0',
			'jquery': '../../jquery',
			'facebook': '//connect.facebook.net/en_US/all',
			'strings': '../strings'
		},
		shim: {
			'facebook': { exports: 'FB' },
			'jquery': { exports: '$' }
		}
	};	
})();