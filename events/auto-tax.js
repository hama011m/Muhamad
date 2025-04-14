const client = require("../index");
const { EmbedBuilder } = require('discord.js')

const { Database } = require('st.db')
const { tax } = require('discord-probot-transfer');
const taxdb = new Database('./json/tax.json')

client.on("messageCreate", (message) => {
  const tax_channels = taxdb.get('tax_rooms') || []
  if (tax_channels.includes(message.channelId)) {
    if (message.author.bot) return;
    const Args2 = message.content
      .replace("k", "000")
      .replace("K", "000")
      .replace("m", "000000")
      .replace("M", "000000")
      .replace("b", "000000000000")
      .replace("B", "000000000000");
    const taxembed = new EmbedBuilder()
      .setDescription(`**
        💳 المبلغ : ${Args2}
  
        💰 الضريبة : ${tax(Args2).tax}
  
        💵 المبلغ بالضريبة : ${tax(Args2).withTax}
  
        🧔🏻‍♂️ المبلغ بالوسيط : ${tax(Args2).mediator}
        **
        `)
    message.delete();
    message.channel.send({ content: `<@${message.author.id}>`, embeds: [taxembed] })
  }
});