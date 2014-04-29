
define(
	[
		'knockout',
		'data/koBindings'
	],
	function define_Sheet(ko, __bindings)
	{
		function Sheet(rootData, modelMap)
		{
			function constructList(data, parent, constructor)
			{
				var a = ko.observableArray();

				for (var i = 0; i < data.length; ++i)
				{
					a.push(constructor(data[i], parent));
				}

				return a;
			}

			function construct(data, parent)
			{
				var t = typeof(data);

				if (t === 'object')
				{
					var o = parent?{ _parent: parent }:new Root();

					for (var d in data)
					{
						var constructor = construct;
						if (d in modelMap)
							{ constructor = modelMap[d]; }

						if (data[d] instanceof Array)
							{ o[d] = constructList(data[d], o, constructor); }
						else
							{ o[d] = constructor(data[d], o); }
					}

					return o;
				}
				else
				{
					return ko.observable(data);
				}
			}

			return construct(rootData, null);
		}

		function Root()
		{
			this._parent = null;
		}
		Root.prototype.find = 
		function find(path)
		{
			return this[path];
		};
		Root.prototype.toJSONObject =
		function toJSONObject()
		{
			function recurse(o)
			{
				var r = {};
				for (var p in o)
				{
					if (typeof(o[p]) === 'function')
					{
						if ((typeof(o[p].peek) === 'function') &&
							(typeof(o[p].getDependenciesCount) === 'undefined'))
						{
							r[p] = o[p]();
							if (Array.isArray(r[p]))
							{
								r[p] = r[p].map(recurse);
							}
						}
					}
					else if (p !== '_parent' && o[p]._parent === o)
					{ console.log("recursing:", p);
						r[p] = recurse(o[p]);
					}
				}
				return r;
			}
			return recurse(this);
		};

		return Sheet;
	}
);