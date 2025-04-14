const { EmbedBuilder, CommandInteraction } = require('discord.js')
const { Database } = require('st.db')
const staffdb = new Database('./json/staff-apply.json');
module.exports = {
name: "staff-reset-submits",
description: "حذف جميع التقديمات",
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR ", ephemeral:true });
    staffdb.set('staff_submits' , [])
    interaction.reply("✅ تم الحذف بنجاح")

}
}