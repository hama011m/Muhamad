const { EmbedBuilder, CommandInteraction } = require('discord.js')
const { tax } = require('discord-probot-transfer');

module.exports = {
name: "tax",
description: "ضريبة البروبوت",
"options" : [
    {
        "name" : "creditss",
        "description" : "عدد الكريدت",
        "type" : 4,
        "required" : true
    }
  ],
async execute(client, interaction) {
const taxv = interaction.options.getInteger('credits');
const taxembed = new EmbedBuilder()
                    .setDescription(`**
                    💳 المبلغ : ${taxv}

                    💰 الضريبة : ${tax(taxv).tax}

                    💵 المبلغ بالضريبة : ${tax(taxv).withTax}

                    🧔🏻‍♂️ المبلغ بالوسيط : ${tax(taxv).mediator}
                    **
                    `)

interaction.reply({embeds : [taxembed]})


}
}