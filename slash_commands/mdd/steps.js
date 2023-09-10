const rows = require("./all-rows");
const embeds = require("./all-embeds");

module.exports = {
	name: {
		initialEmbed: embeds.name.initial,
		initialComponents: rows.name.initial,

		confirmationEmbed: embeds.name.confirmation,
		confirmationComponents: rows.name.confirmation,

		type: "input",
		value: null
	},

	firstType: {
		initialEmbed: embeds.firstType.initial,
		initialComponents: rows.firstType.initial,

		confirmationEmbed: embeds.firstType.confirmation,
		confirmationComponents: rows.firstType.confirmation,

		type: "selection",
		value: null
	},

	secondType: {
		initialEmbed: embeds.secondType.initial,
		initialComponents: rows.secondType.initial,

		confirmationEmbed: embeds.secondType.confirmation,
		confirmationComponents: rows.secondType.confirmation,

		type: "selection",
		value: null
	},
}