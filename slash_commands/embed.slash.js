const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("embed")
		.setDescription("Crea un embed."),

	async execute(interaction, client) {
		const embed = new EmbedBuilder({
			title: "ℹ️ Información Básica ℹ️",
			color: null,
			fields: [
				{
					name: "",
					value: "**(Raza)**          **(Clase)**"
				},
				{
					name: " ",
					value: "*(historia del personaje)*"
				}
			],
			image: {
				url: "https://s3-eu-west-2.amazonaws.com/dungeon20/images/839381/original-e466e137ac9f00544a979d03e6d4ee1a835ddb2e.jpg"
			},
			thumbnail: {
				url: "https://cdn.pixabay.com/photo/2017/03/17/05/21/info-2150941_1280.png"
			}
		});

		await interaction.reply({ embeds: [embed] });
	}
}