const socket = io() // libreria de socket
let html = '' //inicio la variable donde se va a guardar el html del chat previo a mostrarlo en pantalla
let horaMensaje = " "

function hora0(){
    let horario = new Date()
    let hoursZero = " "
    if(horario.getHours()<10){
        hoursZero = `0${horario.getHours()}`
    }else{
        hoursZero = `${horario.getHours()}`
    }
    let minutesZero = " "
    if(horario.getMinutes()<10){
        minutesZero = `0${horario.getMinutes()}`
    }else{
        minutesZero = `${horario.getMinutes()}`
    }
    let secondsZero =" "
    if(horario.getSeconds()<10){
        secondsZero = `0${horario.getSeconds()}`
    }else{
        secondsZero = `${horario.getSeconds()}`
    }
    horaMensaje = `${hoursZero}:${minutesZero}:${secondsZero}`
    // console.log(horaMensaje)
    // console.log(horario.getHours(),horario.getMinutes(),horario.getSeconds())
}

// hora0()

let usuario = document.querySelector("#usuario")
const usuarioNombre = usuario.value.toUpperCase()

const chatCuadro = document.querySelector(".chat")

const chat = document.querySelector('.texto')
const conectados2 = document.querySelector('.list-conectados')


//Con esta funcion hago que el scroll del chat siempre este en el último mensaje
function updateScroll(){
    var element = document.getElementById("chat-texto");
    element.scrollTop = element.scrollHeight;
}

function enviarUsuario(){
    socket.emit("mensaje-usuario", usuario.value.toUpperCase())
    // console.log(usuario.value)
    usuario.value = "";
    let entradaU = document.querySelector(".entradaU")
    entradaU.innerHTML = "";
    entradaU.style.display = "none";
    chatCuadro.style.display = "block";
    
}

//Con esto envio los datos del Nombre de usuario y saco el formulario para que no pueda  volver a enviar otro nombre salvo que actualizen la pagina.
let btnEnviarU = document.querySelector("#usuariobtn")
btnEnviarU.addEventListener("click", () => {
    enviarUsuario()
})

usuario.addEventListener('keydown', (key) =>{
    if(key.keyCode == 13){
        enviarUsuario()
    }    
})

//Con esto llamo a quienes son los usuarios que se conectaron y los ingreso en un HTML que luego se imprime en pantalla
socket.on("mensaje-U", (conectados) => {
    let html2 = ''
    // console.log(conectados)
    conectados.forEach(item => {
        html2 += `
            <li class="nombreU"> ${item.nombre} </li>
        `       
    })
    // console.log(conectados)
    // console.log(html2)
    conectados2.innerHTML = html2
     
})

//Con esto recibo solo en consola los mensajes de conexion y desconexion de algun usuario desde el back
socket.on("mensaje-conexion", (data)=>{
    // console.log(data)
})

//Con esto recibo los mensajes, junto con el nombre de usuario de los demas, y los agrego al chat.
socket.on("mensaje-chat", (data) =>{
    // console.log(data)
    let mensajes = []
    mensajes.push(data)
    // console.log(mensajes)
    mensajes.forEach(item => {
        hora0()
        html += `
            <div class="mensaje-chat"><p class="text-message"> ${item.usuario} - ${item.mensaje.mensaje} </p><small class="hora">${horaMensaje}</small></div>
        `   
    })
    // console.log(html)
    chat.innerHTML = html
    updateScroll() //llama a la funcion para que cada vez que llegue un mensaje vaya al final
    
})


//aca creo la funcion para que poder mandar el mensaje propio a los otros chat y a la vez imprimirlo en la pantalla de manera distinta a cuando recibo de otros usuarios.
let mensaje = document.querySelector("#input1")
const prueba = () => {
    hora0()
    socket.emit("mensaje", {mensaje : mensaje.value})
    console.log(mensaje.value)
    html += `
        <div class="mensaje-chat-propio"><small class="horaPropio">${horaMensaje}</small><p>  ${mensaje.value} - YO</p></div>
    `
    chat.innerHTML = html
    mensaje.value = ""; 
    updateScroll()
}

mensaje.addEventListener('keypress', () => {
    socket.emit('chat:escribiendo', );
})

let span = document.querySelector('span');

socket.on('chat:escribiendo', (data) => {
    console.log(data)
    span.innerHTML = `<p><em>${data} está escribiendo</em></p>`
    setTimeout(() => {
        span.innerHTML = "";
    }, 3000);
});

// aca 2 formas de llamar a la funcion para enviar el mensaje a otros. Primero con el boton enviar.
let btnEnviar = document.querySelector("#input2")
btnEnviar.addEventListener("click", () => {
    prueba()    
})

//o segundo mandando el mensaje presionando las teclas enter del teclado
mensaje.addEventListener('keydown', (key) =>{
    if(key.keyCode == 13){
        btnEnviar.click()
    }    
})
