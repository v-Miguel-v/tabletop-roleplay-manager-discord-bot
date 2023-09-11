module.exports = {
	textCommand(message, error) {
		const symbol = "(❕)";
		const user = message.author.displayName;
		const command = message.content.toLowerCase().split(" ")[0];
		const title = "MANEJADOR DE ERRORES DE COMANDOS DE TEXTO";
		console.group(`${symbol} ${title} ${symbol}`);
			console.error(`ERROR: Ocurrió un error al momento de ejecutar el comando "${command}"`);
			console.error(`${user} envió el siguiente mensaje: ${message}`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd(`${symbol} ${title} ${symbol}`);
	},

	slashCommand(interaction, error) {
		const symbol = "{/}";
		const user = interaction.user.displayName;
		const command = `/${interaction.commandName}`;
		const title = "MANEJADOR DE ERRORES DE COMANDOS SLASH";
		console.group(`${symbol} ${title} ${symbol}`);
			console.error(`ERROR: Ocurrió un error al momento de ejecutar el comando "${command}"`);
			console.error(`${user} fue quién ejecutó el comando.`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd(`${symbol} ${title} ${symbol}`);
	},

	buttonInteraction(interaction, error) {
		const symbol = "(🔘)";
		const user = interaction.user.displayName;
		const button = interaction.customId;
		const title = "MANEJADOR DE ERRORES DE BOTONES";
		console.group(`${symbol} ${title} ${symbol}`);
			console.error(`ERROR: Ocurrió un error al momento de ejecutar el botón "${button}"`);
			console.error(`${user} fue quién pusló el botón.`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd(`${symbol} ${title} ${symbol}`);
	},

	menuInteraction(interaction, error) {
		const symbol = "(📝)";
		const user = interaction.user.displayName;
		const menu = interaction.customId;
		const options = interaction.values.length;
		const selection = formatSelectedOptions(interaction.values);
		const title = "MANEJADOR DE ERRORES DE MENÚS DE SELECCIÓN";
		console.group(`${symbol} ${title} ${symbol}`);
			console.error(`ERROR: Ocurrió un error al momento de ejecutar ${(options > 2) ? "las opciones" : "la opción"} <${selection}> del menú "${menu}"`);
			console.error(`${user} fue quién seleccionó ${(options > 2) ? "las opciones" : "la opción"}.`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd(`${symbol} ${title} ${symbol}`);
	}
}