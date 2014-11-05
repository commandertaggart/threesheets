
define(
	[
		'knockout',
		'util/Localizer',
		'data/koBindings',
	],
	function define_Sheet(ko, Loc, __bindings)
	{
		function clone(v)
		{
			if (typeof(v) === 'object')
			{
				if (Array.isArray(v))
				{
					return v.map(function (item) { return clone(item); });
				}
				else
				{
					var newv = {};

					for (var prop in v)
					{
						newv[prop] = clone(v[prop]);
					}
				}
			}
			else
				{ return v; }
		}

		function Sheet(storedData, Model, access, dataUrl)
		{
			this._storage = storedData;
			this._modelSpec = Model();
			this._access = access;
			this._dataUrl = dataUrl;

			this.model = {
				_parent: this,
				_root: this,
				_spec: this._modelSpec,
				_locContext: this._storage.enumerate.system + ":" };
			this.construct();
		}

		Sheet.prototype._construct = 
		function _construct(spec, data, store)
		{
			for (var prop in spec)
			{
				if (typeof(spec[prop].calc) === 'function')
				{
					data[prop] = ko.computed(spec[prop].calc, data);
					continue;
				}

				var sBlock = store;

				if (data._parent instanceof Sheet) // at root, check for permissions
				{
					if (spec[prop].perm)
					{
						sBlock = store[spec[prop].perm] || store.view || store;
					}
					else
					{
						sBlock = store.view || store;
					}
				}

				if (spec[prop].list)
				{
					data[prop] = ko.observableArray();
					data[prop]._parent = data;
					data[prop]._root = data._root;
					data[prop]._spec = spec[prop];
					data[prop]._locContext = data._locContext + prop + ".";
					data[prop]._editing = ko.observable(false);

					var initList = Array.isArray(sBlock[prop])?sBlock[prop]:[];
					data[prop]._storage = sBlock[prop] = [];

					data[prop].__createNewItem = function createNewItem(init)
					{
						if (this._spec.struct)
						{
							var item = {
								_parent: this._parent,
								_root: this._root,
								_spec: this._spec.struct,
								_locContext: this._locContext
							};

							init = init || {};

							data._root._construct(item._spec, item, init);
							this.push(item);
							this._storage.push(init);
						}
						else if (typeof(init) !== 'undefined')
						{
							this.push(ko.observable(init));
							this._storage.push(init);
						}
						else if (typeof(this._spec.def) !== 'undefined')
						{
							this.push(ko.observable(this._spec.def));
							this._storage.push(this._spec.def);
						}
						else
						{
							data[prop].push(ko.observable(null));
						}
					};

					var size = spec[prop].size || initList.length || 0;
					for (var s = 0; s < size; ++s)
					{
						data[prop].__createNewItem(initList[s]);
					}
				}
				else
				{
					if (spec[prop].struct)
					{
						data[prop] = {
							_parent: data,
							_root: data._root,
							_spec: spec[prop].struct,
							_locContext: data._locContext + prop + "."
						};
						sBlock[prop] = sBlock[prop] || {};
						this._construct(spec[prop].struct, data[prop], sBlock[prop]);
					}
					else if (typeof(sBlock[prop]) !== 'undefined')
					{
						data[prop] = ko.observable(clone(sBlock[prop]));
					}
					else if (typeof(spec[prop].def) !== 'undefined')
					{
						data[prop] = ko.observable(clone(spec[prop].def));
					}
					else
					{
						console.warn(" - property '" + prop + "' without spec or default");
						data[prop] = null;
					}
				}
			}
		};

		Sheet.prototype.construct = 
		function construct()
		{
			this._construct(this._modelSpec, this.model, this._storage);
		};

		Sheet.prototype._commit = 
		function _commit(spec, data, store)
		{
			for (var prop in spec)
			{
				var sBlock = store;

				if (data._parent instanceof Sheet) // at root, check for permissions
				{
					if (spec[prop].perm)
					{
						sBlock = store[spec[prop].perm] || store.view || store;
					}
					else
					{
						sBlock = store.view || store;
					}
				}

				if (spec[prop].list)
				{
					sBlock[prop] = Array.isArray(sBlock[prop])?sBlock[prop]:[];

					var size = data[prop]().length;
					for (var s = 0; s < size; ++s)
					{
						if (spec[prop].struct)
						{
							sBlock[prop][s] = sBlock[prop][s] || {};
							this._commit(spec[prop].struct, data[prop]()[s], sBlock[prop][s]);
						}
						else
						{
							sBlock[prop][s] = clone(data[prop]()[s]());
						}
					}
				}
				else
				{
					if (spec[prop].struct)
					{
						sBlock[prop] = sBlock[prop] || {};
						this._commit(spec[prop].struct, data[prop], sBlock[prop]);
					}
					else
					{
						sBlock[prop] = clone(data[prop]());
					}
				}
			}
		};

		Sheet.prototype.commit = 
		function commit()
		{
			this._commit(this._modelSpec, this.model, this._storage);
		};

		Sheet.prototype.find =
		function find(path)
		{
			path = path.split(".");

			var data = this.model;
			while (data && path.length > 0)
			{
				data = data[path.shift()];
			}

			return data;
		};

		Sheet.prototype.loc = 
		function loc(id)
		{
			if (id.indexOf(":") === -1)
				{ id = this.model._locContext + id; }
			return Loc(id);
		}

		Sheet.prototype.tokenURL =
		function tokenURL()
		{
			return this._dataUrl + "tokens/" + this._storage.enumerate.token;
		}

		Sheet.prototype.isMaster =
		function isMaster()
		{
			return this._access >= 4; // master-low
		};

		Sheet.prototype.isOwner = 
		function isOwner()
		{
			return this._access >= 6; // collaborator
		};

		Sheet.prototype.canEdit =
		function canEdit()
		{
			return this._access >= 5; // master-high
		};

		Sheet.prototype.canComment =
		function canComment()
		{
			return this._access >= 3; // comment
		};

		Sheet.prototype.toString =
		function toString()
		{
			return JSON.stringify(this._storage);
			/*
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
			var dataBlob = recurse(this);

			var obj = {
				enumerate: {},
				view: {},
				master: {},
				owner: {}
			};

			return obj;
			*/
		};

		return Sheet;
	}
);