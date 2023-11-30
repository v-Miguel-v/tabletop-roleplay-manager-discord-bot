const fs = require("node:fs");
const log = require("./logger");
const { Routes } = require("discord.js");

const globalRoute = "commands";
function uploadCommands(type) {
	const commandsUploaded = [];
	const localRoute = `${globalRoute}/${type}`;
	fs.readdirSync(`./${localRoute}`).forEach(file => {
		if ( file.endsWith(`.${type}.js`) ) {
			const command = require(`./../${localRoute}/${file}`);
			if (type === "text") {
				const matchesForCommand = {
					aliases: [command.data.name, ...command.data.aliases],
					regexes: [...command.data.regexes],
					regexesWithPrefix: [...command.data.regexesWithPrefix],
					associatedCommandName: command.data.name
				}
				commandsUploaded.push( matchesForCommand );
			} else {
				commandsUploaded.push( command.data.toJSON() );
			}
		}
	});
	return commandsUploaded;
}

module.exports = {
	textCommands() {
		const textCommands = uploadCommands("text");
		log.commandsUpdated(textCommands, "❕", "TEXTO");
		return textCommands;
	},

	async applicationCommands(rest, CLIENT_ID, GUILD_ID) {
		try {
			// Upload user, slash and message commands.
			const userCommands = uploadCommands("user");
			const slashCommands = uploadCommands("slash");
			const messageCommands = uploadCommands("message");
			await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
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