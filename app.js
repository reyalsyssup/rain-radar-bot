const { default: axios } = require("axios");

const cheerio = require("cheerio"),
	dotEnv = require("dotenv"),
	Discord = require("discord.js"),
	{ exec } = require("child_process"),
	client = new Discord.Client();

dotEnv.config();
let myAccount = null;
let canRun = false;
let $ = null;
let imgUrl = null;

const downloadAndSend = async () => {
	let rainData = null;
	// get rain radar image
	await axios
		.get("http://www.bom.gov.au/products/IDR023.shtml#skip")
		.then((res) => (rainData = res.data));

	rainData === null
		? console.log("Error retrieving rain radar image url")
		: ($ = cheerio.load(rainData));

	imgUrl = "http://www.bom.gov.au" + $('img[title="128 km Melbourne Radar"]').attr("src");

	exec("cd imgs && rm img.gif");
	exec(`cd imgs && curl ${imgUrl} --output img.gif`);

	myAccount.send("Weather data:", { files: [__dirname + "/imgs/img.gif"] });
};

client.on("ready", async () => {
	console.log("ready");
	myAccount = await client.users.fetch(process.env.USERID);
	canRun = true;
});

client.on("message", async (msg) => {
	if (!msg.author.bot && msg.content === "map") await downloadAndSend();
});

setInterval(async () => {
	if (canRun) {
		let hour = new Date().getHours();
		let minute = new Date().getMinutes();
		let second = new Date().getSeconds();

		if (hour >= 8 && hour <= 20 && minute == 0 && second == 0) {
			await downloadAndSend();
		}
	}
}, 1000);

client.login(process.env.TOKEN);
