const repetitionNotation = /^(\d+)#/i;

module.exports = {
	getRandomNumber(maxValue) { // Retorna un valor aleatorio entre 1 y un número máximo.
		return Math.floor((Math.random() * maxValue) + 1);
	},

	rollDice(dice, quantity, faces, keepdropingType, keepdropingAmount) {
		if (quantity === 0) throw new Error("0 dice");
		if (faces === 0) throw new Error("0 faces");

		function getRandomNumber (maxValue) {
			if (maxValue === "f") return (Math.floor((Math.random() * 3) + 1)) - 2;
			else return Math.floor((Math.random() * maxValue) + 1);
		}

		const result = {};
		result.diceRolled = dice;
		result.results = [];
		for (let i=0; i<quantity; i++) {
			result.results.push(getRandomNumber(faces));
		}
		if (keepdropingType) {
			let amnt = keepdropingAmount;
			const type = keepdropingType.toLowerCase();

			if (type === "kh" || type === "k") {
				if (keepdropingAmount === 0) throw new Error("keep 0");
				if (keepdropingAmount > quantity) amnt = quantity;
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
				if (keepdropingAmount === 0) throw new Error("keep 0");
				if (keepdropingAmount > quantity) amnt = quantity;
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
				if (keepdropingAmount >= quantity) throw new Error("drop all");
				const relativeResults = [...result.results];
				for (let i=0; i<amnt; i++) {
					const minValue = Math.min(...relativeResults);
					const valueIndex = relativeResults.findIndex(x => x === minValue);
					relativeResults.splice(valueIndex, 1);
				}
				result.highestsNotDropped = [...relativeResults];
			}
			if (type === "dh") {
				if (keepdropingAmount >= quantity) throw new Error("drop all");
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
}