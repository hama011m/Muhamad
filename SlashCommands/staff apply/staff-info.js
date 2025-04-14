const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db');
const staffdb = new Database('./json/staff-apply.json')

const staff_status = staffdb.get('staff_status')
if(staff_status == 1){
    const staff_st_r = 'مفتوح';
}else if(staff_status == 0){
    const staff_st_r = 'مغلق';
}

module.exports = {
name: "staff-info",
description: "معلومات التقديم على الادارة",
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR ", ephemeral:true });
    const staffinfoembed = new EmbedBuilder()
                            .setDescription(`
                            ### السؤال الاول : ${staffdb.get('question1')}
                            ### السؤال الثاني : ${staffdb.get('question2')}
                            ### السؤال الثالث : ${staffdb.get('question3')}
                            ### السؤال الرابع : ${staffdb.get('question4')}
                            ### السؤال الخامس :${staffdb.get('question5')}

                            ### روم التقديمات : <#${staffdb.get('submissions_room')}>
                            ### روم النتائج : <#${staffdb.get('staff_result')}>

                            ### رتبة الاداري : <@&${staffdb.get('staff_role')}>

                            ### التقديم على الادارة : ${staffdb.get('staff_status')}
                            `)
    interaction.reply({content : '**📃 معلومات نظام تقديم الادارة**' , embeds : [staffinfoembed]})

}
}