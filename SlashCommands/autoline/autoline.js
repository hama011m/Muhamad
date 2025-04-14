const { EmbedBuilder, CommandInteraction } = require('discord.js')
const {Database} = require('st.db')
const linedb = new Database('./json/autoline.json')

module.exports = {
name: "line",
description: "ارسال خط",
async execute(client, interaction) {

const autoline = linedb.get('autoline');
interaction.channel.send(autoline)

}
}