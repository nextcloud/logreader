declare namespace LogUploaderCssNamespace {
	export interface ILogUploaderCss {
		logSelect: string;
	}
}

declare const LogUploaderCssModule: LogUploaderCssNamespace.ILogUploaderCss & {
	/** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
	locals: LogUploaderCssNamespace.ILogUploaderCss;
};

export = LogUploaderCssModule;
