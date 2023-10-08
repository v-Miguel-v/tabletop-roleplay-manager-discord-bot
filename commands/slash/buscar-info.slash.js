const fs = require("node:fs");
const { SlashCommandBuilder } = require("discord.js");

const trpgAvailable = [];
fs.readdirSync("./local_database/character_sheet_types").forEach(trpg => {
	if (fs.readdirSync(`./local_database/character_sheet_types/${trpg}`).includes("data-and-rules.json")) {
		const trpgFormatted = trpg.replace(/_/g, " ");
		trpgAvailable.push({ name: trpgFormatted, value: trpgFormatted });
	}
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName("buscar-info")
		.setDescription("Busca y muestra información (clases, razas, reglas...) del juego de rol especificado.")
		.addStringOption(option => option
			.setName("juego-de-rol")
			.setDescription("El juego de rol en el cual se buscará la información.")
			.setRequired(true)
			.addChoices(...trpgAvailable)
		)
		.addStringOption(option => option
			.setName("barra-de-búsqueda")
			.setDescription("Aquí se ingresa el término específico (clases, razas, reglas...) que se buscará.")
			.setRequired(true)
			.setAutocomplete(true)
		),

	async autocomplete(interaction, client) {
		const trpgSelected = interaction.options.getString("juego-de-rol");
		const input = interaction.options.getFocused().toLowerCase();
		const choices = ["Clases", "Razas", "Reglas", "Items", "Bestiario", "Conjuros", "Dotes", "Armas", "Armaduras", "Trasfondo", "Referencia Rápida"]
		const filtered = choices.filter(choice => choice.toLowerCase().startsWith(input));
		await interaction.respond( filtered.map(choice => ({ name: choice, value: choice })) );
	},

	async execute(interaction, client) {
		interaction.reply("Working");
	}
}