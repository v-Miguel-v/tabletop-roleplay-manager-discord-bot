const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: {
		initial: new EmbedBuilder({
			title: "📝  Creador de Fichas de Personaje  📝",
			fields: [{
				name: "Paso 1: Nombre",
				value: "> Envíe un mensaje con el nombre del personaje."
			}]
		}),
		confirmation(value) {
			return new EmbedBuilder({
				title: "📝  Creador de Fichas de Personaje  📝",
				fields: [{
					name: "__Confirmación__ del Paso 1: Nombre",
					value: `
						> El nombre del personaje será **\`${value}\`**.
						> _(puede cambiar el nombre enviando otro mensaje)_
					`
				}]
			});
		}
	},

	firstType: {
		initial: new EmbedBuilder({
			title: "📝  Creador de Fichas de Personaje  📝",
			fields: [{
				name: "Paso 2: Primer Tipo",
				value: "> Seleccione el primer tipo de la ficha."
			}]
		}),
		confirmation(value) {
			return new EmbedBuilder({
				title: "📝  Creador de Fichas de Personaje  📝",
				fields: [{
					name: "__Confirmación__ del Paso 2: Primer Tipo",
					value: `
						> El primer tipo de la ficha será **\`${value}\`**.
						> _(presione rechazar para volver a elegir el tipo)_
					`
				}]
			});
		}
	},

	secondType: {
		initial: new EmbedBuilder({
			title: "📝  Creador de Fichas de Personaje  📝",
			fields: [{
				name: "Paso 3: Segundo Tipo",
				value: "> Seleccione el segundo tipo de la ficha."
			}]
		}),
		confirmation(value) {
			return new EmbedBuilder({
				title: "📝  Creador de Fichas de Personaje  📝",
				fields: [{
					name: "__Confirmación__ del Paso 3: Segundo Tipo",
					value: `
						> El segundo tipo de la ficha será **\`${value}\`**.
						> _(presione rechazar para volver a elegir el tipo)_
					`
				}]
			});
		}
	},
}