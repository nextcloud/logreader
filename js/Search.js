export class LogSearch {
	/**
	 * @param {LogProvider} provider
	 */
	constructor (provider) {
		this.provider = provider;
		this.initialize();
	}

	initialize () {
		OC.Plugins.register('OCA.Search', this);
	}

	attach (search) {
		search.setFilter('logreader', _.debounce((query) => {
			if (query.length >= 3 || query === '') {
				this.provider.query = query;
			}
		}, 250));
	}
}
