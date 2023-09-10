const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (message, client) => {
	const emptyArray = new ButtonBuilder({
		customId: "a",
		label: "a",
		style: ButtonStyle.Secondary
	});
	const emptyArray2 = new ButtonBuilder({
		customId: "a2",
		label: "a",
		style: ButtonStyle.Secondary
	});
	const emptyArray3 = new ButtonBuilder({
		customId: "a3",
		label: "a",
		style: ButtonStyle.Secondary
	});
	const emptyRow = new ActionRowBuilder().addComponents(emptyArray);
	const isEmpty = !emptyRow;

	let text = "No";
	if (isEmpty) text = "Sí";

	console.log(emptyRow);

	await message.channel.send({
		content: text,
		components: [emptyRow]
	});
}