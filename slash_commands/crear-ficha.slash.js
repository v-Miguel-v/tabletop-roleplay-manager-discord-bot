const fs = require("node:fs");
const types = [];
const typeNames = fs.readdirSync("./extras/character_sheet_types").map(x => x.replace(/_/g, " "));
typeNames.forEach(typeName => { types.push({ name: typeName, value: typeName }) });

const { SlashCommandBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("crear-ficha")
		.setDescription("Crea una nueva ficha de personaje (vacía).")
		.addStringOption(option => option
			.setName("tipo-de-ficha")
			.setDescription("El tipo de ficha a crear.")
			.setRequired(true)
			.addChoices(...types)
		)
		.addChannelOption(option => option
			.setName("canal")
			.setDescription("El canal donde se mostrará la ficha.")
			.setRequired(true)
			.addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread, ChannelType.PrivateThread)
		)
		.addUserOption(option => option
			.setName("dueño")
			.setDescription("El dueño de la ficha.")
		),

	async execute(interaction) {
		const channel = interaction.options.getChannel("canal");
		const type = interaction.options.getString("tipo-de-ficha");
		const typeRoute = type.replace(/\s/g, "_");
		const user = interaction.options.getUser("dueño") || interaction.user;
		const route = `./extras/character_sheet_types/${typeRoute}`;
		const files = fs.readdirSync(route);
		const selectedTypeIsAvailable = files.some(file => file.endsWith(".txt")) && files.some(file => file.endsWith(".json"));

		if (!selectedTypeIsAvailable) {
			await interaction.reply(`*La creación de fichas de **${type}** aún no está disponible.*`);
		} else {
			channel.send(`**📝 __FICHA DE PERSONAJE DE ${user}__ 📝**`);
			fs.readdirSync(route).forEach(file => {
				if (file.endsWith(".txt")) {
					const message = fs.readFileSync(`${route}/${file}`).toString("utf-8");
					channel.send(message);
				}
			});
			// Crear ficha en almacenamiento.
			await interaction.reply(`*Se ha creado una nueva ficha de personaje (vacía) de **${type}** para **${user.displayName}** en el canal ${channel}.*`);
		}
	}
}