const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("var")
		.setDescription("Intentaremos transmitir variables entre interaciones."),

	async execute(interaction) {
		const menu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId("var/1st")
				.setPlaceholder("Selecciona una opción del menú.")
				.setMaxValues(1)
				.setMinValues(1)
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel("1st A")
						.setValue("1st A"),

					new StringSelectMenuOptionBuilder()
						.setLabel("1st B")
						.setValue("1st B"),

					new StringSelectMenuOptionBuilder()
						.setLabel("1st C")
						.setValue("1st C")
				)
		);


		await interaction.reply({
			content: "Intentaremos transmitir variables.",
			components: [menu],
			ephemeral: true
		});
	},
}