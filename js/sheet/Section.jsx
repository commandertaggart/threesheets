
define(
	[
		'react'
	],
	function define_Section(React)
	{
		var Section = React.createClass({
			render: function render()
			{
				return (
					<div className="section">{ this.props.children }</div>
				);
			}
		});

		return Section;
	}
);

