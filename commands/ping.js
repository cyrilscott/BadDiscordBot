const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'ping',
    description: 'Test command ping',
    usage: `ping`,
    category: `utility`
}

module.exports.run = async (client, message, args, user) => {
  const embed = new MessageEmbed()
    .setColor(getRandomColor())
    .addField(
      `${client.user.username} ping: `,
      client.ws.ping.toString(),
      false
    )
    message.channel.send(embed);
  };

getRandomColor = () => {
    let randColor = '0x' + Math.floor(Math.random()*16777215).toString(16);
    return(String(randColor));
  } 