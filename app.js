const { default: axios } = require("axios");

const cheerio = require("cheerio"),
	dotEnv = require("dotenv"),
	Discord = require("discord.js"),
	Path = require("path"),
	client = new Discord.Client();

dotEnv.config();
let myAccount = null;
let canRun = false;

client.on("ready", async () => {
	console.log("ready");
	myAccount = await client.users.fetch(process.env.USERID);
	canRun = true;
});

setInterval(async () => {
	if (canRun) {
		let hour = new Date().getHours();
		let minute = new Date().getMinutes();
		let second = new Date().getSeconds();

		if (hour >= 8 && hour <= 20 && minute == 0 && second == 0) {
			myAccount.send("Rain data:");
		}
	}
}, 100);

client.login(process.env.TOKEN);
