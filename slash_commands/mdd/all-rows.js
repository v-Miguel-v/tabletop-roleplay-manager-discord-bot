const menus = require("./all-menus");
const buttons = require("./all-buttons");
const { ActionRowBuilder } = require("discord.js");

/*
function defineRows() {

};
*/

module.exports = {
	name: {
		initial: [], // null
		confirmation: [new ActionRowBuilder().addComponents(...buttons.name)]
	},

	firstType: {
		initial: [new ActionRowBuilder().addComponents(menus.firstType)],
		confirmation: [new ActionRowBuilder().addComponents(...buttons.firstType)]
	},

	secondType: {
		initial: [new ActionRowBuilder().addComponents(menus.secondType)],
		confirmation: [new ActionRowBuilder().addComponents(...buttons.secondType)]
	}
};