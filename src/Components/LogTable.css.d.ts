declare namespace LogTableCssNamespace {
	export interface ILogTableCss {
		active: string;
		app: string;
		column: string;
		copy: string;
		copyMenu: string;
		empty: string;
		highlight: string;
		level: string;
		level_1: string;
		level_2: string;
		level_3: string;
		level_4: string;
		"log-settings-toggle": string;
		logs: string;
		message: string;
		relative: string;
		row: string;
		smallHeader: string;
		time: string;
	}
}

declare const LogTableCssModule: LogTableCssNamespace.ILogTableCss & {
	/** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
	locals: LogTableCssNamespace.ILogTableCss;
};

export = LogTableCssModule;
