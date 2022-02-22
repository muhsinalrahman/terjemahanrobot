/**
 * Terjemahan ID ⇄ EN
 * 
 * merupakan bot terjemahan bahasa Indonesia ke English dan sebaliknya
 * 
 * Kota Palembang, 21 Februari 2022
 */

const app = {
    "name": "Terjemahan ID ⇄ EN",                 // ganti nama bot
    "username": "terjamahanrobot",                // ganti username bot
    "version": "1.3",                             // ganti versi bot
    "site": "https://muhsinalr.com",
    "author": "@kreasisaya"
}

const env = {
    "token": "BOT_API_TOKEN",                        // bot api token
    "username": app.username,
    "admin": "USER_LOG_ID",                          // user id
    "webhook": "WEB_APP_URL"                         // web app url dari deployment
}

function doGet(e) {
    return HtmlService.createHtmlOutput("Terjemahan Bot Aktif!");
}
