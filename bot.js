// Requeriments and Initializations
const upload = require("./utils/uploader");
const handleInteraction = require("./utils/interactionHandler");
const { identifyTextCommand, getTextCommandPrefix } = require("./utils/textCommandTools");

require("dotenv").config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const INTENTS = Number(process.env.INTENTS);

const { REST, Client, Events } = require("discord.js");
const client = new Client({ intents: INTENTS });
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Command upload and client initialization...
upload.applicationCommands(rest, CLIENT_ID);
const existingTextCommands = upload.textCommands();
client.on(Events.ClientReady, () => { console.log("El cliente está listo para su ejecución.\n"); });

// Text Command Detector
client.on(Events.MessageCreate, detectTextCommand);
async function detectTextCommand(message) {
	if (message.author.bot) return;
	const commandTextPrefix = getTextCommandPrefix(message.guild.id);
	const command = identifyTextCommand(message, commandTextPrefix, existingTextCommands);
	handleInteraction.textCommand(command, message, client);
}

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

// Connection
client.login(TOKEN);