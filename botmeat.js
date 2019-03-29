var fs = require('fs');
var Discord = require('discord.js');
var opus = require('opusscript');
const { prefix, token, soundpath, victorpath, mmmboppath, voicechannel } = require('./config.json');

var bot = new Discord.Client();
var isReady = true;

var soundQueue = [];
bot.on('error', err => {
	console.error(err);
});

bot.on("ready", () => {
  console.log("Ready");
});

bot.on('message', message => {
        if(message.content.indexOf(prefix) !== 0) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (command === 'playsound')
        {
                soundfile = soundpath + '/' + args[0];
                console.log(soundfile);
                fs.stat(soundfile, function(err, data) {
                        if (err != null) {
                                console.log('file: ' + soundfile + ' does not exist');
                        } else {
				queueSound(soundfile);
					if (isReady) {
						playNextSound();
					}
                        }
                });
		message.delete(100);
		
        } else if (command === 'playvictor')
        {
                soundfile = victorpath + '/' + args[0];
                console.log(soundfile);
                fs.stat(soundfile, function(err, data) {
                        if (err != null) {
                                console.log('file: ' + soundfile + ' does not exist');
                        } else {
                                queueSound(soundfile);
                                        if (isReady) {
                                                playNextSound();
                                        }
                        }
                });
                message.delete(100);


        } else if (command === 'playmmmbop') {
		if (args[0] === "phGfHvPSjajs") {
			queueSound(mmmboppath);
			console.log(mmmboppath);
			if (isReady) {
				playNextSound();
			}
		}
		message.delete(100);

	} else if (command === 'playthemesong') {
		if (args[0] > 0) {
			soundfile = themesongpath + '/' + args[0] + '.ogg';
			console.log(soundfile);
			fs.stat(soundfile, function(err,data) {
				if (err != null) {
					console.log('file: ' + sounfile + ' does not exist');
				} else {
					queueSound(soundfile);
					if (isReady) {
						playNextSound();						
					}
				}
			});
		}
		message.delete(100);
	}



});

function queueSound(soundfile) {
	soundQueue.push(soundfile);
}

function playNextSound() {
    	isReady = false;
	if (soundQueue.length > 0) {
		var soundfile = soundQueue.shift();
		playSound(soundfile)
		.then(() => {
			playNextSound();
		});
	} else {
		isReady = true;
	}
		
}

var playSound = function(soundfile) {
	return new Promise(function(resolve,reject) {
		var voiceChannel = bot.channels.get(voicechannel);
		voiceChannel.join().then(connection =>
		{
			const streamOptions = { volume: 0.7};		
			const dispatcher = connection.playFile(soundfile, streamOptions);
			dispatcher.on("end", end => {
				voiceChannel.leave();
				resolve(true);
				});
		}).catch(err => {
			console.log(err);
			reject(false);
		});
		
	});
}

bot.login(token);

