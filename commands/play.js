const { MessageEmbed, Message } = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require("yt-search");
let beforeVar = require('./var')
let songQueue = beforeVar.queue

module.exports.queue = songQueue
module.exports.name = 'play';
module.exports.description =
  "A command that can play a youtube link through a voice channel";
module.exports.usage = 'play <youtube link/video title>';
module.exports.category = 'fun';

module.exports.run = async (client, message, args, user) => {
    const serverQueue = songQueue.get(message.guild.id)
    if (!message.member.voice.channel){
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    )}
    if(args[0] === undefined) message.channel.send('Please include something to play!')
    if(ytdl.validateURL(args[0])) {
      const voiceChannel = message.member.voice.channel;
        let songInfo = await ytdl.getInfo(args[0])
        let song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        }
        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          };
      
          songQueue.set(message.guild.id, queueContruct);
      
          queueContruct.songs.push(song);
      
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
          } catch (err) {
            console.log(err);
            songQueue.delete(message.guild.id);
            return message.channel.send(err);
          }
        } else {
          serverQueue.songs.push(song)
          const embed = new MessageEmbed()
          .setColor(getRandomColor())
          .addField('Your song has been added to the queue:', '`' + song.title + '`')
          message.channel.send(embed)
        }
    } else {
      let search = args[0] + args[1] + args[2] + args[3] + args[4] + args[5] + args[6] + args[7] + args[8]
      const {videos} = await yts(args.slice(search).join(" "));
      let songInfo = await ytdl.getInfo(videos[0].url)
        let song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        }
      if (!videos.length) message.channel.send("No songs were found!");
      if (!serverQueue) {
        const voiceChannel = message.member.voice.channel;
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };
    
        songQueue.set(message.guild.id, queueContruct);
    
        queueContruct.songs.push(song);
    
        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          play(message.guild, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          songQueue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song)
        const embed = new MessageEmbed()
        .setColor(getRandomColor())
        .addField('Your song has been added to the queue:', '`' + song.title + '`')
        message.channel.send(embed)
      }
    }
}

function play(guild, song) {
  const serverQueue = songQueue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    songQueue.delete(guild.id);
    return;
  }
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
const embed = new MessageEmbed()
.setColor(getRandomColor())
.addField('Now Playing:', '`' + song.title + '`')
serverQueue.textChannel.send(embed);
}



const getRandomColor = () => {
    let randColor = '0x' + Math.floor(Math.random()*16777215).toString(16);
    return(String(randColor));
  } 