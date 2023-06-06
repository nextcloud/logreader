import { LogProvider } from "./Providers/LogProvider";
import debounce from 'lodash.debounce'

export class LogSearch implements Nextcloud.Common.Plugin {
	name = 'logreader-search';
	provider: LogProvider

	constructor (provider: LogProvider) {
		this.provider = provider;
		this.initialize();
	}

	initialize () {
		window.OC.Plugins.register('OCA.Search.Core', this);
	}

	attach(search: any) {
		search.setFilter('settings', debounce((query) => {
			if (query.length >= 3 || query == '') {
				this.provider.query = query;
			}
		}, 250));
	}
}
