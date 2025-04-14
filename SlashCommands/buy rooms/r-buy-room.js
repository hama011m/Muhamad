const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db');
const buydb = new Database('./json/buyrooms.json');

module.exports = {
name: "buy-r-room",
description: "حذف روم بيع.",
"options" : [
    {
        "name" : "buy-channel",
        "description" : "اختر روم البيع",
        "type" : 7,
        "required" : true
    }
],
async execute(client, interaction) {
    
    const buych = interaction.options.getChannel('buy-channel');
    const filtered = buydb.get("buyrooms").filter((buyc) => buyc != buych.id);
    buydb.set('buyrooms' , filtered)
    interaction.reply(`✅ تم اضافة ${buych} الى رومات البيع`)

}
}