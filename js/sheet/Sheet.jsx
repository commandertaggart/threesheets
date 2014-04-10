
define(
	[
		'react'
	],
	function define_Sheet(React)
	{
		var Sheet = React.createClass({

			componentWillMount: function ()
			{
				var sheet = this;

				function recurse(child)
				{
					child.setState({ sheet: sheet });
					React.Children.forEach(recurse);
				}
				recurse(this);
			},

			render: function ()
			{
				return (
					<div className="sheet">{ this.props.children }</div>
				);
			}
		});

		return Sheet;
	}
);