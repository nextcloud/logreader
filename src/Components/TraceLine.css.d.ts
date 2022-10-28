declare namespace TraceLineCssNamespace {
	export interface ITraceLineCss {
		argument: string;
		file: string;
		line: string;
	}
}

declare const TraceLineCssModule: TraceLineCssNamespace.ITraceLineCss & {
	/** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
	locals: TraceLineCssNamespace.ITraceLineCss;
};

export = TraceLineCssModule;
