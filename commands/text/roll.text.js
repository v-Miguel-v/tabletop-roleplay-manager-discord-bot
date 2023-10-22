const { EmbedBuilder } = require("discord.js");
const { getTextCommandPrefix } = require("./../../utils/textCommandTools");
function getRandomNumber(maxValue) { return Math.floor((Math.random() * maxValue) + 1) }
const diceNotation = /^(\d+#)?((\d+[\-+*\/])*)((\d*)d(\d+|f))((k|kh|kl|d|dh|dl)(\d*))?(([\-+*\/]\d+)*)(([\-+*\/]\d*d(\d+|f)((k|kh|kl|d|dh|dl)\d*)?([\-+*\/]\d+)*)*)(?=[\s\n]|$)/i;

module.exports = {
	data: {
		name: "roll",
		description: "Genera un resultado aleatorio a partir de los dados lanzados.",
		aliases: ["r", "lanza", "tira", "lanzar", "tirar"],
		regexes: [diceNotation],
		regexesWithPrefix: [diceNotation]
	},

	async execute(message, client) {
		const prefix = getTextCommandPrefix(message.guild.id);
		let commandRollData = null;

		// Removing Prefix from the original message
		if (message.content.startsWith(prefix)) {
			const commandWithoutPrefix = message.content.slice(prefix.length);
			const keywords = [this.data.name, ...this.data.aliases];
			keywords.forEach(keyword => {
				const regex = new RegExp(`^${keyword} `, "i");
				if (regex.test(commandWithoutPrefix)) commandRollData = commandWithoutPrefix.slice(keyword.length+1);
			});
			if (!commandRollData) commandRollData = commandWithoutPrefix;
		} else {
			commandRollData = message.content;
		}

		// Notation Validation
		if (!diceNotation.test(commandRollData)) {
			await message.reply("❌ notación incorrecta ❌");
		} else {
		// Execution
			await message.reply("✅ notación correcta ✅");

			/*
			const fullDiceAndModifiers = commandRollData.split(" ")[0];

			let diceAndModifiers = fullDiceAndModifiers;

			let repetitions = 1;
			if (diceAndModifiers.includes("#")) {
				repetitions = diceAndModifiers.split("#")[0];
				diceAndModifiers = diceAndModifiers.split("#")[1];
			}
			await message.channel.send(`Repeticiones: ${repetitions}`);

			let numberOfDice = 1;
			if (diceAndModifiers.includes("d") || diceAndModifiers.includes("D")) {

			}
			*/
		}
	}
}