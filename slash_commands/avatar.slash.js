const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Muestra la imagen de tu avatar (o la del usuario mencionado).")
		.addUserOption(option => option
			.setName("usuario")
			.setDescription("Usuario del que se mostrará el avatar.")
		),

	async execute(interaction) {
		const user = interaction.options.getUser("usuario") || interaction.user;
		const embed = {
			description: `Avatar de ${user.displayName}`,
			image: {url: user.displayAvatarURL({ dynamic: true, size: 1024 })}
		};
		await interaction.reply({embeds: [embed]});
	}
}