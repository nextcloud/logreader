/**
 * Fallback function to copy test to clipboard if browser does not support clipboard API
 *
 * @param text Text to copy
 */
function fallbackCopyTextToClipboard(text: string) {
	const textArea = document.createElement('textarea')
	textArea.value = text
	textArea.style.position = 'fixed'
	textArea.style.opacity = '0'
	document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()

	try {
		const successful = document.execCommand('copy')
		if (!successful) {
			console.log('Fallback: Copying text command was unsuccessful')
		}
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err)
	}

	document.body.removeChild(textArea)
}

/**
 * Copy text to clipboard
 *
 * @param text Text to copy
 */
export function copyTextToClipboard(text: string) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text)
		return
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	navigator.clipboard.writeText(text).then(function() {
	}, function(err) {
		console.error('Async: Could not copy text: ', err)
	})
}
