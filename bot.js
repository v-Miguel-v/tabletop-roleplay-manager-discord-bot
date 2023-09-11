// Requeriments and Initializations
const upload = require("./utils/uploader");
const handleInteraction = require("./utils/interactionHandler");

require("dotenv").config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const INTENTS = Number(process.env.INTENTS);

const { REST, Client, Events } = require("discord.js");
const client = new Client({ intents: INTENTS });
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Upload of commands
const existingTextCommands = upload.textCommands();
upload.slashCommands(rest, CLIENT_ID);

// When Client is Ready...
client.on(Events.ClientReady, () => { console.log("El cliente está listo para su ejecución.\n"); });

// Interaction Detector
client.on(Events.InteractionCreate, detectInteraction);
async function detectInteraction(interaction) {
	if (interaction.isChatInputCommand()) {
		handleInteraction.slashCommand(interaction, client);
	}
}

// Text Command Detector
client.on(Events.MessageCreate, detectTextCommand);
async function detectTextCommand(message) {
	// Command.
	const commandName = message.content.toLowerCase().slice(1).split(" ")[0];

	// Validators.
	if(message.author.bot) return;
	if(!message.content.startsWith("!")) return;
	if (!existingTextCommands.includes(commandName)) return;

	// Execution.
	handleInteraction.textCommand(message, client);
}

// Connection
client.login(TOKEN);