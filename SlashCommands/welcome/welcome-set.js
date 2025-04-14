const { EmbedBuilder, ButtonBuilder , ButtonStyle ,CommandInteraction , ActionRowBuilder} = require('discord.js')
const { Database } = require("st.db");
const wlcmdb = new Database("./json/welcome.json");

module.exports = {
name: "welcome-set",
description: "اعداد نظام رسالة الترحيب",
"options" : [
    {
        "name" : "wlcm_channel",
        "description" : "روم الترحيب",
        "type" : 7,
        "required" : true
    },
    {
        "name" : "wlcm_image",
        "description" : "رابط صورة الترحيب",
        "type" : 3,
        "required" : true
    },
    {
        "name" : "wlcm_line",
        "description" : "رابط الخط بعد رسالة الترحيب",
        "type" : 3,
        "required" : true
    },
  ],
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄You don't have permissions", ephemeral:true });
    // =============== Options Values =============== //
    const wlcm_channel_v = interaction.options.getChannel("wlcm_channel")

    const wlcm_image_v = interaction.options.getString("wlcm_image")
    const wlcm_line_v = interaction.options.getString("wlcm_line")

    // =============== Stting Values in DB =============== //
    await  wlcmdb.set("wlcm_channel",`${wlcm_channel_v.id}`);
    await wlcmdb.set("wlcm_img",`${wlcm_image_v}`);
    await wlcmdb.set("wlcm_line",`${wlcm_line_v}`);

    await interaction.reply('✅ done')

}
}