const fs = require("node:fs");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const createEmptyCharacterSheet = require("../extras/tools/createEmptyCharacterSheet");

const types = [];
const typeNames = fs.readdirSync("./extras/character_sheet_types").map(x => x.replace(/_/g, " "));
typeNames.forEach(typeName => { types.push({ name: typeName, value: typeName }) });

module.exports = {
	data: new SlashCommandBuilder()
		.setName("md")
		.setDescription("Te envía un mensaje privado."),

	async execute(interaction, client) {
		const owner = interaction.user;

		interaction.reply({
			content: `_Se envió un mensaje privado a ${owner}._`,
		});

		const embed = new EmbedBuilder({
			title: "📝  Creador de Fichas de Personaje  📝",
			color: null,
			fields: [{
				name: "Paso 1: Nombre",
				value: "> Envíe un mensaje con el nombre del personaje."
			}]
		});

		const previousMessage = await owner.send({ embeds:[embed] });
		const fun = async (message) => {
			console.log(`mensaje actual: ${message.content}`);
			console.log(previousMessage);
			//console.log(message.channelId);
			//console.log(previousMessage.channelId);
			if (message.author.bot) return;
			if (message.channelId === previousMessage.channelId) {
				console.log("entré");
				await message.reply(`Escribiste: ${message.content}`);
			}
		};

		client.on("messageCreate", fun);

		setTimeout(() => {
			console.log("se terminó la función");
			client.off("messageCreate", fun);
		}, 20000);
	}
}