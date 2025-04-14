const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db');
const buydb = new Database('./json/buyrooms.json');

module.exports = {
name: "buy-set",
description: "اعداد نظام فتح و غلق رومات البيع.",
"options" : [
    {
        "name" : "not-buy-channel",
        "description" : "اختر روم اشعارات فتح وغلق رومات البيع",
        "type" : 7,
        "required" : true
    }
],
async execute(client, interaction) {
    
    const buy_not_ch = interaction.options.getChannel('not-buy-channel');
    buydb.set('buy_not' , buy_not_ch.id)
    interaction.reply(`✅ تمت العملية بنجاح`)

}
}