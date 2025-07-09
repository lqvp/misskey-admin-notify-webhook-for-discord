export default async function receivedContactForm(body: any, webhookUrl: string) {
	const server = body.server;
	const contactFormId = body.body.id;
	const subject = body.body.subject;
	const content = body.body.content;
	const name = body.body.name;
	const email = body.body.email;
	const misskeyUsername = body.body.misskeyUsername;
	const replyMethod = body.body.replyMethod;
	const category = body.body.category;
	const user = body.body.user;

	let senderName = '匿名';
	let senderLink = null;

	if (user) {
		senderName = user.name || user.username;
		senderLink = `[${senderName}](${server}/users/${user.id})`;
	} else if (name) {
		// 名前が指定されている場合
		senderName = name;
	}

	// 返信先情報
	let replyInfo = '';
	if (replyMethod === 'email' && email) {
		replyInfo = `📧 ${email}`;
	} else if (replyMethod === 'misskey' && misskeyUsername) {
		replyInfo = `💬 ${misskeyUsername}`;
	}

	// コンテンツの長さ制限（Discord embedのdescription制限: 4096文字）
	const maxContentLength = 500;

	let truncatedContent = content;
	if (content.length > maxContentLength) {
		truncatedContent = content.substring(0, maxContentLength) + '\n\n**[内容が長いため省略されました]**';
	}

	// Markdownエスケープ（Discord埋め込みで問題となる文字をエスケープ）
	const escapeMarkdown = (text: string) => {
		return text.replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`').replace(/\|/g, '\\|');
	};

	const embed = {
		title: '📬 お問い合わせがありました',
		color: 3066993,
		description: `新しいお問い合わせが届きました。\n### 📋 件名\n${escapeMarkdown(subject)}\n### 📝 内容\n${escapeMarkdown(
			truncatedContent
		)}\n### 🌐 サーバー\n${server}`,
		fields: [
			{
				name: '👤 送信者',
				value: senderLink || escapeMarkdown(senderName),
				inline: true,
			},
			{
				name: '📞 返信方法',
				value: replyInfo || '不明',
				inline: true,
			},
			{
				name: '🏷️ カテゴリ',
				value: escapeMarkdown(category || '不明'),
				inline: true,
			},
		],
		footer: {
			text: `ID: ${contactFormId}`,
		},
		timestamp: new Date().toISOString(),
	};

	const isOk = await fetch(webhookUrl, {
		body: JSON.stringify({
			embeds: [embed],
		}),
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	}).then((res) => res.ok);

	return isOk;
}
