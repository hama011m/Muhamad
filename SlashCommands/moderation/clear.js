const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
  name: "clear",
  description: "مسح عدد محدد من الرسائل في الروم.",
  "options" : [
    {
        "name" : "number_of_messages",
        "description" : "عدد الرسائل للحذف",
        "type" : 4,
        "required" : true
    }
  ],
  async execute(client, interaction) {

    if (interaction.member.permissions.has("0x0000000000002000")){
        const amount = interaction.options.getInteger('number_of_messages');
        if(isNaN(amount) || amount <= 0 || amount > 100){
            return interaction.reply('من فضلك اكتب رقم من 1 الى 100.');
        }
        try {
            await interaction.channel.bulkDelete(amount, true);
            interaction.reply(` **\`\`\`Cleared ${amount} message(s).\`\`\`**`);

            setTimeout(() => {
                interaction.deleteReply();
            }, 4000);

          } catch (error) {
            console.error('Error clearing messages:', error);
          }
      }else{
          interaction.reply({content : "🙄لا تمتلك صلاحية MANAGE_MESSAGES ", ephemeral:true })
      } 


}
}