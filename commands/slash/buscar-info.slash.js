const fs = require("node:fs");
const { SlashCommandBuilder } = require("discord.js");
const databaseRoute = "./local_database";
const globalCharRoute = `${databaseRoute}/character_sheet_types`;

const trpgAvailable = [];
fs.readdirSync(globalCharRoute).forEach(trpg => {
	if (fs.readdirSync(`${globalCharRoute}/${trpg}`).includes("data-and-rules.js")) {
		const trpgFormatted = trpg.replace(/_/g, " ");
		trpgAvailable.push({ name: trpgFormatted, value: trpgFormatted });
	}
});

const searchIndexes = {};
trpgAvailable.forEach(trpg => {
	const trpgDesformatted = trpg.name.replace(/ /g, "_");
	const dataAndRulesUsedByTheTRPG = require(`../../${globalCharRoute}/${trpgDesformatted}/data-and-rules.js`);
	searchIndexes[`${trpgDesformatted}_index`] = [];
	dataAndRulesUsedByTheTRPG.forEach(dataset => {
		const datasetRoute = `${databaseRoute}/data_and_rules/${dataset}_data`;
		const data = fs.readFileSync(`${datasetRoute}/0-search-index-spanish.txt`, "utf-8").toString().split("\r\n").filter(x => x !== "");
		const mergedData = searchIndexes[`${trpgDesformatted}_index`].concat(data);
		searchIndexes[`${trpgDesformatted}_index`] = mergedData;
	});
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName("buscar-info")
		.setDescription("Busca y muestra información (clases, razas, reglas...) del juego de rol especificado.")
		.addStringOption(option => option
			.setName("juego-de-rol")
			.setDescription("El juego de rol en el cual se buscará la información.")
			.setRequired(true)
			.addChoices(...trpgAvailable)
		)
		.addStringOption(option => option
			.setName("barra-de-búsqueda")
			.setDescription("Aquí se ingresa el término específico (clases, razas, reglas...) que se buscará.")
			.setRequired(true)
			.setAutocomplete(true)
		),

	async autocomplete(interaction, client) {
		const trpgSelected = interaction.options.getString("juego-de-rol").replace(/ /g, "_");
		const input = interaction.options.getFocused().toLowerCase();
		let choices = searchIndexes[`${trpgSelected}_index`];
		const filtered = choices.filter(choice => {
			const regex = /[\s()\[\]]/g; // All Spaces, () and [].
			const inputs = input.split(" ").filter(x => x !== "");
			const words = choice.toLowerCase().split(regex).filter(x => x !== "");
			// return words.some(word => word.startsWith(input)); // Versión Antigua
			if (inputs.length > words.length) return false; // Si la cantidad de palabras ingresadas en el input es mayor a cualquier cantidad de palabras de los resultados, directamente no encontrará ningún resultado, así que retorna "false".
			const copiedWords = [...words]; // Copiamos el array words ya que, para poder realizar adecuadamente el funcionamiento de la barra de búsqueda necesitaremos modificar y eliminar elmentos del array, así que para no alterar el original creamos una copia.
			inputs.forEach(input => { // Para cada una de las palabras del input...
				let indexToDelete = null; // 1. Inicializamos una variable "indexToDelete" en null.
				if (copiedWords.some((word, index) => { // 2. (Condicional) Preguntamos: ¿En la lista de palabras (copiadas) de los resultados "words", hay alguna que empiece con la palabra actual del input?
					indexToDelete = index; // 2.1 Guardamos el índice de la palabra "word" del resultado que hizo match con el input.
					return word.startsWith(input); // 2.2 Verificamos la condición.
				})) {
					copiedWords.splice(indexToDelete, 1); // 3. Si la condición se cumple, antes de pasar a la siguiente palabra del input, borramos de la copia de la lista de palabras del resultado (copiedWords) la palabra con el índice que hizo match. Así, para la siguiente iteración, esa palabra no estará.
				}
			});
			const allInputsMatched = (words.length - inputs.length) === (copiedWords.length); // Tras finalizar el forEach, y por tanto la evaluación del fragmento de código anterior para todas y cada una de las palabras del input... verificamos si todas las palabras hicieron Match mediante una resta. Si todas las palabras hicieron match, entonces a copiedWords se le borraron una cantidad de elementos iguales a la cantidad de elementos del input (porque precisamente los elementos del input eran los que se estaban iterando). En otras palabras: Si restamos de la cantidad de palabras del resultado (words) la cantidad de palabras del input (input), el resultado debería ser igual a la cantidad actual de elementos de la copia luego de la iteración si todas las palabras hicieron match.
			return allInputsMatched ? true : false; // En caso de que sí, se retorna true, en caso de que no, se retorna false. Esta parte es algo redundante, pero es más que todo para darle más legibilidad y casi se pueda leer la frase "If all inputs matched... Then return true, if not, return false".
		}).splice(0, 24);
		await interaction.respond( filtered.map(choice => ({ name: choice, value: choice })) );
	},

	async execute(interaction, client) {
		interaction.reply("Working");
	}
}