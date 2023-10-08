const log = require("./logger");
const handleError = require("./errorHandler");
const userCommandsRoutes = require("./../commands/user/routes");
const messageCommandsRoutes = require("./../commands/message/routes");

module.exports = {
	async textCommand(message, client) {
		try {
			log.textCommand(message);
			const commandName = message.content.toLowerCase().slice(1).split(" ")[0];
			const commandToExecute = require(`./../commands/text/${commandName}.text.js`);
			await commandToExecute(message, client);
		} catch (error) {
			handleError.textCommand(message, error);
		}
	},

	async slashCommand(interaction, client) {
		try {
			log.slashCommand(interaction);
			const commandName = interaction.commandName;
			const command = require(`./../commands/slash/${commandName}.slash.js`);
			await command.execute(interaction, client);
		} catch (error) {
			handleError.slashCommand(interaction, error);
		}
	},

	async userCommand(interaction, client) {
		try {
			log.userCommand(interaction);
			const commandName = interaction.commandName;
			const commandRoute = userCommandsRoutes[commandName];
			const command = require(`./../commands/user/${commandRoute}.user.js`);
			await command.execute(interaction, client);
		} catch (error) {
			handleError.userCommand(interaction, error);
		}
	},

	async messageCommand(interaction, client) {
		try {
			log.messageCommand(interaction);
			const commandName = interaction.commandName;
			const commandRoute = messageCommandsRoutes[commandName];
			const command = require(`./../commands/message/${commandRoute}.message.js`);
			await command.execute(interaction, client);
		} catch (error) {
			handleError.messageCommand(interaction, error);
		}
	},

	async autocomplete(interaction, client) {
		try {
			const command = require(`./../commands/slash/${interaction.commandName}.slash.js`);

			if (!command) {
				console.error(`No se encontró ningún comando que coincida con el comando "${interaction.commandName}" ingresado.`);
				return;
			}

			await command.autocomplete(interaction, client);
		} catch (error) {
			console.error("Error de Autocompletado", error);
			// handleError.slashCommand(interaction, error);
		}
	},
}