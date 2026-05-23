export function GET() {
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email Signature — Isabella Caselberg</title>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { padding: 32px; background: #ffffff; }
	</style>
</head>
<body>
	<table cellpadding="0" cellspacing="0" border="0"
		style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #111111;">
		<tbody>
			<tr>
				<td style="padding-bottom: 4px;">
					<span style="font-weight: bold;">Isabella Caselberg</span>
					<span> | Director</span>
				</td>
			</tr>
			<tr>
				<td style="padding-bottom: 8px; color: #0a0a0a;">
					<a href="tel:+64212499499" style="color: #0a0a0a; text-decoration: none;">+64 21 249 9499</a>
					<span> | </span>
					<a href="https://caselbergstudio.com" style="color: #0a0a0a; text-decoration: none;">caselbergstudio.com</a>
				</td>
			</tr>
			<tr>
				<td style="padding-top: 16px;">
					<a href="https://caselbergstudio.com" style="text-decoration: none;">
						<img src="/logo.png" alt="Caselberg Studio" style="display: block; border: 0; max-width: 180px;">
					</a>
				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' }
	});
}
