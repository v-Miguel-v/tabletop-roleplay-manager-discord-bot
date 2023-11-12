const { EmbedBuilder } = require("discord.js");

const evaluate = require("./../../instantiated_modules/mathjs");
const { rollDice, isAnValidDice } = require("./roll/tools");
const { getTextCommandPrefix, removePrefixAndKeywordsFromMessage } = require("./../../utils/textCommandTools");

const repetitionNotation = /^(\d+)#/i;
const diceDetector = /(\d*)d(\d+|f)((kh|kl|dh|dl|k|d)(\d*))?/ig;
const diceDestructurator = /(\d*)d(\d+|f)((kh|kl|dh|dl|k|d)(\d*))?/i;
const rollCommandRegex = /^(\d+#)?(-?([\d\(\)]+\s*[\-+*\/]\s*)*)((\d*)d(\d+|f))((k|kh|kl|d|dh|dl)(\d*))?((\s*[\-+*\/]\s*[\d\(\)]+)*)((\s*[\-+*\/]\s*\d*d(\d+|f)((k|kh|kl|d|dh|dl)\d*)?(\s*[\-+*\/]\s*[\d\(\)]+)*)*)(?=[\s\n]|$)/i;

module.exports = {
	data: {
		name: "roll",
		description: "Genera un resultado aleatorio a partir de los dados lanzados.",
		aliases: ["r", "lanza", "tira", "lanzar", "tirar"],
		regexes: [rollCommandRegex],
		regexesWithPrefix: [rollCommandRegex]
	},

	async execute(message, client) {
		// Get input (dice roll parameters)
		const prefix = getTextCommandPrefix(message.guild?.id);
		const keywords = [this.data.name, ...this.data.aliases];
		const input = removePrefixAndKeywordsFromMessage(prefix, keywords, message);

		// Data
		const titleAndParametersFromInput = input.replace(rollCommandRegex, "").trim();
		const diceNotationFromInput = input.replace(titleAndParametersFromInput, "").trim();

		// Validation
		let wasAnValidInput;
		const valid = diceNotationFromInput.replaceAll(diceDetector, "1").replace(repetitionNotation, "");
		try {
			if (!valid) throw new Error();
			evaluate(valid);
			wasAnValidInput = true;
		} catch (error) {
			console.error(error);
			wasAnValidInput = false;
			await message.reply("Ta mal 😔.");
		}

		// Execution
		if (wasAnValidInput) {
			let repetitions = 1;
			const hasRepetitions = diceNotationFromInput.match(repetitionNotation);
			if (hasRepetitions) repetitions = Number(hasRepetitions[1]);

			if (repetitions < 1) await message.reply("ª");
			else {
				try {
					const diceRolledResults = [];

					// Tiradas de dados
					const diceRolled = diceNotationFromInput.match(diceDetector);
					for (let i=0; i<repetitions; i++) {
						const currentIteration = [];
						diceRolled.forEach(dice => {
							diceParts = dice.match(diceDestructurator);
							const quantity = diceParts[1] === "" ? 1 : Number(diceParts[1]);
							const faces = diceParts[2].toLowerCase() === "f" ? "f" : Number(diceParts[2]);
							const keepdropingType = diceParts[4];
							const keepdropingAmount = Number(diceParts[5]);

							const result = rollDice(dice, quantity, faces, keepdropingType, keepdropingAmount);
							currentIteration.push(result);
						});
						diceRolledResults.push(currentIteration);
					}

					// Sustitución de los Resultados en el Input Inicial
					const resultsToBeEvaluated = [];
					diceRolledResults.forEach(repetitions => {
						let diceNotationForEvaluation = `${diceNotationFromInput.replace(repetitionNotation, "")}`;
						repetitions.forEach(result => {
							const dice = result.diceRolled;
							const value = result.total;
							diceNotationForEvaluation = diceNotationForEvaluation.replace(dice, value);
						});
						resultsToBeEvaluated.push(diceNotationForEvaluation);
					});

					// Aplicación de los Modificadores y Cálculo Final del Resultado
					const finalResults = [];
					resultsToBeEvaluated.forEach(result => { finalResults.push(evaluate(result)) });

					// Mensaje de Respuesta
					let embed;
					const responseMessage = formatDiceResults(diceNotationFromInput, diceRolledResults, finalResults);
					if (responseMessage.length > 1) {
						embed = new EmbedBuilder({
							author: { name: `${titleAndParametersFromInput || "Resultados"}:` },
							fields: [...responseMessage, {name:"", value:`Total: ${finalResults.reduce((x, y) => x+y)}`}],
							footer: { text: `Tirada hecha por @${message.author.username}`, icon_url: message.author.displayAvatarURL() }
						});
					} else {
						embed = new EmbedBuilder({
							author: { name: `${titleAndParametersFromInput || "Resultado"}:` },
							fields: [{ name: "", value: responseMessage[0].value }],
							footer: { text: `Tirada hecha por @${message.author.username}`, icon_url: message.author.displayAvatarURL() }
						});
					}

					// Función para dejar un espacio entre cada símbolo (+ - * / ^)
					function fixTextNotation(text) {
						const symbols = ["+","-","*","/","^"];
						const textWithoutSpaces = text.replaceAll(" ", "");

						let finalText = textWithoutSpaces;
						symbols.forEach(sym => {
							finalText = finalText.replaceAll(sym, ` ${sym} `);
						});

						return finalText;
					}

					// Función para dar un formato bonito a los resultso antes de enviarlos en el embed.
					function formatDiceResults(originalInput, diceRolled, results) {
						const originalInputFixed = fixTextNotation(originalInput);
						const messageWithFormat = [];
						diceRolled.forEach((roll, index) => {
							messageWithFormat.push(`${originalInputFixed.replace(repetitionNotation, "")}`);
							roll.forEach(dice => {
								const name = dice.diceRolled;
								const value = Number(dice.total);

								const diceParts = name.match(diceDestructurator);
								const quantity = diceParts[1] === "" ? 1 : Number(diceParts[1]);
								const faces = diceParts[2].toLowerCase() === "f" ? "f" : Number(diceParts[2]);
								const keepdropingType = diceParts[4];

								let diceWithFormat;

								if (quantity === 1) {
									if (faces === "f") {
										if (value === -1) diceWithFormat = `[-] ${name}`;
										if (value === 0) diceWithFormat = `[0] ${name}`;
										if (value === 1) diceWithFormat = `[+] ${name}`;
									} else {
										const critical = (value === faces) || (value === 1);
										if (critical) diceWithFormat = `[**__${value}__**] ${name}`;
										else diceWithFormat = `[${value}] ${name}`;
									}
								}

								if (quantity > 1) {
									diceWithFormat = JSON.stringify(dice.results).replaceAll(",", ", ");
									dice.results.forEach(result => {
										if (faces === "f") {
											diceWithFormat = diceWithFormat.replaceAll(new RegExp(`(?<!-)1`, "g"), "+");
											diceWithFormat = diceWithFormat.replaceAll("-1", "-");
										} else {
											if (result === 1 || result === faces)
												diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!\\*\\*__)${result}(?!__\\*\\*)`), `**__${result}__**`);
										}
									});

									if (keepdropingType) {
										const keys = Object.keys(dice);
										const remainingResults = [...dice.results];
										dice[keys[2]].forEach(result => {
											const valueIndex = remainingResults.findIndex(x => x === result);
											remainingResults.splice(valueIndex, 1);
										});
										if (faces === "f") {
											remainingResults.forEach(result => {
												if (result === 1) diceWithFormat = diceWithFormat.replace("+", "̷+̷");
												if (result === -1) diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!\u0337)-(?!\u0337)`), "\u0337-\u0337");
												if (result === 0) diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!~~)${result}(?!~~)`), `~~${result}~~`);
											});
										} else {
											remainingResults.forEach(result => {
												diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!~~)${result}(?!~~)`), `~~${result}~~`);
											});
										}

									}

									diceWithFormat = `${diceWithFormat} ${name}`;
								}

								messageWithFormat[index] = messageWithFormat[index].replace(new RegExp(`(?<!(\\[\\d+\\] ))${name}`, "i"), diceWithFormat);
							});
							messageWithFormat[index] = `\` ${results[index]} \` ⟵ `.concat(messageWithFormat[index]);
						});

						return messageWithFormat.map(msg => { return {name: "", value: msg} });
					}

					// await message.channel.send(`Tirada Original: ${diceNotationFromInput}\n\`\`\`js\n${JSON.stringify(diceRolledResults)}\n\`\`\`\nResultados: ${finalResults}`);
					await message.reply({ embeds: [embed] });
				} catch (error) {
					message.reply(`Errorcito de tipo: "${error.message}" 👉 👈. Sumimasen.`);
					console.error(error);
				}
			}
		}
	}
}