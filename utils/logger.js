function formatSelectedOptions(array) {
	if (array.length === 1) return String(array);

	const string = String(array).replaceAll(",", ", ");
	const lastComma = string.lastIndexOf(",");
	const replacement = " y";

	const newString = string.slice(0, lastComma) + replacement + string.slice(lastComma+1);
	return newString;
}

module.exports = {
	textCommand(message) {
		const symbol = "(❕)";
		const user = message.author.displayName;
		const command = message.content.toLowerCase().split(" ")[0];
		console.info(`${symbol} ${user} usó el comando "${command}"`);
	},

	slashCommand(interaction) {
		const symbol = "{/}";
		const user = interaction.user.displayName;
		const command = `/${interaction.commandName}`;
		console.info(`${symbol} ${user} usó el comando "${command}"`);
	},

	buttonInteraction(interaction) {
		const symbol = "(🔘)";
		const user = interaction.user.displayName;
		const button = interaction.customId;
		console.info(`${symbol} ${user} pulsó el botón "${button}"`);
	},

	menuInteraction(interaction) {
		const symbol = "(📝)";
		const user = interaction.user.displayName;
		const menu = interaction.customId;
		const options = interaction.values.length;
		const selection = formatSelectedOptions(interaction.values);
		console.info(`${symbol} ${user} seleccionó ${(options > 2) ? "las opciones" : "la opción"} <${selection}> del menú "${menu}"`);
	}
}