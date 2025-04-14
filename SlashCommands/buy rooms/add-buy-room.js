const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db');
const buydb = new Database('./json/buyrooms.json');

module.exports = {
name: "buy-add-room",
description: "اضافة روم بيع.",
"options" : [
    {
        "name" : "buy-channel",
        "description" : "اختر روم بيع",
        "type" : 7,
        "required" : true
    }
],
async execute(client, interaction) {
    
    const buych = interaction.options.getChannel('buy-channel');
    buydb.push('buyrooms' , buych.id)
    interaction.reply(`✅ تم اضافة ${buych} الى رومات البيع`)

}
}