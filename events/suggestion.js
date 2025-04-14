const client = require("../index");
const { EmbedBuilder, WebhookClient } = require("discord.js");
const { Database } = require("st.db");
const suggdb = new Database("./json/suggestion.json");

client.on("messageCreate", async (message) => {
    const suggestion_channels = suggdb.get("suggestion_rooms") || [];


    if (suggestion_channels.includes(message.channelId)) {
        if (message.author.bot) return;
        message.delete();
        const suggembed = new EmbedBuilder()
            .setTitle(`**🤔 Suggestion by: ${message.author.username}**`)
            .setURL(`https://discord.com/channels/${message.guildId}/${message.channelId}`)
            .setDescription(`

        **${message.content}**     
                
    `);

        message.delete()
        message.channel.send({ embeds: [suggembed] })
            .then((msg) => {
                msg.react('👍🏻');
                msg.react('👎🏻');
            })
    }
});
