const { MessageEmbed, Message } = require("discord.js")
const DBprefix = require('../database/model')

module.exports = {
    name: 'prefix',
    description: 'A command to change the servers prefix',
    usage: `prefix <new prefix>`,
    category: `settings`
}

module.exports.run = async (client, message, args, user) => {
    if (!args.length) {
        return message.channel.send(`You didn't provide a new prefix ${message.author}!`);
    }
    await DBprefix.updateOne({
        guildID: message.guild.id
    }, {
        $set: {
            guildPrefix: String(args)
        }
    })
    const embed = new MessageEmbed()
    .setColor(getRandomColor())
    .addField('Your new prefix is: ', '`' + String(args) + '`')
    message.channel.send(embed)
  };

getRandomColor = () => {
    let randColor = '0x' + Math.floor(Math.random()*16777215).toString(16);
    return(String(randColor));
  } 