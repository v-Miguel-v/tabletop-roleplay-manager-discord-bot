const { SlashCommandBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	data: {
		name: "eco",
		description: "Repite el input ingresado.",
		options: [
			{
				name: "input",
				description: "Input a repetir.",
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	},

	async execute(interaction) {
		const eco = interaction.options.getString("input");
		console.log(eco);
		await interaction;
	}
}