const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'stats',
    description: 'A command to see the number of Users, Servers, Text channels, and Voice channels the bot monitors',
    usage: `stats`,
    category: `utility`
}

module.exports.run = async (client, message, args, user) => {
    let mcount = client.users.cache.size;
    let scount = client.guilds.cache.size;
    let tcount = client.channels.cache.filter(c => c.type === 'text').size;
    let vcount = client.channels.cache.filter(c => c.type === 'voice').size;
    let embed = new MessageEmbed()
      .setDescription(`:white_check_mark: Statistics of Phoenix Servers Bot`)
      .setColor("2c2f33")
      .addField('**Users:**', `${mcount}`)
      .addField('**Servers:**', `${scount}`)
      .addField('**Text channels:**', `${tcount}`)
      .addField('**Voice channels:**', `${vcount}`)
    message.channel.send(embed);
  }

getRandomColor = () => {
    let randColor = '0x' + Math.floor(Math.random()*16777215).toString(16);
    return(String(randColor));
  } 