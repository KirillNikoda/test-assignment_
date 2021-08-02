exports.sendNotification = async function(text, transporter, email) {

	await transporter.sendMail({
		from: 'knikodait@gmail.com', // sender address `
		to: email, // list of receivers
		subject: "Notification ✔", // Subject line
		text: "You successfully finished registration process.", // plain text body
		html: `<b>${text}</b>`, // html body
	});
}