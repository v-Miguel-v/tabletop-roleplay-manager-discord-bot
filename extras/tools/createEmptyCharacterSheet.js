const fs = require("node:fs");

module.exports = (owner, type) => {
	const typeRoute = type.replace(/\s/g, "_");
	const fileRoute = `./extras/character_sheet_types/${typeRoute}/character-sheet-format.json`;
	const characterSheet = JSON.parse(fs.readFileSync(fileRoute, "utf-8"));
	const rightNow = new Date();
	const ID = `${rightNow.getTime()}${owner.id}`;

	characterSheet.metadata.id = ID
	characterSheet.metadata.owner = owner;
	characterSheet.metadata.type = type;
	characterSheet.metadata.creationDate = rightNow;
	characterSheet.metadata.lastUpdate = rightNow;

	const characterSheetJSON = JSON.stringify(characterSheet);
	fs.writeFileSync(`./extras/character_sheets_saved/${ID}.json`, characterSheetJSON);
}