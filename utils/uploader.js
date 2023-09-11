const fs = require("node:fs");
const { Routes } = require("discord.js");

module.exports = {
	textCommands() {
		// Upload commands.
		const textCommands = [];
		fs.readdirSync("./text_commands").forEach(file => {
			if (file.endsWith(".text.js")) {
				const command = file.split(".text.js")[0];
				textCommands.push(command);
			}
		});

		// Log uploaded commands.
		const symbol = "(❕)";
		const logGroupTitle = `${symbol} Comandos de TEXTO Cargados ${symbol}: ${textCommands.length}`;
		console.group(logGroupTitle);
			textCommands.forEach(command => console.info(`✅) ${command}`));
		console.groupEnd(logGroupTitle);
		console.log("");

		// Array with all uploaded commands.
		return textCommands;
	},

	async slashCommands(rest, CLIENT_ID) {
		try {
			// Upload commands.
			const slashCommands = [];
			fs.readdirSync("./slash_commands").forEach(file => {
				if (file.endsWith(".slash.js")) {
					const command = require(`./../slash_commands/${file}`);
					slashCommands.push(command.data.toJSON());
				}
			});
			await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCommands });

			// Log uploaded commands.
			const symbol = "{/}";
			const logGroupTitle = `${symbol} Comandos SLASH Cargados ${symbol}: ${slashCommands.length}`;
			console.group(logGroupTitle);
				slashCommands.map(command => command.name).forEach(command => console.info(`✅) ${command}`));
			console.groupEnd(logGroupTitle);
			console.log("");
		} catch (error) {
			// Error handler.
			console.error("Ocurrió un ERROR en la actualización y subida de los comandos slash:");
			console.error(error);
		}
	}
}