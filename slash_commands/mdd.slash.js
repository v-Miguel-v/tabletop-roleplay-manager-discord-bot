const tools = require("./mdd/tools");
const steps = require("./mdd/steps");
const { SlashCommandBuilder, Events } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mdd")
		.setDescription("Envía un mensaje privado (versión modulada)."),

	async execute(interaction, client) {
		const user = interaction.user;
		await interaction.reply(`_Se envió un mensaje privado a ${user}._`);

		let currentIteration = 1;
		const keys = Object.keys(steps);
		const finalIteration = keys.length;

		async function executeIteration() {
			if (currentIteration > finalIteration) showResults();
			else {
				const step = keys[currentIteration-1];
				const initialEmbed = steps[step].initialEmbed;
				const initialComponents = steps[step].initialComponents;
				const previousMessage = await user.send({ embeds: [initialEmbed], components: initialComponents });
				const userPrivateChannel = previousMessage.channelId;

				if (steps[step].type === "input") {
					client.on(Events.MessageCreate, registerInput);
					async function registerInput(message) {
						if (message.author.bot) return;
						if (message.channelId === userPrivateChannel) {
							const input = message.content;
							steps[step].value = input;
							const confirmationEmbed = steps[step].confirmationEmbed(input);
							const confirmationComponents = steps[step].confirmationComponents;
							await previousMessage.edit({ embeds: [confirmationEmbed], components: confirmationComponents });
						}
					}

					client.on(Events.InteractionCreate, confirmInput);
					async function confirmInput(interaction) {
						const acceptButtonId = steps[step].confirmationComponents[0].components[0].data.custom_id;
						if (interaction.isButton() && interaction.customId === acceptButtonId) {
							client.off(Events.MessageCreate, registerInput);
							client.off(Events.InteractionCreate, confirmInput);
							await previousMessage.delete();
							currentIteration++;
							executeIteration();
						}
					}

					// pasada x cantidad de tiempo el .on debería quitarse solo si no se pulsa el botón.
				}

				if (steps[step].type === "selection") {
					client.on(Events.InteractionCreate, registerSelection);
					async function registerSelection(interaction) {
						const selectMenuId = steps[step].initialComponents[0].components[0].data.custom_id;
						if (interaction.isAnySelectMenu() && interaction.customId === selectMenuId) {
							steps[step].value = interaction.values;
							const selection = tools.formatSelectedOptions(interaction.values);
							const confirmationEmbed = steps[step].confirmationEmbed(selection);
							const confirmationComponents = steps[step].confirmationComponents;
							await previousMessage.edit({ embeds: [confirmationEmbed], components: confirmationComponents });
						}

						const acceptButtonId = steps[step].confirmationComponents[0].components[0].data.custom_id;
						if (interaction.isButton() && interaction.customId === acceptButtonId) {
							client.off(Events.InteractionCreate, registerSelection);
							await previousMessage.delete();
							currentIteration++;
							executeIteration();
						}

						const rejectButtonId = steps[step].confirmationComponents[0].components[1].data.custom_id;
						if (interaction.isButton() && interaction.customId === rejectButtonId) {
							await previousMessage.edit({ embeds: [initialEmbed], components: initialComponents });
						}
					}

					// pasada x cantidad de tiempo el .on debería quitarse solo si no se pulsa el botón.
				}
			}
		}

		function showResults() {
			const results = [];
			for (const step in steps) results.push(steps[step].value);
			user.send(`${results}`);
		}

		executeIteration();
	}
}