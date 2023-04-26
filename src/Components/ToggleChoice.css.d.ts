declare namespace ToggleChoiceCssNamespace {
	export interface IToggleChoiceCss {
		toggleChoice: string;
	}
}

declare const ToggleChoiceCssModule: ToggleChoiceCssNamespace.IToggleChoiceCss & {
	/** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
	locals: ToggleChoiceCssNamespace.IToggleChoiceCss;
};

export = ToggleChoiceCssModule;
