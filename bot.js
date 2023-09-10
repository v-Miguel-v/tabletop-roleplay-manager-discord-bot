// Requeriments and Initializations
const fs = require("node:fs");
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const INTENTS = Number(process.env.INTENTS);

const { REST, Routes, Client, ApplicationCommandOptionType } = require("discord.js");
const client = new Client({ intents: INTENTS });
const rest = new REST({ version: '10' }).setToken(TOKEN);

// When Client is Ready...
client.on("ready", () => { console.log("El cliente está listo para su ejecución.\n"); });

// Slash Commands Update
const slashCommands = [];
fs.readdirSync("./slash_commands").forEach(file => {
	if (file.endsWith(".slash.js")) {
		const command = require(`./slash_commands/${file}`);
		slashCommands.push(command.data.toJSON());
	}
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

// Interactions Handler (Slash Commands, Select Menus and Buttons)
client.on("interactionCreate", handleInteraction);
async function handleInteraction(interaction) {
	if (interaction.isChatInputCommand()) { // Slash Command Handler
		try {
			const commandName = interaction.commandName;
			console.log(`(/) ${interaction.user.displayName} usó el comando "${interaction}"`);
			const command = require(`./slash_commands/${commandName}.slash.js`);
			await command.execute(interaction, client);
		} catch (error) {
			console.group("(/) SLASH COMMAND ERROR HANDLER (/)");
				console.error(`ERROR: Ocurrió un error al momento de ejecutar el comando "${interaction}".`);
				console.error(`${interaction.user.displayName} fue quién ejecutó el comando.`);
				console.error("Y eso ocasionó el siguiente error:");
				console.error(error);
			console.groupEnd("(/) SLASH COMMAND ERROR HANDLER (/)");
		}
	}

	/*
	if (interaction.isAnySelectMenu()) { // Select Menu Handler
		try {
			const menuName = interaction.customId;
			console.log(`(📝) ${interaction.user.displayName} seleccionó la opción "${interaction.values[0]}" del menú "${menuName}"`);
			const menuToExecute = require(`./select_menus/${menuName}.menu.js`);
			await menuToExecute(interaction, client);
		} catch (error) {
			console.group("(📝) SELECT MENU INTERACTION ERROR HANDLER (📝)");
				console.error(`ERROR: Ocurrió un error al momento de ejecutar la opción "${interaction}" en un menu.`);
				console.error(`${interaction.user.displayName} fue quién seleccionó la opción.`);
				console.error("Y eso ocasionó el siguiente error:");
				console.error(error);
			console.groupEnd("(📝) SELECT MENU INTERACTION ERROR HANDLER (📝)");
		}
	}
	*/
}

// Text Command Update
const textCommands = [];
fs.readdirSync("./text_commands").forEach(file => {
	const command = file.split(".text.js")[0];
	textCommands.push(command);
});
console.group(`(!) Comandos de TEXTO Cargados (!): ${textCommands.length}`);
	textCommands.forEach(command => console.log(`✅) ${command}`));
console.groupEnd(`(!) Comandos de TEXTO Cargados (!): ${textCommands.length}`)
console.log("");

// Text Command Handler
client.on("messageCreate", handleTextCommand);
async function handleTextCommand(message) {
	if(message.author.bot) return;
	if(!message.content.startsWith("!")) return;
	const commandName = message.content.toLowerCase().slice(1).split(" ")[0];
	if (!textCommands.includes(commandName)) return;

	try {
		console.log(`(!) ${message.author.displayName} usó el comando "!${commandName}"`);
		const commandToExecute = require(`./text_commands/${commandName}.text.js`);
		await commandToExecute(message, client);
	} catch (error) {
		console.group("(!) TEXT COMMAND ERROR HANDLER (!)");
			console.error(`ERROR: Ocurrió un error al momento de ejecutar el comando "!${commandName}".`);
			console.error(`${message.author.displayName} redactó el siguiente mensaje: "${message}".`);
			console.error("Y eso ocasionó el siguiente error:");
			console.error(error);
		console.groupEnd("TEXT COMMAND ERROR HANDLER");
	}
}

// Connection
client.login(TOKEN);