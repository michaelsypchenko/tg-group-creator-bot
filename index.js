const { TelegramClient, Api } = require('telegram');
const { NewMessage } = require('telegram/events');
const { StringSession } = require('telegram/sessions');
const input = require('input');
require('dotenv').config();

const { API_ID, API_HASH, API_CODE } = process.env;

let stringSession = new StringSession(API_CODE); // fill this later with the value from session.save()

(async () => {
	const client = new TelegramClient(stringSession, Number(API_ID), API_HASH, {
		connectionRetries: 5
	});
	await client.start({
		phoneNumber: async () => await input.text("Please enter your number: "),
		password: async () => '',
		phoneCode: async () => await input.text("Please enter the code you received: "),
		onError: (err) => console.log(err)
	});
	console.log("You should now be connected.");
	stringSession = client.session.save();
	await client.getMe();
	async function handler(event) {
		const groupCreateNotification = JSON.parse(event.message.message);
		if (
			!groupCreateNotification
			|| !1902096168
			|| !groupCreateNotification.affiliate_tg_id
		) {
			return;
		}
		const result = await client.invoke(new Api.channels.CreateChannel({
			title: 'user-and-admin-1ffa', about: 'user-and-admin-1ffa',
			broadcast: true, megagroup: true, forImport: true
		}));
		const createdChanelId = '-100' + JSON.parse(JSON.stringify(result)).chats[0].id;
		await client.invoke(new Api.channels.InviteToChannel({
			channel: createdChanelId,
			users: [
				Number(1902096168), Number(groupCreateNotification.affiliate_tg_id)
			]
		}));
	   await client.invoke(new Api.channels.LeaveChannel({ channel: createdChanelId }));
	}
	client.addEventHandler(handler, new NewMessage({}));//TelegramClient.events.message
})();
