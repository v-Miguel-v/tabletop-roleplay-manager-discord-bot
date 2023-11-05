const { EmbedBuilder } = require("discord.js");
const evaluate = require("./../../instantiated_modules/mathjs");
const { getTextCommandPrefix, removePrefixAndKeywordsFromMessage } = require("./../../utils/textCommandTools");
const errorFilterRegex = /^[^=\[\]{}\n\r]*(\d+|(?<![a-zA-ZÀ-ÖÙ-öù-ÿ])(infinity|infinito|phi|pi|tau|e|i)(?![a-zA-ZÀ-ÖÙ-öù-ÿ]))[^=\[\]{}\n\r]*$/i

module.exports = {
	data: {
		name: "calcular",
		description: "Evalúa y resuelve la operación matemática enviada.",
		aliases: ["calc", "math", "resolver", "resol", "evaluar", "eval"],
		regexes: [],
		regexesWithPrefix: [errorFilterRegex]
	},

	async execute(message, client) {
		const prefix = getTextCommandPrefix(message.guild?.id);
		const keywords = [this.data.name, ...this.data.aliases];
		const input = removePrefixAndKeywordsFromMessage(prefix, keywords, message);
		try {
			const result = evaluate(input);
			const responseEmbed = new EmbedBuilder({
				author: { name: `Calcular: ${input}` },
				title: `Resultado: \`${result}\``
			});
			message.reply({embeds:[responseEmbed]});
		} catch (error) {
			await message.reply("Error");
			console.log(error);
		}
	}
}