declare module 'json-string-splitter' {
	export default function splitter(input: string): { jsons: string[], remainder: string };
}
