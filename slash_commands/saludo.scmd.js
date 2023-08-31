const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("saludo")
		.setDescription("Haz que el bot te salude."),

	async execute(interaction) {
		await interaction.reply(`¡Hola, ${interaction.user.displayName}!`);
	}
}