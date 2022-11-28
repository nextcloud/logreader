declare namespace ToggleEntryCssNamespace {
	export interface IToggleEntryCss {
		toggleEntry: string;
	}
}

declare const ToggleEntryCssModule: ToggleEntryCssNamespace.IToggleEntryCss & {
	/** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
	locals: ToggleEntryCssNamespace.IToggleEntryCss;
};

export = ToggleEntryCssModule;
