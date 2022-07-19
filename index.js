const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
require('dotenv').config();

const { API_ID, API_HASH, API_CODE } = process.env;

let stringSession = new StringSession(API_CODE); // fill this later with the value from session.save()

(async () => {
    console.log("Loading interactive example...");
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
    let result;
    result = await client.invoke(new Api.channels.CreateChannel({
        title: 'user-and-admin-1ffa', about: 'user-and-admin-1ffa',
        broadcast: true, megagroup: true, forImport: true
    }));
    result = await client.invoke(new Api.channels.InviteToChannel({
        channel: '-100' + JSON.parse(JSON.stringify(result)).chats[0].id,
        users: [ 2093357100 ]
    }));
    result = await client.invoke(new Api.channels.LeaveChannel({
        channel: '-100' + JSON.parse(JSON.stringify(result)).chats[0].id
    }));
})();