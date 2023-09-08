const fs = require("node:fs");
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

const types = [];
const typeNames = fs.readdirSync("./extras/character_sheet_types").map(x => x.replace(/_/g, " "));
typeNames.forEach(typeName => { types.push({ name: typeName, value: typeName }) });

module.exports = {
	data: new SlashCommandBuilder()
		.setName("menu")
		.setDescription("Menu."),

	async execute(interaction, client) {
		let nombre, raza, clase;
		const user = interaction.user;

		const menu = new StringSelectMenuBuilder()
			.setCustomId("menu")
			.setMinValues(1)
			.setMaxValues(1)
			.setPlaceholder("Selecciona un tipo de ficha.")
			.addOptions([
				new StringSelectMenuOptionBuilder()
					.setLabel("1")
					.setValue("1")
			]);

		const row = new ActionRowBuilder().addComponents(menu);

		// Select Menus
		/*
		const menu1 = new StringSelectMenuBuilder({
			customId: "md/type1",
			placeholder: "Selecciona un tipo de ficha.",
			minValues: 1,
			maxValues: 1,
			options: []
		});
		const menu2 = new StringSelectMenuBuilder({
			customId: "md/type2",
			placeholder: "Selecciona un tipo de ficha.",
			minValues: 1,
			maxValues: 1,
			options: []
		});
		types.forEach(type => {
			menu1.options.push( new StringSelectMenuOptionBuilder({ label: type, value: type }) );
			menu2.options.push( new StringSelectMenuOptionBuilder({ label: type, value: type }) );
		});
		const typeMenu1 = new ActionRowBuilder().addComponents(menu1);
		const typeMenu2 = new ActionRowBuilder().addComponents(menu2);
		*/
		interaction.reply({ components: [row] });

		/*
		setTimeout(async () => {
			console.log("se terminó la función");
			await interaction.user.send("_Se terminó la ejecución del comando._");
			client.off("messageCreate", registerName);
		}, 600*1000);
		*/
	}
}