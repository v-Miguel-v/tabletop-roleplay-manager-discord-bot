module.exports = {
	formatSelectedOptions(array) {
		if (array.length === 1) return String(array);

		const string = String(array).replaceAll(",", ", ");
		const lastComma = string.lastIndexOf(",");
		const replacement = " y";

		const newString = string.slice(0, lastComma) + replacement + string.slice(lastComma+1);
		return newString;
	}
}