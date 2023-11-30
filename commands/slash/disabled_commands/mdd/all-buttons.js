const prefix = "mdd/";
const { ButtonBuilder, ButtonStyle } = require("discord.js");

/*
function defineButtons() {

};
*/

const acceptButton = {
	customId: "",
	label: "Aceptar",
	style: ButtonStyle.Success
};

const rejectButton = {
	customId: "",
	label: "Rechazar",
	style: ButtonStyle.Danger
};

module.exports = {
	name: [
		new ButtonBuilder({...acceptButton, customId: `${prefix}acceptName`})
	],

	firstType: [
		new ButtonBuilder({...acceptButton, customId: `${prefix}acceptFirstType`}),
		new ButtonBuilder({...rejectButton, customId: `${prefix}rejectFirstType`}),
	],

	secondType: [
		new ButtonBuilder({...acceptButton, customId: `${prefix}acceptSecondType`}),
		new ButtonBuilder({...rejectButton, customId: `${prefix}rejectSecondType`}),
	],
};