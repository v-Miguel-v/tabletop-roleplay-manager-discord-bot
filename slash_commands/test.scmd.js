const { SlashCommandBuilder } = require("discord.js");

const testCommand = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Comando de Prueba del Bot."),

	execute(interaction) {
		interaction.reply("Funcionando.");
	}
}

module.exports = testCommand;