export class LogSearch {
	name = 'logreader-search';

	/**
	 * @param {LogProvider} provider
	 */
	constructor (provider) {
		this.provider = provider;
		this.initialize();
	}

	initialize () {
		OC.Plugins.register('OCA.Search.Core', this);
	}

	attach (search) {
		search.setFilter('settings', _.debounce((query) => {
			if (query.length >= 3 || query == '') {
				this.provider.query = query;
			}
		}, 250));
	}
}
