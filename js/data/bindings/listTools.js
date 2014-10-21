
define(
	[
		'util/Localizer'
	],
	function define_koBindings_listTools(Loc)
	{
		return {
			init: function initListTools(element, valueAccessor, allBindings, _dep, bindingContext)
			{
				var params = valueAccessor();
				if (typeof(params) === "string")
					{ params = { member: bindingContext.$data[params] }; }
				else if (typeof(params) === "function")
					{ params = { member: params }; }

				var tools = document.createElement("LI");
				tools.className = "list_tools";

				var tool;

				tools.appendChild(tools.__add = tool = document.createElement("BUTTON"));
				tool.className = "add-button";
				tool.innerText = Loc(bindingContext.$data._locContext + (params.addLabel || 'add_label'));
				tool.addEventListener("click", function addItem()
				{
					(params.member || bindingContext.$data).__createNewItem();
				});
				tools.__add = tool;

				tools.appendChild(tools.__edit = tool = document.createElement("BUTTON"));
				tool.className = "edit-button";
				tool.innerText = Loc(bindingContext.$data._locContext + (params.editLabel || 'edit_label'));
				tool.addEventListener("click", function editList()
				{
					(params.member || bindingContext.$data)._editing(true);
					tools.__edit.style.display = "none";
					tools.__done.style.display = null;
				});

				tools.appendChild(tools.__done = tool = document.createElement("BUTTON"));
				tool.className = "done-button";
				tool.style.display = "none";
				tool.innerText = Loc(bindingContext.$data._locContext + (params.editLabel || 'edit_done_label'));
				tool.addEventListener("click", function doneEditingList()
				{
					(params.member || bindingContext.$data)._editing(false);
					tools.__edit.style.display = null;
					tools.__done.style.display = "none";
				});

				element.__listTools = tools;

				element.appendChild(tools);
			},
			update: function updateListTools(element, valueAccessor, allBindings, _dep, bindingContext)
			{
			}
		};
	}
)