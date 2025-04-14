const { EmbedBuilder, ButtonBuilder , ButtonStyle ,CommandInteraction , ActionRowBuilder} = require('discord.js')
const { Database } = require("st.db");
const staffdb = new Database("./json/staff-apply.json");

module.exports = {
name: "staff-status",
description: "اختيار حالة التقديم على الادارة (مغلق / مفتوح)",
"options": [
    {
        "name": "staffapply_status",
        "description": "اختر الحالة",
        "type": 3,
        "required" : true,
        "choices": [
            {
                "name": "مغلق",
                "value": "open"
            },
            {
                "name": "مفتوح",
                "value": "close"
            }
        ]
    }
],
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR ", ephemeral:true });

    const staff_status_v = interaction.options.getString('staffapply_status');
    if(staff_status_v == "open"){
        staffdb.set("staff_status" , 1)
        interaction.reply("✅ تم. تقديم الادارة \`مفتوح\` الان ")
    }else if(staff_status_v == "close"){
        staffdb.set("staff_status" , 0)
        interaction.reply("✅ تقديم الادارة \`مغلق\` الان ")
    }

}

}