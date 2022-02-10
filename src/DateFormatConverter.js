/*
 * PHP => moment.js
 *
 * http://www.php.net/manual/en/function.date.php
 * http://momentjs.com/docs/#/displaying/format/
 * https://gist.github.com/NTICompass/9375143
 */
const formatMap = {
	d: 'DD',
	D: 'ddd',
	j: 'D',
	l: 'dddd',
	N: 'E',
	w: 'd',
	W: 'W',
	F: 'MMMM',
	m: 'MM',
	M: 'MMM',
	n: 'M',
	o: 'GGGG',
	Y: 'YYYY',
	y: 'YY',
	a: 'a',
	A: 'A',
	g: 'h',
	G: 'H',
	h: 'hh',
	H: 'HH',
	i: 'mm',
	s: 'ss',
	u: '[u]', // not sure if moment has this
	e: '[e]', // moment does not have this
	O: 'ZZ',
	P: 'Z',
	T: '\T', // deprecated in moment
	c: 'YYYY-MM-DD[T]HH:mm:ssZ',
	r: 'ddd, DD MMM YYYY HH:mm:ss ZZ',
	U: 'X'
};
const formatEx = /[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g;

export function convertDateFormat (format) {
	return format.replace(formatEx, (phpStr) => {
		return typeof formatMap[phpStr] === 'function' ? formatMap[phpStr]() : formatMap[phpStr];
	});
}
