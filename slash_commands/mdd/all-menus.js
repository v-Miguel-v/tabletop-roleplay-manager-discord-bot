const fs = require("node:fs");
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

/*
function defineMenus() {

};
*/

const types = [];
const typeNames = fs.readdirSync("./local_database/character_sheet_types").map(x => x.replace(/_/g, " "));
typeNames.forEach(typeName => { types.push({ label: typeName, value: typeName }) });

const firstTypeMenu = new StringSelectMenuBuilder({
	customId: "mdd/components/firstType",
	placeholder: "Selecciona un tipo de ficha.",
	minValues: 1,
	maxValues: 1,
	options: []
});

const secondTypeMenu = new StringSelectMenuBuilder({
	customId: "mdd/components/secondType",
	placeholder: "Selecciona un tipo de ficha.",
	minValues: 1,
	maxValues: 1,
	options: []
});

types.forEach(type => {
	firstTypeMenu.options.push( new StringSelectMenuOptionBuilder(type) );
	secondTypeMenu.options.push( new StringSelectMenuOptionBuilder(type) );
})

module.exports = {
	name: null,
	firstType: firstTypeMenu,
	secondType: secondTypeMenu
};