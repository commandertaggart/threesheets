
define(
	['jquery'],
	function define_ContentSource($)
	{
		function ContentSource(configUrl)
		{
			
		}

		ContentSource.prototype.listSystems =
		function listSystems(canCreate, callback)
		{ throw new Error("listSystems(canCreate, callback) NOT DEFINED"); };

		ContentSource.prototype.listCharacters =
		function listCharacters(filter, callback)
		{ throw new Error("listCharacters(filter, callback) NOT DEFINED"); };

		ContentSource.prototype.getCharacterSlots = 
		function getCharacterSlots(callback)
		{ throw new Error("getCharacterSlots(callback) NOT DEFINED"); };

		ContentSource.prototype.loadSystem = 
		function loadSystem(system, callback)
		{ throw new Error("loadSystem(system, callback) NOT DEFINED"); };

		ContentSource.prototype.loadCharacter =
		function loadCharacter(id, callback)
		{ throw new Error("loadCharacter(id, callback) NOT DEFINED"); };

		ContentSource.prototype.contentUrl = 
		function contentUrl()
		{ throw new Error("_contentUrl() NOT DEFINED"); }

		return ContentSource;
	}
);