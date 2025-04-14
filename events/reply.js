const { ModalBuilder } = require("@discordjs/builders");
const client = require("../index");
const {CommandInteraction , Client, Integration, Message} = require('discord.js')
const {Database} = require('st.db');
const db = require('pro.db')
const replydb = new Database('./json/reply.json')

client.on('messageCreate' , (message) => {
    if(message.author.bot)return;

    const replys = replydb.valuesAll()
    const storedCommandsData = replydb.valuesAll() || {};

    const mergedCommandsData = { ...replys, ...storedCommandsData };

    const commandData = Object.values(mergedCommandsData).find((data) => data.command === message.content);

    if (commandData) {
        message.reply(commandData.reply);
    }
})