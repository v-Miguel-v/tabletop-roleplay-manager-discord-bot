module.exports = {
	textCommand(command, message, error) {
		const symbol = "(❕)";
		const user = message.author.displayName;
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
			console.error(`El comando completo ejecutado fue: "${interaction}"`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd(`${symbol} ${title} ${symbol}`);
	},

	userCommand(interaction, error) {
		const symbol = "👤";
		const user = interaction.user.displayName;
		const target = interaction.targetUser.displayName;
		const command = `${interaction.commandName}`;
		const title = "MANEJADOR DE ERRORES DE COMANDOS USER";
		console.group(`${symbol} ${title} ${symbol}`);
			console.error(`ERROR: Ocurrió un error al momento de ejecutar el comando "${command}"`);
			console.error(`${user} fue quién ejecutó el comando sobre ${target}.`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd(`${symbol} ${title} ${symbol}`);
	},

	messageCommand(interaction, error) {
		const symbol = "📨";
		const user = interaction.user.displayName;
		const target = interaction.targetMessage.author.displayName;
		const command = `${interaction.commandName}`;
		const title = "MANEJADOR DE ERRORES DE COMANDOS MESSAGE";
		console.group(`${symbol} ${title} ${symbol}`);
			console.error(`ERROR: Ocurrió un error al momento de ejecutar el comando "${command}"`);
			console.error(`${user} fue quién ejecutó el comando sobre un mensaje de ${target}.`);
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