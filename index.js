const Discord = require('discord.js')
const client = new Discord.Client()
const mongoose = require('mongoose')
const DBprefix = require('./database/model')
const { token } = require('./util/config.json')
const { readdirSync } = require('fs')
const { join } = require('path')

mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
client.commands = new Discord.Collection()
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`))
    client.commands.set(command.name, command)

}
client.on('error', console.error)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setPresence({
        activity: {
            name: '!help || Bot v0.0.2',
            type: "WATCHING"
        }
    })
})
client.on('message', async (message) => {
    let prefix = await getGuildPrefix(message)
    if(message.author.bot) return
    if(message.channel.type === "dm") return
    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const command = args.shift().toLowerCase()
        if(!client.commands.has(command)) return
        try {
            client.commands.get(command).run(client, message, args)
        }
        catch (error){
            console.error(error)
        }
    }
})

client.on('guildCreate', async guild => {
    let data = { guildID: guild.id, guildPrefix: '!'}
    let response = await DBprefix.create(data)
    console.log(`${guild.name}'s creation status: ${response}`)
});

client.on('guildDelete', async guild => {
    let response = await DBprefix.deleteOne({guildID: guild.id})
    console.log(`${guild.name}'s deletion status: ${response}`)
});

const getGuildPrefix = async(msg) => {
    let id = msg.guild.id
    let response = await DBprefix.find({guildID: id}).exec()
    return response[0].guildPrefix;
}
client.login(token)