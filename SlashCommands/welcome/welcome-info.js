const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db');
const wlcmdb = new Database('./json/welcome.json')

module.exports = {
name: "welcome-info",
description: "معلومات الترحيب",
async execute(client, interaction) {
    if(!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({content : "🙄You don't have permissions", ephemeral:true });
    const wlcminfoembed = new EmbedBuilder()
                            .setDescription(`
                            ### welcome channel : ${wlcmdb.get('wlcm_channel')}
                            ### welcome picture : ${wlcmdb.get('wlcm_img')}
                            ### welcome line : ${wlcmdb.get('wlcm_line')}
                            `)
    interaction.reply({content : '**👋🏻 معلومات نظام الترحيب**' , embeds : [wlcminfoembed]})

}
}