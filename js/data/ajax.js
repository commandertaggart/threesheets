
define(
	['jquery'],
	function define_ajax($)
	{
		var head = document.getElementsByTagName("HEAD");
		if (head && head.length > 0)
		{ head = head[0]; }
		else
		{
			head = document.createElement("HEAD");
			document.body.insertBefore(head, document.body.firstChild);
		}
		
		function bulkAjax(spec, callback)
		{
			if (typeof(callback) === 'undefined' && !Array.isArray(spec))
			{ return $.ajax(spec); }
			else
			{
				if (!Array.isArray(spec))
				{ spec = [spec]; }
				
				var count = spec.length;
				var results = new Array(count);
				
				for (var s = 0; s < spec.length; ++s)
				{
					if (typeof(spec[s]) === "string")
					{ spec[s] = { url: spec[s] } }
					
					(function doSpec(spec, index)
					{
						function testDone()
						{
							if (count === 0)
							{
								if (callback)
								{
									callback.call(null, results);
								}
							}
						}

						if (Array.isArray(spec))
						{
							bulkAjax(spec, function (recurseResults)
							{
								results[index] = recurseResults;
								--count;
								testDone();
							});
						}
						else if (spec.dataType === "script")
						{
							requirejs([spec.url], function (scriptResponse)
							{
								results[index] = scriptResponse;
								--count;
								testDone();
							});
						}
						else if (spec.dataType === "stylesheet")
						{
							--count;
							var css = document.createElement("LINK");
							css.setAttribute("type", "text/css");
							css.setAttribute("rel", "stylesheet");
							css.setAttribute("href", spec.url);
							head.appendChild(css);
						}
						else
						{
							var success = spec.success;
							var error = spec.error;
							var complete = spec.complete;

							spec.success = function (data, textStatus, jqXHR)
							{
								spec.success = success;
								if (success) { success(data, textStatus, jqXHR); }
								results[index] = data;
							};

							spec.error = function (jqXHR, textStatus, errorThrown)
							{
								spec.error = error;
								console.warn("AJAX error: \n" + (errorThrown.stack || errorThrown.message || errorThrown.toString()));
								if (error) { error(jqXHR, textStatus, errorThrown); }
								results[index] = null;
							};

							spec.complete = function (jqXHR, textStatus)
							{
								spec.complete = complete;
								if (complete) { complete(jqXHR, textStatus); }
								--count;
								testDone();
							};

							$.ajax(spec);
						}
						
					})(spec[s], s);
				}
			}
		}
		
		return bulkAjax;
	}
);