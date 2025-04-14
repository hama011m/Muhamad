const { EmbedBuilder, CommandInteraction } = require("discord.js");
const { Database } = require("st.db");
const replydb = new Database("./json/reply.json");

module.exports = {
  name: "replys",
  description: "اظهار جميع الردود التلقائية",
  async execute(client, interaction) {
    if (interaction.user.bot) return;
    const embed = new EmbedBuilder()
      .setTitle("💬 رد تلقائي")
      .setColor("#0099ff")
      .setFooter({ text: "`##` لحذف رد تلقائي قم بكتابة الامر /r-reply" });

    const allAutoReplies = replydb.all();
    if (!interaction.member.permissions.has("0x0000000000000008"))
      return interaction.reply({
        content : "🙄لا تمتلك صلاحية Administrator",
        ephemeral:true 
      });
    for (const entry of allAutoReplies) {
      const { data } = entry;
      const { command, reply, replyid } = data;
      embed.addFields({
        name: `Reply ID : \`${replyid}\` || Command: ${command}`,
        value: `Reply: ${reply}`,
      });
    }

    interaction.reply({ embeds: [embed] });
  },
};
