/**
 * Telegram classes
 *
 * For request to telegram api client
 */

class Telegram {
    constructor(token) {
        this.token = token;
        this.apiUrl = "https://api.telegram.org"
    }

    callApi(method, data) {
        let payload = Object.entries(data)
            .filter(([_, v]) => v != null)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

        let params = {
            "method": "POST",
            "contentType": "application/json",
            "payload": JSON.stringify({
                "method": method,
                ...payload
            })
        }

        try {
            let response = UrlFetchApp.fetch(`${this.apiUrl}/bot${this.token}/`, params);
            if (response.getResponseCode() == 200) {
                let result = response.getContentText();
                return JSON.parse(result);
            }
        } catch (e) {
            return false;
        }
    }

    setWebhook(url = "") {
        console.log(this.callApi("setWebhook", {
            url: url
        }));
    }

    sendMessage(chat_id, text, reply_to_message_id = false) {
        return this.callApi("sendMessage", {
            chat_id,
            text,
            reply_to_message_id,
            "parse_mode": "HTML",
            "disable_web_page_preview": true,
            "allow_sending_without_reply": true
        });
    }

    answerInlineQuery(inline_query_id, results) {
        return this.callApi("answerInlineQuery", {
            inline_query_id,
            results,
            "cache_time": 3600
        });
    }
}

function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
