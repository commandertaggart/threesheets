
define(
	[
		'react',
		'util/Localizer'
	],
	function define_TextField(React, loc)
	{
		var TextField = React.createClass({

			render: function render()
			{
				var data = this.state.sheet.state.data;
				var value = data.resolve(this.props["data-source"]).toString();

				return (
					<div>
						<span className="label">{ loc(this.props["data-source"]) }</span>
						<input type="text" id={ this.props["data-source"] } defaultValue={ value } />
					</div>
				);
			}
		});

		return TextField;
	}
);

