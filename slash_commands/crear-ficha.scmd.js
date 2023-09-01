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
		)
		.addUserOption(option => option
			.setName("dueño")
			.setDescription("Usuario al que le pertenecerá la ficha.")
		),

	async execute(interaction) {
		const user = interaction.options.getUser("dueño") || interaction.user;
		const channel = interaction.options.getChannel("canal");
		const route = "./extras/character_sheet_formats/lewdity_quest_campaign";

		channel.send(`**📝 __FICHA DE PERSONAJE DE ${user}__ 📝**`);
		fs.readdirSync(route).forEach(file => {
			if (file.endsWith(".txt")) {
				const message = fs.readFileSync(`${route}/${file}`).toString("utf-8");
				channel.send(message);
			}
		});

		await interaction.reply(`*Se ha creado una nueva ficha de personaje (vacía) para **${user.displayName}** en el canal ${channel}.*`);
	}
}