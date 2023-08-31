// Requeriments and Initializations
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const INTENTS = Number(process.env.INTENTS);

const { REST, Routes, Client } = require("discord.js");
const client = new Client({ intents: INTENTS });
const rest = new REST({ version: '10' }).setToken(TOKEN);

const commands = require("./commands");

// Content
try {
	console.log("Started refreshing application (/) commands.");
	(async () => await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands }))();
	console.log("Successfully reloaded application (/) commands.");
} catch (error) {
	console.error(error);
}

client.on("ready", () => { console.log(`Logged in as ${client.user.tag}!`); });

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "test") {
		await interaction.reply("Funcionando.");
	}
});

// Connection
client.login(TOKEN);