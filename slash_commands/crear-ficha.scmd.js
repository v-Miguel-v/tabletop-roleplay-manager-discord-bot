const { SlashCommandBuilder, ChannelType } = require("discord.js");
const fs = require("node:fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("crear-ficha")
		.setDescription("Crea una nueva ficha de personaje (vacía) y la guarda en el canal especifiado.")
		.addChannelOption(option => option
			.setName("canal")
			.setDescription("Canal de texto donde se guardará la ficha.")
			.addChannelTypes(ChannelType.GuildText)
			.setRequired(true)
		),

	async execute(interaction) {
		const channel = interaction.options.getChannel("canal");
		const route = "./extras/character_sheet_formats/lewdity_quest_campaing";
		fs.readdirSync(route).forEach(file => {
			const message = fs.readFileSync(`${route}/${file}`).toString("utf-8");
			channel.send(message);
		});
		await interaction.reply(`*Se ha creado una nueva ficha de personaje (vacía) en el canal ${channel}.*`);
	}
}