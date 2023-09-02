const fs = require("node:fs");
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = async (interaction) => {
	const selectedOption = interaction.values[0];
	const dataToStore = `{ "value": "${selectedOption}" }`;
	fs.writeFileSync("./select_menus/var/1st.values", dataToStore);

	const menu = new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId("var/2nd")
			.setPlaceholder("Selecciona una opción del menú.")
			.setMaxValues(1)
			.setMinValues(1)
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel("2nd A")
					.setValue("2nd A"),

				new StringSelectMenuOptionBuilder()
					.setLabel("2nd B")
					.setValue("2nd B"),

				new StringSelectMenuOptionBuilder()
					.setLabel("2nd C")
					.setValue("2nd C")
			)
	);

	await interaction.update({
		content: `La opción seleccionada fue **${selectedOption}**.`,
		components: [menu],
		ephemeral: true
	});
}