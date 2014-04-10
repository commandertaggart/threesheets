

blocks.attribute = function (src) { return (
	<Block data-source={ src }>
		<TextField data-source=".base" />
		<TextField data-source=".mod" />
		<TextField data-source=".temp" />
		<TextField data-source=".total" />
	</Block>
);};

blocks.skill = function () { return (
	<Block>
		<TextField data-source=".name" />
		<TextField data-source=".ranks" />
	</Block>
);};

blocks.vitals = function () { return (
	<Block key="vitals">
		<TextField data-source="name" />
		<TextField data-source="class" />
	</Block>
);};

blocks.skills = function () { return (
	<Block key="skills">
		<List data-source="skills" template={ blocks.skill } />
	</Block>
);};

blocks.attributes = function () { return (
	<Block key="attributes">
		{ blocks.attribute("str") }
		{ blocks.attribute("dex") }
		{ blocks.attribute("con") }
		{ blocks.attribute("int") }
		{ blocks.attribute("wis") }
		{ blocks.attribute("cha") }
	</Block>
);};



layouts.default = function () { return (
	<Sheet>
		<Section key="top">{ blocks.vitals() }</Section>
		<Section key="skills">
			{ blocks.attributes() }
			{ blocks.skills() }
		</Section>
	</Sheet>
);};

layouts.print = function () { return (
	<Sheet>
		<Section key="top">{ blocks.vitals() }</Section>
	</Sheet>
);};

