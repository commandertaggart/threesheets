
function Deferred(resolution)
{
	var calls = [];
	var deferral = function(fn)
	{
		calls.push({
			obj: this,
			args: Array.prototype.slice.call(arguments, 0)
		});
	};
	deferral.resolve = function(fn)
	{
		if (typeof(fn) === 'undefined')
		{ fn = resolution; }
		for (var c = 0; c < calls.length; ++c)
		{
			fn.apply(calls[c].obj, calls[c].args);
		}
		return fn;
	};
	return deferral;
}

Deferred.deferObject = function deferObject(obj)
{
	for (var prop in obj)
	{
		if (typeof(obj[prop]) === "function")
		{ obj[prop] = Deferred(obj[prop]); }
	}
	return obj;
}

Deferred.resolveObject = function resolveObject(obj)
{
	for (var prop in obj)
	{
		if (typeof(obj[prop]) === "function" && typeof(obj[prop].resolve) === "function")
		{ obj[prop] = obj[prop].resolve(); }
	}
	return obj;
}
		
