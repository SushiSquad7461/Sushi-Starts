"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const notion_1 = require("./notion");
function createArrivalBot(curAttendees) {
    const client = new discord_js_1.Client({
        intents: [
            discord_js_1.Intents.FLAGS.GUILDS,
            discord_js_1.Intents.FLAGS.GUILD_MESSAGES
        ]
    });
    client.on('ready', () => {
        console.log(`Logged in as ${client.user?.tag}!`);
    });
    client.on('messageCreate', async (message) => {
        if (client.user && message.mentions.has(client.user) && message.author !== client.user) {
            const user = `${message.author.username}#${message.author.discriminator}`;
            const date = new Date(message.createdTimestamp);
            let ping = curAttendees.attendees_id.map(id => `<@${id}>`).join(" ");
            console.log(`User arriving: ${user}`);
            await (0, notion_1.markPresent)(message.author.username + "#" + message.author.discriminator, date);
            if (ping === "") {
                ping = `Welcome, \`${message.author.username}\`. There is no one here yet.`;
            }
            else {
                const messageContentWithoutPing = message.content.replace(`<@${client.user.id}>`, "").trim();
                ping = `${messageContentWithoutPing} ${ping}`;
            }
            if (message.content.includes("door") || message.content.includes("inner")) {
                message.reply(ping);
            }
            else {
                message.reply(`Welcome, \`${message.author.username}\`. If you need to be let in, please specify which door you're at.`);
            }
            if (!curAttendees.findAttendee(message.author.id)) {
                await (0, notion_1.logPing)(false, user);
                curAttendees.addAttendee(user, message.author.id);
            }
        }
    });
    client.login(process.env.ARRIVE_CLIENT_TOKEN);
    return client;
}
exports.default = createArrivalBot;
//# sourceMappingURL=arrivebot.js.map