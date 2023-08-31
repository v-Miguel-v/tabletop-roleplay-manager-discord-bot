// Requeriments and Initializations
const fs = require("node:fs");
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const INTENTS = Number(process.env.INTENTS);

const { REST, Routes, Client } = require("discord.js");
const client = new Client({ intents: INTENTS });
const rest = new REST({ version: '10' }).setToken(TOKEN);

// When Client is Ready...
client.on("ready", () => { console.log("El cliente está listo para su ejecución.\n"); });

// Slash Commands Update
const slashCommands = [];
fs.readdirSync("./slash_commands").forEach(file => {
	const command = require(`./slash_commands/${file}`);
	slashCommands.push(command.data.toJSON());
});

(async () => {
	try {
		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCommands });
		console.group(`(/) Comandos SLASH Cargados (/): ${slashCommands.length}`);
			slashCommands.map(command => command.name).forEach(command => console.log(`✅) ${command}`));
		console.groupEnd(`(/) Comandos SLASH Cargados (/): ${slashCommands.length}`);
		console.log("");
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
		console.log(`/) ${interaction.user.displayName} usó el comando "${interaction}"`);
		const command = require(`./slash_commands/${commandName}.scmd.js`);
		await command.execute(interaction);
	} catch (error) {
		console.group("(/) SLASH COMMAND ERROR HANDLER (/)");
			console.error(`ERROR: Ocurrió un error al momento de ejecutar el comando "${interaction}".`);
			console.error(`${interaction.user.displayName} fue quién ejecutó el comando.`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd("(/) SLASH COMMAND ERROR HANDLER (/)");
	}
}

// Text Command Update
const textCommands = [];
fs.readdirSync("./text_commands").forEach(file => {
	const command = file.split(".tcmd.js")[0];
	textCommands.push(command);
});
console.group(`(!) Comandos de TEXTO Cargados (!): ${textCommands.length}`);
	textCommands.forEach(command => console.log(`✅) ${command}`));
console.groupEnd(`(!) Comandos de TEXTO Cargados (!): ${textCommands.length}`)
console.log("");

// Text Command Handler
client.on("messageCreate", detectTextCommand);
async function detectTextCommand(message) {
	if(message.author.bot) return;
	if(!message.content.startsWith("!")) return;
	const commandName = message.content.toLowerCase().slice(1).split(" ")[0];
	if (!textCommands.includes(commandName)) return;

	try {
		console.log(`!) ${message.author.displayName} usó el comando "!${commandName}"`);
		const commandToExecute = require(`./text_commands/${commandName}.tcmd.js`);
		await commandToExecute(message);
	} catch (error) {
		console.group("(!) TEXT COMMAND ERROR HANDLER (!)");
			console.error(`ERROR: Ocurrió un error al momento de ejecutar el comando "!${commandName}".`);
			console.error(`${message.author} redactó el siguiente mensaje: "${message}".`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd("TEXT COMMAND ERROR HANDLER");
	}
}

// Connection
client.login(TOKEN);