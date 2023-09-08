const fs = require("node:fs");
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

const types = [];
const typeNames = fs.readdirSync("./extras/character_sheet_types").map(x => x.replace(/_/g, " "));
typeNames.forEach(typeName => { types.push({ label: typeName, value: typeName }) });

module.exports = {
	data: new SlashCommandBuilder()
		.setName("md")
		.setDescription("Te envía un mensaje privado."),

	async execute(interaction, client) {
		let nombre, raza, clase;
		const user = interaction.user;
		interaction.reply(`_Se envió un mensaje privado a ${user}._`);

		// Embeds
		const name = new EmbedBuilder({
			title: "📝  Creador de Fichas de Personaje  📝",
			color: null,
			fields: [{
				name: "Paso 1: Nombre",
				value: "> Envíe un mensaje con el nombre del personaje."
			}]
		});
		const type1 = new EmbedBuilder({
			title: "📝  Creador de Fichas de Personaje  📝",
			color: null,
			fields: [{
				name: "Paso 2: Primer Tipo",
				value: "> Seleccione el primer tipo de la ficha."
			}]
		});
		const type2 = new EmbedBuilder({
			title: "📝  Creador de Fichas de Personaje  📝",
			color: null,
			fields: [{
				name: "Paso 3: Segundo Tipo",
				value: "> Seleccione el segundo tipo de la ficha."
			}]
		});

		// Buttons
		const accept = new ActionRowBuilder().addComponents(new ButtonBuilder({
			customId: "md/acceptName",
			label: "Aceptar",
			style: ButtonStyle.Success
		}));

		// Select Menus
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
			menu1.options.push( new StringSelectMenuOptionBuilder(type) );
			menu2.options.push( new StringSelectMenuOptionBuilder(type) );
		});
		const typeMenu1 = new ActionRowBuilder().addComponents(menu1);
		const typeMenu2 = new ActionRowBuilder().addComponents(menu2);

		// Funcionamiento
		const privateMessageSent = await user.send({ embeds:[name] });
		const { channelId: userPrivateChannel } = privateMessageSent;
		client.on("messageCreate", registerName);
		async function registerName(message) {
			if (message.author.bot) return;
			if (message.channelId === userPrivateChannel) {
				nombre = message.content;
				const confirmName = name;
				confirmName.data.fields[0].name = "__Confirmación__ del Paso 1: Nombre"
				confirmName.data.fields[0].value = `
					> El nombre del personaje será **\`${message.content}\`**.
					> _(puede cambiar el nombre enviando otro mensaje)_
				`;
				await privateMessageSent.edit({
					embeds: [confirmName],
					components: [accept]
				});
			}
		}


		let previousM;
		client.on("interactionCreate", confirmName);
		async function confirmName(interaction) {
			if (interaction.isButton() && interaction.customId === "md/acceptName") {
				const buttonName = interaction.customId;
				try {
					client.off("messageCreate", registerName);
					console.log(`(🔘) ${interaction.user.displayName} pulsó el botón "${buttonName}"`);
					previousM = await interaction.reply({ embeds: [type1], components: [typeMenu1] });
					await privateMessageSent.delete();
				} catch (error) {
					console.group("(🔘) BUTTON INTERACTION ERROR HANDLER (🔘)");
						console.error(`ERROR: Ocurrió un error al momento de ejecutar el botón "${buttonName}".`);
						console.error(`${interaction.user.displayName} fue quién pulsó el botón.`);
						console.error("Y eso ocasionó el siguiente error:");
						console.error(error);
					console.groupEnd("(🔘) BUTTON INTERACTION ERROR HANDLER (🔘)");
				}
			}
		}

		let previousN;
		client.on("interactionCreate", finalMenu);
		async function finalMenu(interaction) {
			if (interaction.isAnySelectMenu() && interaction.customId === "md/type1") {
				const menuName = interaction.customId;
				try {
					client.off("interactionCreate", confirmName);
					console.log(`(📝) ${interaction.user.displayName} pulsó el botón "${menuName}"`);
					previousN = await interaction.reply({ embeds: [type2], components: [typeMenu2] });
					await previousM.delete();
					raza = interaction.values[0];
				} catch (error) {
					console.group("(📝) SELECT MENU INTERACTION ERROR HANDLER (📝)");
						console.error(`ERROR: Ocurrió un error al momento de ejecutar la opción "${interaction}" en un menu.`);
						console.error(`${interaction.user.displayName} fue quién seleccionó la opción.`);
						console.error("Y eso ocasionó el siguiente error:");
						console.error(error);
					console.groupEnd("(📝) SELECT MENU INTERACTION ERROR HANDLER (📝)");
				}
			}
		}

		client.on("interactionCreate", finalfinal);
		async function finalfinal(interaction) {
			if (interaction.isAnySelectMenu() && interaction.customId === "md/type2") {
				const menuName = interaction.customId;
				try {
					clase = interaction.values[0];
					client.off("interactionCreate", finalMenu);
					console.log(`(📝) ${interaction.user.displayName} pulsó el botón "${menuName}"`);
					await interaction.reply(`Opciones escogidas: ${nombre}, ${raza}, ${clase}`);
					await previousN.delete();
				} catch (error) {
					console.group("(📝) SELECT MENU INTERACTION ERROR HANDLER (📝)");
						console.error(`ERROR: Ocurrió un error al momento de ejecutar la opción "${interaction}" en un menu.`);
						console.error(`${interaction.user.displayName} fue quién seleccionó la opción.`);
						console.error("Y eso ocasionó el siguiente error:");
						console.error(error);
					console.groupEnd("(📝) SELECT MENU INTERACTION ERROR HANDLER (📝)");
				}
			}
		}

		// al final hay que hacer el .off() al último .on()

		/*
		setTimeout(async () => {
			console.log("se terminó la función");
			await interaction.user.send("_Se terminó la ejecución del comando._");
			client.off("messageCreate", registerName);
		}, 600*1000);
		*/
	}
}