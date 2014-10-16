
define(
	[
		'knockout',
		'util/Localizer'
	],
	function define_KnockoutBindings(ko, Loc)
	{
		ko.bindingHandlers.label = {
			init: function initLabel(element, valueAccessor, allBindings, _dep_, bindingContext)
			{
				var key = valueAccessor();
				if (key === undefined)
				{
					key = element.getAttribute('data-bind').split(",");
					key = key.map(function (s) { return s.split(":"); });
					key = key.filter(function (s)
					{
						s = s[0].trim();
						return s === 'value' || s === 'text' || s === 'with' || s === 'foreach';
					});

					if (key.length > 0)
						{ key = key[0][1].trim(); }
					else
						{ return; }

					key = bindingContext.$data._locContext + key;
				}

				var lbl = document.createElement("DIV");
				//lbl.id = key;
				lbl.innerHTML = Loc(key);
				var classes = element.className.split(" ");
				var inside = false;
				classes = classes.map(function (item)
				{
					if (item === "field")
						{ return item + "-label"; }
					else if (item === "section" ||
						item === "block" ||
						item === "list" ||
						item === "line")
					{
						inside = true;
						return item + "-label";
					}
					else
						{ return item; }
				});

				lbl.className = classes.join(" ") || "label";

				if (inside)
					{ element.insertBefore(lbl, element.firstChild); }
				else
					{ element.parentNode.insertBefore(lbl, element); }

				ko.utils.domNodeDisposal.addDisposeCallback(element, function _cleanup()
				{
					lbl.parentNode.removeChild(lbl);
				});
			},
			update: function updateLabel(element, valueAccessor, allBindings, _dep_, bindingContext)
			{
				
			}
		};

		ko.bindingHandlers.loctext = {
			init: function initLocText(element, valueAccessor, allBindings, _dep, bindingContext)
			{
				var key = valueAccessor();
				if (key)
				{
					key = Loc(key);
					element.innerText = key;
				}
			}
		};

		ko.bindingHandlers.collapse = {
			init: function initCollapse(element, valueAccessor, allBindings, _dep, bindingContext)
			{
				var openLabel = Loc(bindingContext.$data._locContext + "collapse_more");
				var closeLabel = Loc(bindingContext.$data._locContext + "collapse_less");
				var button = document.createElement("BUTTON");
				button.className = "collapse_button";
				var start = valueAccessor() || 'closed';
				button.innerText = ((start === "closed")?openLabel:closeLabel);

				var display = element.style.display;

				button.addEventListener("click", function toggleCollapsible()
				{
					if (button.innerText === openLabel)
					{
						element.style.display = display;
						button.innerText = closeLabel;
					}
					else
					{
						element.style.display = "none";
						button.innerText = openLabel;
					}
				});

				element.parentNode.insertBefore(button, element);

				if (start === "closed")
					{ element.style.display = "none"; }
			},
			update: function updateCollapse(element, valueAccessor, allBindings, _dep, bindingContext)
			{

			}
		}

		ko.bindingHandlers["list-tools"] = {
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
		}

		ko.bindingHandlers["list-item-tools"] = {
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
		}

		ko.bindingHandlers.autosize = {
			init: function initAutoSize(element, valueAccessor, allBindings, _dep, bindingContext)
			{
				var params = valueAccessor() || {};

				if (element.nodeName === "TEXTAREA")
				{
					function resize()
					{
						setTimeout(function ()
						{
							var height = element.scrollHeight;
							if (height > 0)
							{
								height = Math.max(height, params.min || 55);
								//console.log("resizing textarea to " + height);
								element.style.height = 'auto';
								element.style.height = height + 'px';
							}
						}, 0);
					}

					element.addEventListener('keypress', resize);
					resize();
				}
			},
			update: function updateAutoSize(element, valueAccessor, allBindings, _dep, bindingContext)
			{
			}
		}
	}
);