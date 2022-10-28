declare namespace LevelSettingsCssNamespace {
	export interface ILevelSettingsCss {
		settings: string;
	}
}

declare const LevelSettingsCssModule: LevelSettingsCssNamespace.ILevelSettingsCss & {
	/** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
	locals: LevelSettingsCssNamespace.ILevelSettingsCss;
};

export = LevelSettingsCssModule;
