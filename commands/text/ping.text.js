const { EmbedBuilder } = require("discord.js");

module.exports = {
	data: {
		name: "ping",
		description: "Comprueba el nivel de conectividad y latencia actual del bot con discord.",
		aliases: ["test"],
		regexes: [],
		regexesWithPrefix: []
	},

	async execute(message) {
		const client = message.client;
		const regularPing = `${client.ws.ping}ms`;
		let fullSentResponsePing = "Calculando...";
		const response = await message.reply({
			embeds: [
				new EmbedBuilder({
					fields: [{
						name: "",
						value: `
						**Regular Signal Ping:** \`${regularPing}\` 📶
						_Intervalo promedio que tardan las señales enviadas entre el bot y discord._

						**Full Sent-Response Ping:** \`${fullSentResponsePing}\` 📶
						_Intervalo que tarda una señal de ida y vuelta enviada entre el bot y discord (desde el envío del mensaje con el comando hasta el envío del mensaje de respuesta)._
						`
					}]
				})
			]
		});

		const sentTime = message.createdTimestamp;
		const responseTime = response.createdTimestamp;
		fullSentResponsePing = `${responseTime - sentTime}ms`;
		await response.edit({
			embeds: [
				new EmbedBuilder({
					fields: [{
						name: "",
						value: `
						**Regular Signal Ping:** \`${regularPing}\` 📶
						_Intervalo promedio que tardan las señales enviadas entre el bot y discord._

						**Full Sent-Response Ping:** \`${fullSentResponsePing}\` 📶
						_Intervalo que tarda una señal de ida y vuelta enviada entre el bot y discord (desde el envío del mensaje con el comando hasta el envío del mensaje de respuesta)._
						`
					}]
				})
			]
		});
	}
}