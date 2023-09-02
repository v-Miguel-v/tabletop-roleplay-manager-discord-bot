const fs = require("node:fs");

module.exports = async (interaction) => {
	const previousInteraciton = JSON.parse(fs.readFileSync("./select_menus/var/1st.values", "utf-8"));

	await interaction.update({
		content: `Las opciones seleccionadas fueron **${previousInteraciton.value}** y **${interaction.values[0]}**`,
		components: [],
		ephemeral: true
	});
}