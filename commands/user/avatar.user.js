const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("Mostrar Avatar")
		.setType(ApplicationCommandType.User),

	async execute(interaction) {
		user = interaction.targetUser;
		const embed = {
			description: `Avatar de ${user.displayName}`,
			image: {url: user.displayAvatarURL({ dynamic: true, size: 1024 })}
		};
		await interaction.reply({embeds: [embed]});
	}
}