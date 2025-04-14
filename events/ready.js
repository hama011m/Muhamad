const { Client, Interaction, ActivityType } = require('discord.js');
const Discord = require('discord.js');
const { prefix } = require('../json/config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log((`Logged in as ${client.user.tag}`).red);
        console.log((`Servers: ${client.guilds.cache.size}`).magenta, (`Users: ${client.guilds.cache
            .reduce((a, b) => a + b.memberCount, 0)
            .toLocaleString()}`).yellow, (`Commands: ${client.commands.size}`).green);
        client.user.setStatus("online")
        client.user.setActivity(`Dev By onlyzer0x`, { type: ActivityType.Listening })
    }
};
//dev By onlyzer0x