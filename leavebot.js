import 'dotenv/config'
import { Client, Intents } from 'discord.js';
import {markPresent, getAttendees, logPing} from "./notion.js";

export default function createLeaveBot(curr_attendees) {
    const client = new Client({ 
        intents: [
            Intents.FLAGS.GUILDS, 
            Intents.FLAGS.GUILD_MESSAGES,
        ] 
    });
    
    client.on('ready', () => {
          console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('messageCreate', (message) => {
        if (message.mentions.has(client.user)) {
            await logPing(true, message.author.username + "#" + message.author.discriminator );
            console.log("User is leaving");
            console.log(message.author.username + ":" + message.author.discriminator);
            message.reply("Goodbye " + message.author.username);
            curr_attendees.removeAttendee(message.author.username + "#" + message.author.discriminator, message.author.id);
        }
    });

    client.login(process.env.LEAVE_CLIENT_TOKEN);
}