const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
require('dotenv').config();

//@todo get vars from dot-env
const apiId = 12421099;
const apiHash = '1c8728ba487130e56e65ed1dfe03b21c';
//@todo get vars from dot-env
const code = `1AgAOMTQ5LjE1NC4xNjcuNDEBu4d34t58mUAygUQ8bWhNPcpvUu1mwqUlHaxdkuIJxLseokXYeTsNib/Oa9JX8SPYL4rDbB2rcibD7fUUWBtxqpHmUjc85Cxzl0Uo6BI4AHM0fONdMPjmP3YzPCWP8xqVhDwW68WkMdUJ4k1V95c03FDv9JkNEd0+pwhCd1goxdGGsIz7cD59UnGFSobeK4K6FUvfelYVX1ilhhU2tOYpCshQrohSqkvuffzU/ZJtDBeOCr0mumw33hAnEzLqAdlcDtImSAf/HKPcKP2tQUlWB6XY9wAeDOVPJOdSY+I261cSW6268N43UlRW+/cDxvFne4147hfbGaexmILaELKD/7Q=`;
let stringSession = new StringSession(code); // fill this later with the value from session.save()

(async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
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