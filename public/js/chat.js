

const socket= io();

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button');
const $messages =document.querySelector('#messages');






//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const sidebarTemplate =document.querySelector("#sidebar-template").innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    // if (containerHeight - newMessageHeight <= scrollOffset) {
    //     $messages.scrollTop = $messages.scrollHeight
    // }
    $messages.scrollTop=$messages.scrollHeight;
}


socket.on('countUpdated',(count)=>{
    console.log("the count has been updated"+count);
});

socket.on('message',({user,text,created_at})=>{
    console.log(text);
    const html = Mustache.render(messageTemplate,{
        user,
       text,
       created_at: moment(created_at).format('H:m a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();

});





// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log("clicked")
//     socket.emit('increment');
// });

// document.querySelector('#message-form').addEventListener('submit',(e)=>{
//     e.preventDefault();
//     const message= document.querySelector('input').value;
    
//    // socket.emit('sendMessage',message);
//     const func=()=>{
//         console.log("Message was delivered ");
//     }
    
//     socket.emit('sendMessage',message,func);


// });


socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML=html;
})





$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disable','disable'); // disable the form once submitted

    //disable
    const message = document.querySelector('input').value;
    //const message = e.target.elements.Message
    
    socket.emit('sendMessage',message,(error)=>{
        //enable button
        
        $messageFormButton.removeAttribute('disable');
        $messageFormInput.value = "";
       $messageFormInput.focus();
       if(error){
           return console.log(error);

       }
       else 
       console.log("message delivered!!");
    });
});





document.querySelector('#getlocation').addEventListener('click',(e)=>{
    if(!navigator.geolocation)
    return alert("Geolocation is not supported by the browser");

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
    socket.emit('shareposition',{
        latitude:position.coords.latitude,
        longitude: position.coords.longitude
    },()=>{
        

        console.log("location shared!");
    });
    });

})

//server (emit) -> client(recieve) -> acknowledgement ->server
// same vice versa

// document.querySelector('#message-form').addEventListener('enter',(e)=>{
//     e.preventDefault();
//     //const message = document.querySelector('input').value;
//     const message= e.target.elements.message;
//     socket.emit('sendMessage',message,()=>{
//         console.log("Message was delivered ");
//     });

    
// });

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/' //send them to root of the site
    }
});

socket.on('redirect',(message)=>{
    alert(message);
    location.href='/'
})