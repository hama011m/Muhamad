const { EmbedBuilder, ButtonBuilder , ButtonStyle ,CommandInteraction , ActionRowBuilder} = require('discord.js')

module.exports = {
name: "staff-send",
description: "ارسال رسالة التقديم",
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄 لا تمتلك صلاحية ADMINISTRATOR", ephemeral:true });
    const staffapply_embed = new EmbedBuilder()
                            .setTitle('التقديم للادارة 👨🏻‍💼')
                            .setDescription('للتقديم للادارة اضغط على الزر واملا البيانات \n وانتظر سيتم الرد عليك');
    const staffapply_button = new ButtonBuilder()
                            .setCustomId('staff_apply_id')
                            .setLabel('التقديم')
                            .setEmoji('📃')
                            .setStyle(ButtonStyle.Success);
    const staffapply_row = new ActionRowBuilder()
                            .addComponents(staffapply_button);
    
    interaction.channel.send({embeds : [staffapply_embed] , components : [staffapply_row]});

                            

}
}