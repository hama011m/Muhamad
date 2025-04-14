const client = require("../index");
const { EmbedBuilder} = require('discord.js')
const {Database} = require('st.db')
const linedb = new Database('./json/autoline.json')

client.on("messageCreate", (message) => {
    const line_channels = linedb.get('autoline_rooms') || []
    if (line_channels.includes(message.channelId)) {
      if (message.author.bot) return;
        message.channel.send(linedb.get('autoline'))
    }
  });