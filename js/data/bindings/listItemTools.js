
define(
	[
		'util/Localizer'
	],
	function define_koBindings_listItemTools(Loc)
	{
		return {
			init: function initListItemTools(element, valueAccessor, allBindings, _dep, bindingContext)
			{
				var params = valueAccessor();
				if (typeof(params) === "string")
					{ params = { member: bindingContext.$data[params] }; }
				else if (typeof(params) === "function")
					{ params = { member: params }; }

				var tools = document.createElement("DIV");
				tools.className = "list_item_tools";

				var tool;

				tools.appendChild(tools.__delete = tool = document.createElement("BUTTON"));
				tool.className = "delete-button";
				tool.innerText = Loc(bindingContext.$data._locContext + (params.addLabel || 'delete_label'));
				tool.addEventListener("click", function addItem()
				{
					debugger;
				});
				tools.__add = tool;

				tools.appendChild(tools.__edit = tool = document.createElement("BUTTON"));
				tool.className = "move-up-button";
				tool.innerText = Loc(bindingContext.$data._locContext + (params.editLabel || 'move_up_label'));
				tool.addEventListener("click", function editList()
				{
					debugger;
				});

				tools.appendChild(tools.__done = tool = document.createElement("BUTTON"));
				tool.className = "move-down-button";
				tool.innerText = Loc(bindingContext.$data._locContext + (params.editLabel || 'move_down_label'));
				tool.addEventListener("click", function doneEditingList()
				{
					debugger;
				});

				element.__listItemTools = tools;

				element.appendChild(tools);
			},
			update: function updateListItemTools(element, valueAccessor, allBindings, _dep, bindingContext)
			{
			}
		};
	}
)