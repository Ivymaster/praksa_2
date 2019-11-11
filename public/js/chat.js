const socket= io();

const autoscroll = ()=>{
    const newMessage = document.querySelector("#message-board").lastElementChild

    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = document.querySelector("#message-board").offsetHeight
    const containerHeight = document.querySelector("#message-board").scrollHeight

    const scrollOffset = document.querySelector("#message-board").scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        document.querySelector("#message-board").scrollTop = document.querySelector("#message-board").scrollHeight
    }

}

 socket.on("serverMessage", (message)=>{
    const html = Mustache.render(document.querySelector("#message-template").innerHTML, {
        username: message.username,
        text: message.text,
        createdAt: moment(message.createdAt).format('HH:mm ')
    })
    document.querySelector("#message-board").insertAdjacentHTML('beforeend',html)
    autoscroll()
});

socket.on("message", (message)=>{
    const html = Mustache.render(document.querySelector("#message-template").innerHTML, {
        username: message.username,
        text: message.text,
        createdAt: moment(message.createdAt).format('HH:mm ')
    })
    document.querySelector("#message-board").insertAdjacentHTML('beforeend',html)  
    autoscroll()
});

socket.on("roomData", ({room, users})=>{
    const html = Mustache.render(document.querySelector("#sidebar-template").innerHTML, {
        room,
        users,
        createdAt: moment(message.createdAt).format('HH:mm ')
    })
    document.querySelector("#sidebar").insertAdjacentHTML('beforeend',html)  
});

socket.on("locationMessage", (url)=>{
    const html = Mustache.render(document.querySelector("#location-template").innerHTML, {
            username: url.username,
            url: url.url,
            createdAt: moment(url.createdAt).format('HH:mm ')
    })
    document.querySelector("#message-board").insertAdjacentHTML('beforeend',html)
    autoscroll()
});

document.querySelector("#submit").addEventListener("click",()=>{
    console.log("slanje");
    socket.emit("clientMessage", document.querySelector("#message").value);
    document.querySelector("#message").focus(); 
})

document.querySelector("#send-location").addEventListener("click",()=>{
    console.log("loakcija");
    if(!navigator.geolocation){
        return alert("Geolokacija nije podrzana");
    }
     navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("sendLocation",
        {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },
        ()=>{
            console.log("Lokacija poslana");
        })
     });
    
})

//let {username, room} = qs.parse(location.search, {ignoreQueryPrefix: true})
socket.emit("join",location.search, (error)=>{
    if(error){
        alert(error)
        location.href = "/"
    }
})