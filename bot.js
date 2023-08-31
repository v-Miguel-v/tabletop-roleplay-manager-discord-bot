// Requeriments and Initializations
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const INTENTS = Number(process.env.INTENTS);

const { REST, Routes, Client } = require("discord.js");
const client = new Client({ intents: INTENTS });
const rest = new REST({ version: '10' }).setToken(TOKEN);

// When Client is Ready...
client.on("ready", () => { console.log("El Cliente está listo para su ejecución"); });

// Slash Commands Update
const fs = require("node:fs");
const slashCommands = [];

fs.readdirSync("./slash_commands").forEach(file => {
	const command = require(`./slash_commands/${file}`);
	slashCommands.push(command.data.toJSON());
});

(async () => {
	try {
		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCommands });
		console.log(slashCommands);
		console.log("La aplicación fue actualizada y recargada correctamente con los comandos slash.");
	} catch (error) {
		console.error("Ocurrió un error en la actualización y recarga de los comandos slash.");
		console.error(error);
	}
})();

// Slash Command Handler
client.on("interactionCreate", detectSlashCommand);
async function detectSlashCommand(interaction) {
	if (!interaction.isChatInputCommand()) return;

	try {
		const commandName = interaction;
		console.log(`Se ha usado el comando ${interaction}`);
		const command = require(`./slash_commands/${commandName}.scmd.js`);
		console.log(interaction.options._hoistedOptions);
		command.execute(interaction);
	} catch (error) {
		console.error(`
			Ocurrió un error al intentar ejecutar un comando slash.
			Error:
			${error}
		`);
	}
}

// Text Command Handler
client.on("messageCreate", detectTextCommand);
async function detectTextCommand(message) {
	if(message.author.bot) return;
	if(!message.content.startsWith("!")) return;

	try {
		const commandName = message.content.toLowerCase().slice(1).split(" ")[0];
		console.log(`${message.author.displayName} usó el comando "${commandName}"`);
		const commandToExecute = require(`./text_commands/${commandName}.tcmd.js`);
		commandToExecute(message);
	} catch (error) {
		console.error(`
			${message.author} redactó el siguiente mensaje: "${message}".
			Y eso ocasionó el siguiente error:
			${error}
		`);
	}
}

// Connection
client.login(TOKEN);