const express = require("express")
const app = express ()
const http = require("http")
const port =  process.env.PORT || 3000

const server = http.createServer(app)

const socketIo = require("socket.io")
const io = socketIo(server)

app.use(express.static("public"))


app.get("/", (req, res) => {
    res.send()
})

//array donde guardo los nombre de los usuarios
let usuarios = []

io.on("connection", client => {
    console.log('Se conecto el cliente' + client.id) //mensaje en el server de quien se conecta
    client.broadcast.emit("mensaje-conexion", "se conecto el cliente" + client.id) //mensaje al front de quien se conecta

    client.on("disconnect", () => {
        console.log("se desconecto un usuario" + client.id) //mensaje en el server de quien se desconecta
        client.broadcast.emit("mensaje-conexion", "se desconecto el cliente" + client.id) //mensaje al front de quien se desconecta
        //filtro cual es el usuario que se desconecto para mandar nuevamente despues el array actualizado
        usuarios = usuarios.filter(usuario => !(usuario.id == client.id)) 
        client.broadcast.emit('mensaje-U', usuarios)
    })

    //aca recibo los datos del front del nombre de usuario, los relaciono con el id y los agrego al array. Enviando al final el array actualizado al front.
    client.on("mensaje-usuario",(nombre)=>{
        
        const usuario = {
            id: client.id,
            nombre
        }
        usuarios.push(usuario)
        client.broadcast.emit('mensaje-U', usuarios) //esto se lo emite a todos los participantes el array, menos al que envio el nombre
        client.emit('mensaje-U', usuarios) //esto le devuelve el array a quien envio el nombre
    })


    //aca recibo los mensajes, los relaciona con el nombre de quien lo envio y envia el array con el mensaje a los demas.
    client.on("mensaje", (data) => {
            // console.log(usuarios)
            const usuarioMensaje = usuarios.find(usuario => usuario.id == client.id) //encuentra el nombre del usuario en base al client.id
            // console.log(usuarioMensaje)
            // console.log(usuarioMensaje.nombre)
            let mensajeU = {
                usuario : usuarioMensaje.nombre ,
                mensaje : data
            }
            client.broadcast.emit("mensaje-chat", mensajeU)
            
    })

    client.on('chat:escribiendo', () => {
        const usuarioEscribiendo = usuarios.find(usuario => usuario.id == client.id)
        client.broadcast.emit('chat:escribiendo', usuarioEscribiendo.nombre);
    })

})

server.listen(port, () => {console.log(`localhost:${port}`)})
