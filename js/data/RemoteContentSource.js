
define(
	[
		'data/ajax',
		'data/ContentSource'
	],
	function define_RemoteContentSource(ajax, ContentSource)
	{
		function RemoteContentSource(config)
		{
			ContentSource.call(this, config);

			if (typeof(config.queryUrl) !== 'string')
				{ throw new Error("Config error: queryUrl missing."); }
			if (typeof(config.contentUrl) !== 'string')
				{ throw new Error("Config error: contentUrl missing."); }

			config.listQuery = config.queryUrl + 
				(config.listQuery || "list?type=%type%");
			config.itemQuery = config.queryUrl +
				(config.itemQuery || "item?type=%type%&id=%id%");
			config.entitlementQuery = config.queryUrl +
				(config.entitlementQuery || "entitlement?id=%id%");
			config.entitlementsQuery = config.queryUrl +
				(config.entitlementsQuery || "entitlements");

			this._hasEntitlements = false;
			this._entitlements = null;
			this._pendingCalls = [];

			ajax({
				url: this.entitlementListURL(),
				dataType: 'json',
				success: this.enumEntitlements.bind(this)
			});
		}
		RemoteContentSource.prototype = Object.create(ContentSource);

		// URL builders
		RemoteContentSource.prototype.listQueryURL =
		function listQueryURL(type, filter)
		{ return this._config.listQuery.replace("%type%", type).replace("%filter%", "0x" + filter.toString(16)); };

		RemoteContentSource.prototype.itemQueryURL = 
		function itemQueryURL(type, id)
		{ return this._config.itemQuery.replace("%type%", type).replace("%id%", id); };

		RemoteContentSource.prototype.entitlementListURL = 
		function entitlementListURL()
		{ return this._config.entitlementsQuery; };

		RemoteContentSource.prototype.entitlementQueryURL = 
		function entitlementQueryURL(id)
		{ return this._config.entitlementQuery.replace("%id%", id); };

		// utilities
		RemoteContentSource.prototype.enumEntitlements =
		function enumEntitlements(data)
		{
			var check = this.haveEntitlements.bind(this);

			function entitlementData(data)
			{
				entitlements.push(data);
				if (entitlements.length >= count)
				{
					check();
				}
			}

			if (data)
			{
				var count = data.items.length;
				var entitlements = this._entitlements = [];

				for (var i = 0; i < count; ++i)
				{
					ajax({
						url: this.entitlementQueryURL(data.items[i]),
						success: entitlementData(data)
					});
				}
			}
			else
			{
				check();
			}
		};

		RemoteContentSource.prototype.haveEntitlements = 
		function haveEntitlements()
		{
			this._hasEntitlements = true;

			var calls = this._pendingCalls;
			this._pendingCalls = [];
			for (i = 0; i < calls.length; ++i)
			{
				calls[i]();
			}
		};

		// api
		RemoteContentSource.prototype.listSystems =
		function listSystems(canCreate, callback)
		{
			if (!this._hasEntitlements)
				{ this._pendingCalls.push(this.listSystems.bind(this, canCreate, callback)); }
			else
			{
				if (this._entitlements)
				{
					var systems = [];

					for (var i = 0; i < this._entitlements.length; ++i)
					{
						systems = systems.concat(this._entitlements[i].systems || []);
					}
					callback(null, systems);
				}
				else
				{
					callback(new Error("Could not retrieve systems"), null);
				}
			}
		};

		RemoteContentSource.prototype.listCharacters =
		function listCharacters(filter, callback)
		{
			ajax({
				url: this.listQueryURL("char", filter || ContentSource.FILTER_ALL),
				dataType: 'json',
				success: function (data)
				{
					if (data.result == "success")
					{
						callback(null, data.items);
					}
				}
			});
		};

		ContentSource.prototype.getCharacterSlots = 
		function getCharacterSlots(callback)
		{
			if (!this._hasEntitlements)
				{ this._pendingCalls.push(this.getCharacterSlots.bind(this, callback)); }
			else
			{
				if (this._entitlements)
				{
					var slots = 0;

					for (var i = 0; i < this._entitlements.length; ++i)
					{
						var s = this._entitlements[i].slots || 0;
						if (s < 0)
							{ callback(null, -1); }
						slots += s;
					}
					callback(null, slots);
				}
				else
				{
					callback(new Error("Could not retrieve slots", 0));
				}
			}
		};

		RemoteContentSource.prototype.loadSystem = 
		function loadSystem(system, callback)
		{
			var content = {
				viewSource: null,
				modelConstructor: null,
				strings: null,
				error: null
			};

			function checkDone()
			{
				if (content.error !== null ||
					(content.viewSource !== null &&
					content.modelConstructor !== null &&
					content.strings !== null))
				{
					callback(content.error, content.modelConstructor, content.viewSource, content.strings);
				}
			}

			ajax({
				url: this._config.contentUrl + "systems/" + system + "/view.html",
				dataType: 'html',
				success: function view_success(view)
				{
					content.viewSource = view;
					checkDone();
				},
				error: function view_fail()
				{
					content.error = new Error("Failed to load the system view source.");
					checkDone();
				}
			});

			ajax({
				url: this._config.contentUrl + "systems/" + system + "/en.json",
				dataType: 'json',
				success: function strings_success(strings)
				{
					content.strings = strings;
					checkDone();
				},
				error: function strings_fail()
				{
					content.error = new Error("Failed to load the system localized strings.");
					checkDone();
				}
			});

			requirejs([this._config.contentUrl + "systems/" + system + "/model.js"],
				function model_loaded(Model)
				{
					content.error = Model?null:new Error("Failed to load model constructor.");
					content.modelConstructor = Model;
					checkDone();
				}
			);
		};

		RemoteContentSource.prototype.loadCharacter =
		function loadCharacter(id, callback)
		{
			ajax({
				url: this.itemQueryURL("char", id),
				dataType: 'json',
				success: function (data)
				{
					callback(null, data.content, data.access);
				}
			});
		};

		RemoteContentSource.prototype.contentUrl = 
		function contentUrl()
		{
			return this._config.contentUrl;
		};

		return RemoteContentSource;
	}
);