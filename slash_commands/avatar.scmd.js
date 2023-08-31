const { SlashCommandBuilder } = require("discord.js");

const avatarCommand = {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Muestra la imagen de tu avatar (o la del usuario mencionado)."),

	execute(interaction) {
		interaction.reply("Funcionando.");
	}
}

module.exports = avatarCommand;