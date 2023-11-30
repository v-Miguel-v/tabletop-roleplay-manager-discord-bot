const fs = require("node:fs");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tirada")
		.setDescription("Realiza tiradas directamente desde tu ficha de personaje.")

		.addSubcommandGroup( subcommandGroup => subcommandGroup
			.setName("de")
			.setDescription("Realiza tiradas directamente desde tu ficha de personaje.")

			.addSubcommand( subcommand => subcommand
				.setName("característica")
				.setDescription("Realiza tiradas de característica directamente desde tu ficha de personaje.")
				.addStringOption( option => option
					.setName("característica")
					.setDescription("Selecciona la tirada de característica a realizar.")
					.setRequired(true)
					.addChoices(
						{ name: "Fuerza", value: "strenght" },
						{ name: "Destreza", value: "dexterity" },
						{ name: "Constitución", value: "constitution" },
						{ name: "Inteligencia", value: "intelligence" },
						{ name: "Sabiduría", value: "wisdom" },
						{ name: "Carisma", value: "charisma" }
					)
				)
				.addStringOption( option => option
					.setName("tipo-de-ventaja")
					.setDescription("Selecciona si la tirada será o no con ventaja")
					.addChoices(
						{ name: "Ventaja", value: "advantage" },
						{ name: "Desventaja", value: "disadvantage" },
						{ name: "Normal", value: "normal" }
					)
				)
			)

			.addSubcommand( subcommand => subcommand
				.setName("habilidad")
				.setDescription("Realiza tiradas de habilidad directamente desde tu ficha de personaje.")
				.addStringOption( option => option
					.setName("habilidad")
					.setDescription("Selecciona la tirada de habilidad a realizar.")
					.setRequired(true)
					.addChoices(
						{ name: "Acrobacias", value: "acrobatics" },
						{ name: "Arcanos", value: "arcana" },
						{ name: "Atletismo", value: "athletics" },
						{ name: "Engaño", value: "deception" },
						{ name: "Historia", value: "history" },
						{ name: "Interpretación", value: "performance" },
						{ name: "Intimidación", value: "intimidation" },
						{ name: "Investigación", value: "investigation" },
						{ name: "Juego de Manos", value: "sleight of hand" },
						{ name: "Medicina", value: "medicine" },
						{ name: "Naturaleza", value: "nature" },
						{ name: "Percepción", value: "perception" },
						{ name: "Perspicacia", value: "insight" },
						{ name: "Persuación", value: "persuasion" },
						{ name: "Religión", value: "religion" },
						{ name: "Sigilo", value: "stealth" },
						{ name: "Supervivencia", value: "survival" },
						{ name: "Trato con Animales", value: "animal handling" }
					)
				)
				.addStringOption( option => option
					.setName("tipo-de-ventaja")
					.setDescription("Selecciona si la tirada será o no con ventaja.")
					.addChoices(
						{ name: "Ventaja", value: "advantage" },
						{ name: "Desventaja", value: "disadvantage" },
						{ name: "Normal", value: "normal" }
					)
				)
			)

			.addSubcommand( subcommand => subcommand
				.setName("salvación")
				.setDescription("Realiza tiradas de salvación directamente desde tu ficha de personaje.")
				.addStringOption( option => option
					.setName("salvación")
					.setDescription("Selecciona la tirada de salvación a realizar.")
					.setRequired(true)
					.addChoices(
						{ name: "Fuerza", value: "strenght" },
						{ name: "Destreza", value: "dexterity" },
						{ name: "Constitución", value: "constitution" },
						{ name: "Inteligencia", value: "intelligence" },
						{ name: "Sabiduría", value: "wisdom" },
						{ name: "Carisma", value: "charisma" },
						{ name: "Muerte", value: "death" }
					)
				)
				.addStringOption( option => option
					.setName("tipo-de-ventaja")
					.setDescription("Selecciona si la tirada será o no con ventaja.")
					.addChoices(
						{ name: "Ventaja", value: "advantage" },
						{ name: "Desventaja", value: "disadvantage" },
						{ name: "Normal", value: "normal" }
					)
				)
			)

			.addSubcommand( subcommand => subcommand
				.setName("clímax")
				.setDescription("Realiza salvaciones de clímax directamente desde tu ficha de personaje.")
				.addStringOption( option => option
					.setName("tipo-de-ventaja")
					.setDescription("Selecciona si la tirada será o no con ventaja.")
					.addChoices(
						{ name: "Ventaja", value: "advantage" },
						{ name: "Desventaja", value: "disadvantage" },
						{ name: "Normal", value: "normal" }
					)
				)
				.addStringOption( option => option
					.setName("característica")
					.setDescription("Selecciona la característica a usar para la salvación.")
					.addChoices(
						{ name: "Sabiduría", value: "wisdom" },
						{ name: "Constitución", value: "constitution" },
						{ name: "Por Defecto", value: "default" }
					)
				)
			)
		),

	async execute(interaction) {
		if (interaction.user.id !== "759245824433324082") interaction.reply("No puedes usar la ficha de Katy/Domi 😔.")
		else {
			const fileRoute = "./local_database/character_sheets_saved/katydomi.json";
			const KatyDomi = JSON.parse(fs.readFileSync(fileRoute, "utf-8"));

			const basicInformation = KatyDomi.characterSheet.basicInformation;
			const mainCharacteristics = KatyDomi.characterSheet.mainCharacteristics;
			const proficienciesAndLanguages = KatyDomi.characterSheet.proficienciesAndLanguages;
			const traitsAndFeats = KatyDomi.characterSheet.traitsAndFeats;
			const inventory = KatyDomi.characterSheet.inventory;
			const combatStats = KatyDomi.characterSheet.combatStats;
			const quickAccess = KatyDomi.characterSheet.quickAccess;
			const magic = KatyDomi.characterSheet.magic;
			const remainingUses = KatyDomi.characterSheet.remainingUses;
			const alteredStatesAndConditions = KatyDomi.characterSheet.alteredStatesAndConditions;

			//* Tiradas de Característica
			if (interaction.options.getSubcommand() === "característica") {
				const chosenAbility = interaction.options.getString("característica");
				const advantage = interaction.options.getString("tipo-de-ventaja");

				let roll = "1d20";
				let advantageType = "";
				if (advantage === "advantage") {
					roll = "2d20kh1";
					advantageType = " (Ventaja)";
				}
				if (advantage === "disadvantage") {
					roll = "2d20kl1";
					advantageType = " (Desventaja)";
				}

				const name = mainCharacteristics.abilities[chosenAbility].name;
				const modifier = mainCharacteristics.abilities[chosenAbility].modifier;
				const text = `Tirada de ${name}${advantageType}`;

				const result = rolling(`${roll}${modifier < 0 ? "" : "+"}${modifier}`, text, basicInformation.name, interaction);
				if (!result) interaction.reply("Ocurrió un error 😭.");
				else interaction.reply({ embeds: [result] });
			}

			//* Tiradas de Salvación
			if (interaction.options.getSubcommand() === "salvación") {
				const chosenAbility = interaction.options.getString("salvación");
				const advantage = interaction.options.getString("tipo-de-ventaja");

				let roll = "1d20";
				let advantageType = "";
				if (advantage === "advantage") {
					roll = "2d20kh1";
					advantageType = " (Ventaja)";
				}
				if (advantage === "disadvantage") {
					roll = "2d20kl1";
					advantageType = " (Desventaja)";
				}

				const name = chosenAbility === "death" ? "Muerte" : mainCharacteristics.abilities[chosenAbility].name;
				const modifier = chosenAbility === "death" ? 0 : mainCharacteristics.abilities[chosenAbility].modifier;
				const text = `Salvación de ${name}${advantageType}`;

				const result = rolling(`${chosenAbility === "death" ? roll : `${roll}${modifier < 0 ? "" : "+"}${modifier}`}`, text, basicInformation.name, interaction);
				if (!result) interaction.reply("Ocurrió un error 😭.");
				else interaction.reply({ embeds: [result] });
			}
		}
	}
}

