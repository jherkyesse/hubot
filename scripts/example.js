// Description:
//    An example script, tells you the time. See below on how documentation works.
//    https://github.com/hubotio/hubot/blob/master/docs/scripting.md#documenting-scripts
//
// Commands:
//    bot what time is it? - Tells you the time
//    bot what's the time? - Tells you the time
//
module.exports = (robot) => {
  robot.respond(/tell me a joke/gi, (msg) => {
    const fetch = require("node-fetch");
    fetch("https://official-joke-api.appspot.com/random_joke")
      .then((res) => res.json())
      .then((data) => msg.send(`${data.setup}\n${data.punchline}`));
  });
  robot.respond(/play (.+)/i, async (msg) => {
    try {
      const content = msg.match.input.split("bot play ")[1];
      const fetch = require("node-fetch");
      const axios = require("axios");
      const { pipeline } = require("stream");
      const { promisify } = require("util");
      const [{ author, title, videoId }] = await fetch(
        "https://youtube.ouo.ooo/api/search?q=" + content
      ).then((res) => res.json());
      const { cover, filename, url } = await fetch(
        "https://ytdl.ouo.ooo/api/" + videoId
      ).then((res) => res.json());
      // token: BaMx22JKEDSUEcqEmUbgs3fR6ITnhTq09s4meotFct0
      // userid: JcWixtWu78KXvMzJE
      const fs = require("fs");
      const streamPipeline = promisify(pipeline);

      const streamRes = await fetch(url);
      await streamPipeline(
        streamRes.body,
        fs.createWriteStream(__dirname + "/stream.mp3")
      );
      const stream = fs.createReadStream(__dirname + "/stream.mp3");
      const FormData = require("form-data");
      const data = new FormData();
      data.append("file", stream, filename);
      const config = {
        method: "post",
        url: robot.adapter.api.url + "rooms.upload/GENERAL",
        headers: {
          "X-Auth-Token": "BaMx22JKEDSUEcqEmUbgs3fR6ITnhTq09s4meotFct0",
          "X-User-Id": "JcWixtWu78KXvMzJE",
          ...data.getHeaders(),
        },
        data,
      };

      await axios(config)
        .then((res) => console.log(res))
        .catch((err) => console.warn(err));
    } catch (error) {
      console.warn(error);
      msg.reply("Search failed, please try another search criteria");
    }
  });
};
