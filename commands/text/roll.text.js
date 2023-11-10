const { EmbedBuilder } = require("discord.js");
const evaluate = require("./../../instantiated_modules/mathjs");
const { getTextCommandPrefix, removePrefixAndKeywordsFromMessage } = require("./../../utils/textCommandTools");
const repetitionNotation = /^(\d+)#/i;
const diceDetector = /(\d*)d(\d+|f)((kh|kl|dh|dl|k|d)(\d*))?/ig;
const diceDestructurator = /(\d*)d(\d+|f)((kh|kl|dh|dl|k|d)(\d*))?/i;
const rollCommandRegex = /^(\d+#)?(-?([\d\(\)]+\s*[\-+*\/]\s*)*)((\d*)d(\d+|f))((k|kh|kl|d|dh|dl)(\d*))?((\s*[\-+*\/]\s*[\d\(\)]+)*)((\s*[\-+*\/]\s*\d*d(\d+|f)((k|kh|kl|d|dh|dl)\d*)?(\s*[\-+*\/]\s*[\d\(\)]+)*)*)(?=[\s\n]|$)/i;

function getRandomNumber(maxValue) { return Math.floor((Math.random() * maxValue) + 1) }
function rollDice(dice, quantity, faces, keepdropingType, keepdropingAmount) {
	const result = {};
	result.diceRolled = dice;
	result.results = [];
	for (let i=0; i<quantity; i++) {
		result.results.push(getRandomNumber(faces));
	}
	if (keepdropingType) {
		const amnt = keepdropingAmount;
		const type = keepdropingType.toLowerCase();

		if (type === "kh" || type === "k") {
			result.highests = [];
			const relativeResults = [...result.results];
			for (let i=0; i<amnt; i++) {
				const maxValue = Math.max(...relativeResults);
				const valueIndex = relativeResults.findIndex(x => x === maxValue);
				result.highests.push(maxValue);
				relativeResults.splice(valueIndex, 1);
			}
		}
		if (type === "kl") {
			result.lowests = [];
			const relativeResults = [...result.results];
			for (let i=0; i<amnt; i++) {
				const minValue = Math.min(...relativeResults);
				const valueIndex = relativeResults.findIndex(x => x === minValue);
				result.lowests.push(minValue);
				relativeResults.splice(valueIndex, 1);
			}
		}
		if (type === "dl" || type === "d") {
			const relativeResults = [...result.results];
			for (let i=0; i<amnt; i++) {
				const minValue = Math.min(...relativeResults);
				const valueIndex = relativeResults.findIndex(x => x === minValue);
				relativeResults.splice(valueIndex, 1);
			}
			result.highestsNotDropped = [...relativeResults];
		}
		if (type === "dh") {
			const relativeResults = [...result.results];
			for (let i=0; i<amnt; i++) {
				const maxValue = Math.max(...relativeResults);
				const valueIndex = relativeResults.findIndex(x => x === maxValue);
				relativeResults.splice(valueIndex, 1);
			}
			result.lowestsNotDropped = [...relativeResults];
		}
	}

	const keys = Object.keys(result);
	if (keys.length > 2) result.total = result[keys[2]].reduce((a,b) => a+b);
	else result.total = result.results.reduce((a,b) => a+b);

	return result;
}

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

		// Validation
		let wasAnValidInput;
		const titleAndParametersFromInput = input.replace(rollCommandRegex, "").trim();
		const diceNotationFromInput = input.replace(titleAndParametersFromInput, "").trim();
		const inputForValidation = diceNotationFromInput.replaceAll(diceDetector, "1").replace(repetitionNotation, "");
		try {
			if (!inputForValidation) throw new Error("La notación de dados enviada como input no coincide con la regex definida.");
			evaluate(inputForValidation);
			wasAnValidInput = true;
		} catch (error) {
			console.error(error);
			wasAnValidInput = false;
			await message.reply("Ta mal 😔.");
		}

		// Execution
		if (wasAnValidInput) {
			await message.reply("Ta bien 👍.");

			const repetitions = diceNotationFromInput.match(repetitionNotation) ? Number(diceNotationFromInput.match(repetitionNotation)[1]) : 1;
			if (repetitions < 1) await message.reply("ª");
			else {
				const diceRolledResults = [];

				// Tiradas de dados
				for(let i=0; i<repetitions; i++) {
					const currentIteration = [];
					const diceRolled = diceNotationFromInput.match(diceDetector);
					diceRolled.forEach(dice => {
						diceParts = dice.match(diceDestructurator);
						const quantity = diceParts[1];
						const faces = diceParts[2];
						const keepdropingType = diceParts[4];
						const keepdropingAmount = diceParts[5];

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
				resultsToBeEvaluated.forEach(mathExpression => { finalResults.push(evaluate(mathExpression)) });

				// Resultado Final
				await message.channel.send(`Tirada Original: ${diceNotationFromInput}\n\`\`\`js\n${JSON.stringify(diceRolledResults)}\n\`\`\`\nResultados: ${finalResults}`);
			}
		}
	}
}