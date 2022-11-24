declare namespace AppCssNamespace {
	export interface IAppCss {
		"highlight-enter": string;
		"highlight-enter-active": string;
		"log-loading": string;
		"log-section": string;
		scrollContainer: string;
	}
}

declare const AppCssModule: AppCssNamespace.IAppCss & {
	/** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
	locals: AppCssNamespace.IAppCss;
};

export = AppCssModule;
