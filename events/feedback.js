const client = require("../index");
const { EmbedBuilder, WebhookClient } = require("discord.js");
const { Database } = require("st.db");
const feedbackdb = new Database("./json/feedback.json");

client.on("messageCreate", async (message) => {
  const feedback_channels = feedbackdb.get("feedback_rooms") || [];


  if (feedback_channels.includes(message.channelId)) {
    if (message.author.bot) return;
    message.delete();
    const feedembed = new EmbedBuilder()
      .setTitle(`**Feedback by: ${message.author.username}**`)
      .setURL(`https://discord.com/channels/${message.guildId}/${message.channelId}`)
      .setDescription(`
        **Feedback : **
        ${message.content}  

        **Rate :**
        ⭐⭐⭐⭐⭐                          
    `);

    const webhook = await message.channel.createWebhook({
      name: `${message.author.username}`,
      avatar: `${message.author.displayAvatarURL()}`,
    });
    const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
    await webhookClient.send({
      embeds: [feedembed]
    });
    await webhookClient.delete();
  }
});
