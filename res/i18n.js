const fs = require('fs');

const filename = './res/dict.json';

const dictionary = (() => {
	let dict;
	let time;

	return () => {
		const stat = fs.statSync(filename);
		if (!dict || time < stat.mtime) {
			const data = fs.readFileSync('./res/dict.json', 'utf-8');
			dict = JSON.parse(data);
			time = stat.mtime;
		}

		return dict;
	};
})();

module.exports = (lang) => {
	const dict = dictionary();

	const i18n = (item, section = 'general') => {
		if (typeof item === 'string') {
			if (dict[section] && dict[section][item] && dict[section][item][lang])
				return dict[section][item][lang];

			console.error(`Dictionary ${section}.${item}.${lang} is not defined.`);
			return item;
		}

		if (typeof item === 'number' ) {
			console.error(`Dictionary ${section}.${item}.${lang} is not defined.`);
			return item;
		}

		if (typeof item === 'object')
			return item[lang] ?? '';

		return '';
	};

	i18n.lang = lang;

	i18n.languages = module.exports.languages;

	i18n.currencies = [ 'UAH', 'EUR', 'USD' ];

	i18n.countries = Object.keys(dict.countries);

	i18n.states = Object.keys(dict.states);

	i18n.price = (price, currency) => {
		
		const f = new Intl.NumberFormat(lang, { style: 'currency', currency });
		return f.format(price);
	};

	i18n.measurements = (measurements) => {
		const w = { 'title': -2, 'size': -1 };

		const keys = [ ... measurements.reduce((k, m) => { Object.keys(m).forEach(n => k.add(n)); return k; }, new Set()) ];
		keys.sort((a, b) => (w[a] || 0) - (w[b] || 0));
		return keys.map(n => ({ name: n, i18n: i18n(n, 'measurements') }));
	};

	i18n.measurements.translate = (v) => {
		if (typeof v === 'object') {
			if (v.min && v.max)
				return `${v.min}-${v.max}`;
		}
		return v;
	};

	return i18n;
};

module.exports.languages = [ 'uk', 'en' ];