const evaluate = require("./../../instantiated_modules/mathjs");
const { rollDice, isAnValidDice } = require("./../text/roll/tools");
const repetitionNotation = /^(\d+)#/i;
const diceDetector = /(\d*)d(\d+|f)((kh|kl|dh|dl|k|d)(\d*))?/ig;
const diceDestructurator = /(\d*)d(\d+|f)((kh|kl|dh|dl|k|d)(\d*))?/i;
function rolling(roll, rollName, charName, interaction) {
		// Data
		const titleAndParametersFromInput = rollName;
		const diceNotationFromInput = roll;

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
			return null;
		}

		// Execution
		if (wasAnValidInput) {
			interaction
			let repetitions = 1;
			const hasRepetitions = diceNotationFromInput.match(repetitionNotation);
			if (hasRepetitions) repetitions = Number(hasRepetitions[1]);

			if (repetitions < 1) return null;
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
							footer: { text: `Tirada de ${charName}\n(hecha por @${interaction.user.username})`, icon_url: interaction.user.displayAvatarURL() }
						});
					} else {
						embed = new EmbedBuilder({
							author: { name: `${titleAndParametersFromInput || "Resultado"}:` },
							fields: [{ name: "", value: responseMessage[0].value }],
							footer: { text: `Tirada de ${charName}\n(hecha por @${interaction.user.username})`, icon_url: interaction.user.displayAvatarURL() }
						});
					}

					// Función para dejar un solo espacio entre cada símbolo (+ - * / ^) y sus números/dados.
					function fixTextNotation(text) {
						const symbols = ["+","-","*","/","^"];
						const textWithoutSpaces = text.replaceAll(" ", "");

						let finalText = textWithoutSpaces;
						symbols.forEach(sym => {
							finalText = finalText.replaceAll(sym, ` ${sym} `);
						});

						return finalText;
					}

					// Función para dar un formato bonito a los resultados antes de enviarlos en el embed.
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

					// await interaction.channel.send(`Tirada Original: ${diceNotationFromInput}\n\`\`\`js\n${JSON.stringify(diceRolledResults)}\n\`\`\`\nResultados: ${finalResults}`);
					return embed;
				} catch (error) {
					console.error(error);
					return null;
				}
			}
		}
}