const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Comando de Prueba del Bot."),

	async execute(interaction) {
		await interaction.reply("Funcionando.");
	}
}