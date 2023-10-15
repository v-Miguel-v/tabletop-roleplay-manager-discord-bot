module.exports = {
	data: {
		name: "prueba",
		description: "Comando de prueba para comprobar el funcionamiento de los comandos de texto keywordless.",
		aliases: [],
		regexes: [/prueba/gi]
	},

	async execute(message, client) {
		message.reply("Escribiste la palabra `prueba` en el mensaje anterior");
	}
}