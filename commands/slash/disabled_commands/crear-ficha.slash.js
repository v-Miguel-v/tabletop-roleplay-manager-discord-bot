const fs = require("node:fs");
const { SlashCommandBuilder, ChannelType } = require("discord.js");
const createEmptyCharacterSheet = require("./../../local_database/tools/createEmptyCharacterSheet");

const types = [];
const typeNames = fs.readdirSync("./local_database/character_sheet_types").map(x => x.replace(/_/g, " "));
typeNames.forEach(typeName => { types.push({ name: typeName, value: typeName }) });

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
		const owner = interaction.options.getUser("dueño") || interaction.user;
		const route = `./extras/character_sheet_types/${typeRoute}`;
		const files = fs.readdirSync(route);
		const selectedTypeIsAvailable = files.some(file => file.endsWith(".txt")) && files.some(file => file.endsWith(".json"));

		if (!selectedTypeIsAvailable) {
			await interaction.reply(`*La creación de fichas de **${type}** aún no está disponible.*`);
		} else {
			const messageIds = [];
			channel.send(`**📝 __FICHA DE PERSONAJE DE ${owner}__ 📝**`);
			fs.readdirSync(route).forEach(file => {
				if (file.endsWith(".txt")) {
					const text = fs.readFileSync(`${route}/${file}`).toString("utf-8");
					const messageSent = channel.send(text);
					messageIds.push(messageSent.id);
				}
			});
			createEmptyCharacterSheet(owner, type);
			await interaction.reply(`*Se ha creado una nueva ficha de personaje (vacía) de **${type}** para **${owner.displayName}** en el canal ${channel}.*`);
		}
	}
}