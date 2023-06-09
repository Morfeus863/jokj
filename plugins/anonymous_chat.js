async function handler(m, { command }) {
     // if (match) return !1
     if (!m.chat.endsWith('@s.whatsapp.net'))
     return !0
 this.anonymous = this.anonymous ? this.anonymous : {}
 let room = Object.values(this.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')
 if (room) {
     if (/^.*(next|leave|start)/.test(m.text))
         return
     let other = [room.a, room.b].find(user => user !== m.sender)
     await m.copyNForward(other, true)
     return !0
 }
  
command = command.toLowerCase()
this.anonymous = this.anonymous ? this.anonymous : {}
switch (command) {
case 'next':
case 'leave': {
let room = Object.values(this.anonymous).find(room => room.check(m.sender))
if (!room) return this.sendButton(m.chat, '*[❗INFO❗] NO ESTAS EN UN CHAT ANONIMO*\n\n*¿QUIERES INICIAR UNO?*\n_DA CLICK EN EL SIGUIENTE BOTON_', wm, null, [['INICIAR CHAT ANONIMO', `.start`]], m)
m.reply('*[ ✔ ] SALIO CON EXITO DEL CHAT ANONIMO*')
let other = room.other(m.sender) 
if (other) await this.sendButton(other, '*[❗INFO❗] EL OTRO USUARIO AH ABANDONADO EL CHAT ANONIMO*\n\n*¿QUIERES IR A OTRO CHAT ANONIMO?*\n_DA CLICK EN EL SIGUIENTE BOTON_', wm, null, [['INICIAR CHAT ANONIMO', `.start`]], m)
delete this.anonymous[room.id]
if (command === 'leave') break
}
case 'start': {
if (Object.values(this.anonymous).find(room => room.check(m.sender))) return this.sendButton(m.chat, '*[❗INFO❗] TODAVIA ESTAS EN UN CHAT ANONIMO O ESPERANDO A QUE OTRO USUARIO SE UNA PARA INICIAR*\n\n*¿QUIERES SALIR DEL CHAT ANONIMO?*\n_DA CLICK EN EL SIGUIENTE BOTON_', wm, null, [['SALIR DEL CHAT ANONIMO', `.leave`]], m)
let room = Object.values(this.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
if (room) {
await this.sendButton(room.a, '*[ ✔ ] UNA PERSONA SE HA UNIDO AL CHAT ANONIMO, PUEDEN INICIAR A CHATEAR*', wm, null, [['IR A OTRO CHAT', `.next`]], m)
room.b = m.sender
room.state = 'CHATTING'
await this.sendButton(m.chat, '*[ ✔ ] UNA PERSONA SE HA UNIDO AL CHAT ANONIMO, PUEDEN INICIAR A CHATEAR*', wm, null, [['IR A OTRO CHAT', `.next`]], m)
} else {
let id = + new Date
this.anonymous[id] = {
id,
a: m.sender,
b: '',
state: 'WAITING',
check: function (who = '') {
return [this.a, this.b].includes(who)
},
other: function (who = '') {
return who === this.a ? this.b : who === this.b ? this.a : ''
},
}
await this.sendButton(m.chat, '*[❗INFO❗] ESPERANDO A OTRO USUARIO PARA INICIAR EL CHAT ANONIMO*\n\n*¿QUIERES SALIR DEL CHAT ANONIMO?*\n_DA CLICK EN EL SIGUIENTE BOTON_', wm, null, [['SALIR DEL CHAT ANONIMO', `.leave`]], m)
}
break
}}}
handler.help = ['start', 'leave', 'next']
handler.tags = ['anonymous']
handler.command = ['start', 'leave', 'next']
handler.private = true
export default handler
