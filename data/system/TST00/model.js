
define(['knockout'], function define_TST00_Model(ko)
{
	function Attribute(data, parent)
	{
		var self = { _parent: parent };

		self.score = ko.observable(data.score);

		self.base = ko.computed(function ()
		{
			return Math.floor((self.score() - 10) / 2);
		});

		self.mods = ko.observable(data.mods);
		self.temp = ko.observable(data.temp);

		self.total = ko.computed(function ()
		{
			return self.base() + self.mods() + self.temp();
		});

		return self;
	}

	function Skill(data, parent)
	{
		var self = { _parent: parent };

		var root = parent;
		while (root._parent)
			{ root = root._parent; }

		self.name = ko.observable(data.name);
		self.attr = ko.observable(data.attr);
		self.ranks = ko.observable(data.ranks);

		self.total = ko.computed(function ()
		{
			var a = root.find(self.attr());
			return self.ranks() + (a?a.total():0);
		});

		return self;
	}

	return {
		modelMap: {
			"str": Attribute,
			"dex": Attribute,
			"con": Attribute,
			"int": Attribute,
			"wis": Attribute,
			"cha": Attribute,

			"skills": Skill
		},
		defaults: {
			"name": "",
			"player": "",
			"charclass": "",
			"align": "LG",
			"str": { score: 10, mods: 0, temp: 0 },
			"dex": { score: 10, mods: 0, temp: 0 },
			"con": { score: 10, mods: 0, temp: 0 },
			"int": { score: 10, mods: 0, temp: 0 },
			"wis": { score: 10, mods: 0, temp: 0 },
			"cha": { score: 10, mods: 0, temp: 0 },
			"skills": []
		}
	};

});