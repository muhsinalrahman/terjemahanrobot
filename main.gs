const bot = new Telegram(env.token);

function setWebhook() {
    let url = env.webhook;
    bot.setWebhook(url);
}

const doPost = e => {
    try {
        let update = JSON.parse(e.postData.contents);
        if (typeof update.inline_query !== "undefined") {
            return inlineQuery(update.inline_query);
        }

        if (typeof update.message !== "undefined") {
            return message(update.message);
        }
    } catch (e) {
        bot.sendMessage(env.admin, e.message);
    }
}

const inlineQuery = update => {
    let inline_query_id = update.id;
    let text = update.query;
    if (text === "") return false;

    let result = [];
    let translator = [
        {
            "head": "english",
            "text": LanguageApp.translate(text, "id", "en")
        },
        {
            "head": "bahasa indonesia",
            "text": LanguageApp.translate(text, "en", "id")
        }
    ]

    for (let i = 0; i < translator.length; i++) {
        let id = Math.random().toString(36).substring(2);
        result.push({
            "type": "article",
            "id": id,
            "title": translator[i].head,
            "message_text": escapeHTML(translator[i].text),
            "parse_mode": "HTML",
            "description": `terjemahkan ke ${translator[i].head}`
        })
    }

    return bot.answerInlineQuery(inline_query_id, result);
}

const message = update => {
    if (update.text) {
        let match;
        let text = update.text;
        let chat_id = update.chat.id;
        let message_id = update.message_id;

        if (new RegExp(`^\/(start|help|bantuan)(?:@${env.username})?$`, "i").exec(text)) {
            let reply = "<b>🤖" + app.name + "</b>\n";
            reply += `<code>versi ${app.version}</code>\n\n`;
            reply += "merupakan bot terjemahan bahasa Indonesia ke English dan sebaliknya.\n\n";
            reply += "Terjemahan bahasa Indonesia ke English\n\n";
            reply += "<code>/en [kata]</code>\n";
            reply += "contoh: <code>/en aku cinta kamu</code>\n\n";
            reply += "Terjemahan English ke bahasa Indonesia\n\n";
            reply += "<code>/id [kata]</code>\n";
            reply += "contoh: <code>/id who are you?</code>\n\n";
            reply += "Mode <em>inline</em> (bisa darimana saja)\n\n";
            reply += "<code>@terjemahanrobot [kata]</code>\n";
            reply += "contoh: <code>@terjemahanrobot kamu adalah satu-satunya</code>\n";
            reply += "dan klik ingin diterjemahkan ke bahasa apa.\n\n";
            reply += "👨🏻‍💻 Author: " + app.author;

            return bot.sendMessage(chat_id, reply);
        }

        if (new RegExp(`^\/ping(?:@${env.username})?$`, "i").exec(text)) {
            let start = +new Date();
            let ping = LanguageApp.translate("PING❗️❗️❗️", "en", "id");
            let end = +new Date();
            let result = Math.abs(start - end);
            let reply = `<b>${ping}</b>\n⏳ <code>${result}ms</code>`;

            return bot.sendMessage(chat_id, reply, message_id);
        }

        if (match = new RegExp(`^\/id(?:@${env.username})?\\s(.+)`, "gi").exec(text)) {
            let payload = match[1];
            let reply = LanguageApp.translate(payload, "en", "id");

            return bot.sendMessage(chat_id, reply, message_id);
        }

        if (match = new RegExp(`^\/en(?:@${env.username})?\\s(.+)`, "gi").exec(text)) {
            let payload = match[1];
            let reply = LanguageApp.translate(payload, "id", "en");

            return bot.sendMessage(chat_id, reply, message_id);
        }
    }

    return false;
}
