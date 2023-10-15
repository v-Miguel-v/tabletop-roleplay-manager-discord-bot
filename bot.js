// Requeriments and Initializations
const upload = require("./utils/uploader");
const handleInteraction = require("./utils/interactionHandler");
const identifyTextCommand = require("./utils/textCommandIdentifier");

require("dotenv").config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const INTENTS = Number(process.env.INTENTS);

const { REST, Client, Events } = require("discord.js");
const client = new Client({ intents: INTENTS });
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Upload of commands
const existingTextCommands = upload.textCommands();
upload.applicationCommands(rest, CLIENT_ID);

// When Client is Ready...
client.on(Events.ClientReady, () => { console.log("El cliente está listo para su ejecución.\n"); });

// Interaction Detector
client.on(Events.InteractionCreate, detectInteraction);
async function detectInteraction(interaction) {
	if (interaction.isChatInputCommand()) {
		handleInteraction.slashCommand(interaction, client);
	}
	if (interaction.isUserContextMenuCommand()) {
		handleInteraction.userCommand(interaction, client);
	}
	if (interaction.isMessageContextMenuCommand()) {
		handleInteraction.messageCommand(interaction, client);
	}
	if (interaction.isAutocomplete()) {
		handleInteraction.autocomplete(interaction, client);
	}
}

let commandTextPrefix = "!";
// Text Command Detector
client.on(Events.MessageCreate, detectTextCommand);
async function detectTextCommand(message) {
	if (message.author.bot) return;
	const command = identifyTextCommand(message, commandTextPrefix, existingTextCommands);
	handleInteraction.textCommand(command, message, client);

	//! Hay que poner esto bonito. El if de la línea 44 y el forEach de la línea 49 hay que meterlos en una función que retoner los resultados de ambos bloques para que se vea más bonito. Además también hay que arreglar el errorHandler.

	/*
	// Command.
	const commandName = message.content.toLowerCase().slice(1).split(" ")[0];

	// Validators.
	if (!existingTextCommands.includes(commandName)) return;
	if (!message.content.startsWith(commandTextPrefix) || message.author.bot) return;

	// Execution.
	handleInteraction.textCommand(message, client);
	*/
}

// Connection
client.login(TOKEN);