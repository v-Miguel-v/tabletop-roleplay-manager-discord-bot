const log = require("./logger");
const handleError = require("./errorHandler");

module.exports = {
	async textCommand(message, client) {
		try {
			log.textCommand(message);
			const commandName = message.content.toLowerCase().slice(1).split(" ")[0];
			const commandToExecute = require(`./../text_commands/${commandName}.text.js`);
			await commandToExecute(message, client);
		} catch (error) {
			handleError.textCommand(message, error);
		}
	},

	async slashCommand(interaction, client) {
		try {
			log.slashCommand(interaction);
			const commandName = interaction.commandName;
			const command = require(`./../slash_commands/${commandName}.slash.js`);
			await command.execute(interaction, client);
		} catch (error) {
			handleError.slashCommand(interaction, error);
		}
	}
}