
define(
	[
		'react'
	],
	function define_Block(React)
	{
		var Block = React.createClass({
			render: function render()
			{
				return (
					<div className="block">{ this.props.children }</div>
				);
			}
		});

		return Block;
	}
);

