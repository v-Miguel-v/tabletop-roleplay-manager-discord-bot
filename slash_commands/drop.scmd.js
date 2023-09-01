const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("drop")
		.setDescription("Comando para probar la respuesta con un menú con opciones seleccionables"),

	async execute(interaction) {
		const menu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId("drop__options")
				.setPlaceholder("Selecciona una opción del menú.")
				.setMaxValues(1)
				.setMinValues(1)
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel("Opción 1")
						.setDescription("Esta es la opción 1")
						.setEmoji("✨")
						.setValue("1"),

					new StringSelectMenuOptionBuilder()
						.setLabel("Opción 2")
						.setDescription("Esta es la opción 2")
						.setEmoji("❤️")
						.setValue("2"),

					new StringSelectMenuOptionBuilder()
						.setLabel("Opción 3")
						.setDescription("Esta es la opción 3")
						.setEmoji("👍")
						.setValue("3")
				)
		);

		await interaction.reply({
			content: "Funcionando (slash).",
			components: [menu]
		});
	}
}