const globalRoute = "commands";
const fs = require("node:fs");
const log = require("./logger");
const { Routes } = require("discord.js");

function uploadCommands(type) {
	const commandsUploaded = [];
	const localRoute = `${globalRoute}/${type}`;
	fs.readdirSync(`./${localRoute}`).forEach(file => {
		if (file.endsWith(`.${type}.js`)) {
			const command = (type === "text") ? file.split(".text.js")[0] : require(`./../${localRoute}/${file}`);
			commandsUploaded.push( (type) === "text" ? command : command.data.toJSON() );
		}
	})
	return commandsUploaded;
}

module.exports = {
	textCommands() {
		const textCommands = uploadCommands("text");
		log.commandsUpdated(textCommands, "❕", "TEXTO");
		return textCommands;
	},

	async applicationCommands(rest, CLIENT_ID) {
		try {
			// Upload user, slash and message commands.
			const userCommands = uploadCommands("user");
			const slashCommands = uploadCommands("slash");
			const messageCommands = uploadCommands("message");
			await rest.put(Routes.applicationCommands(CLIENT_ID), {
				body: [...userCommands, ...slashCommands, ...messageCommands]
			});

			// Log uploaded commands.
			log.commandsUpdated(userCommands, "👤", "USER");
			log.commandsUpdated(slashCommands, "{/}", "SLASH");
			log.commandsUpdated(messageCommands, "📨", "MESSAGE");

		} catch (error) {
			// Error handler.
			console.error("Ocurrió un ERROR en la actualización y subida de los comandos de aplicación:");
			console.error(error);
		}
	}
}