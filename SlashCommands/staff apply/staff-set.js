const { EmbedBuilder, ButtonBuilder , ButtonStyle ,CommandInteraction , ActionRowBuilder} = require('discord.js')
const { Database } = require("st.db");
const staffdb = new Database("./json/staff-apply.json");

module.exports = {
name: "staff-set",
description: "اعداد نظام تقديم الادارة",
"options" : [
    {
        "name" : "question1",
        "description" : "السؤال الاول",
        "type" : 3,
        "required" : true
    },
    {
        "name" : "question2",
        "description" : "السؤال الثاني",
        "type" : 3,
        "required" : true
    },
    {
        "name" : "question3",
        "description" : "السؤال الثالث",
        "type" : 3,
        "required" : true
    },
    {
        "name" : "question4",
        "description" : "السؤال الرابع",
        "type" : 3,
        "required" : true
    },
    {
        "name" : "question5",
        "description" : "السؤال الخامس",
        "type" : 3,
        "required" : true
    },
    {
        "name" : "submissions-room",
        "description" : "روم التقديمات",
        "type" : 7,
        "required" : true
    },
    {
        "name" : "results-room",
        "description" : "روم النتائج",
        "type" : 7,
        "required" : true
    },
    {
        "name" : "staff-role",
        "description" : "الرتبة التي ياخذها الاداري بعد الموافقة عليه",
        "type" : 8,
        "required" : true
    },

  ],
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄لا تمتلك صلاحية ADMINISTRATOR ", ephemeral:true });
    // =============== Options Values =============== //
    const staff_set_qu1 = interaction.options.getString("question1")
    const staff_set_qu2 = interaction.options.getString("question2")
    const staff_set_qu3 = interaction.options.getString("question3")
    const staff_set_qu4 = interaction.options.getString("question4")
    const staff_set_qu5 = interaction.options.getString("question5")

    const staff_set_subr = interaction.options.getChannel("submissions-room")
    const staff_set_resr = interaction.options.getChannel("results-room")

    const staff_set_stfr = interaction.options.getRole("staff-role")                        

    // =============== Stting Values in DB =============== //
    await  staffdb.set("question1",`${staff_set_qu1}`);
    await staffdb.set("question2",`${staff_set_qu2}`);
    await staffdb.set("question3",`${staff_set_qu3}`);
    await  staffdb.set("question4",`${staff_set_qu4}`);
    await  staffdb.set("question5",`${staff_set_qu5}`);

    await staffdb.set("submissions_room",staff_set_subr.id)
    await staffdb.set("staff_result",staff_set_resr.id)
    await staffdb.set("staff_role", staff_set_stfr.id)

    await interaction.reply('✅ تمت العملية بنجاح')

}
}