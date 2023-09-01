const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("formats")
		.setDescription("Muestra los formatos disponibles."),

	async execute(interaction) {
		const menu = new StringSelectMenuBuilder({
			customId: "formats__options",
			placeholder: "Selecciona alguno de los formatos.",
			minValues: 1,
			maxValues: 1,
			options: []
		});

		const formats = fs.readdirSync("./extras/character_sheet_formats").map(x => x.replace(/_/g, " "));
		formats.forEach(format => {	menu.options.push(
			new StringSelectMenuOptionBuilder({ label: format, value: format })
		)});

		const row = new ActionRowBuilder().addComponents(menu);

		await interaction.reply({
			content: "Funcionando.",
			components: [row],
			ephemeral: true
		});
	}
}