/*
define(
	[
	],
	function define_DataModel()
	{
		function DataPoint(name, parent, value)
		{
			this._name = name;
			this._parent = parent;
			this._val = value;
			this._sub = [];
		}

		DataPoint.prototype.subscribe = 
		function subscribe(handler)
		{
			if (typeof(handler) === 'function' && this._sub.indexOf(handler) === -1)
				{ this._sub.push(handler); }
		};

		DataPoint.prototype.__defineGetter__('value', function get_value()
		{ return this._val; });
		DataPoint.prototype.__defineSetter__('value', function set_value(v)
		{
			var old = this._val;
			this._val = v;
			if (this._val !== old)
			{
				for (var s = 0; s < this._sub.length; ++s)
				{
					var n = this._name;
					if (n === '__index__')
						{ n = this._parent._.indexOf(this); }

					this._sub[s](n, this._val, old);
				}
			}
		});

		function DataModel(data, parent)
		{
			this._ = {};
			this._parent = parent;
			this._root = parent?parent.root:this;

			if (Array.isArray(data))
			{
				this._ = [];

				for (var i = 0; i < data.length; ++i)
				{
					if (typeof(data[i]) === 'object')
					{
						this._[i] = new DataModel(data[i], this);
					}
					else
					{
						this._[i] = new DataPoint('__index__', this, data[i]);
					}

				}
			}
			else
			{
				for (var d in data)
				{
					if (typeof(data[d]) === 'object')
					{
						this._[d] = new DataModel(data[d], this);
					}
					else
					{
						this._[d] = new DataPoint(d, this, data[d]);
					}
				}
			}
		}

		DataModel.prototype.child = 
		function child(name)
		{
			return this._[name];
		};

		DataModel.prototype.indexInParent =
		function indexInParent()
		{
			if (this._parent)
			{
				return this._parent._.indexOf(this);
			}
			return -1;
		};

		DataModel.prototype.isArray = 
		function isArray()
		{
			return Array.isArray(this._);
		};

		DataModel.prototype.resolve = 
		function resolve(path)
		{
			path = path.split('.');
			var start = this;

			if (path[0] === '')
			{
				// use this
				path.shift();
			}
			else if (path[0] === 'parent')
			{
				start = this._parent;
				path.shift();
			}
			else
			{
				start = this._root;
			}

			var arrayMatch = /^(.*)\[([0-9]+|\*)\]$/;
			while (start && path.length > 0)
			{
				var bit = path.shift();
				var match = path.match(arrayMatch);

				if (match)
					{ bit = match[1]; }

				if (bit === 'parent')
					{ start = start._parent; }
				else
					{ start = start.child(bit); }

				if (match && start && start.isArray())
				{
					start = start.child(match[2]);
				}
			}

			return start;
		};

		return DataModel;
	}
);
*/


