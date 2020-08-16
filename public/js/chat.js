const socket = io();

const $mesageForm = document.querySelector('#message-form')
const $mesageFormInput = document.querySelector('input')
const $mesageFormButton = document.querySelector('button')
const $shareLocation = document.querySelector('#send-location')
const $mesages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {data:message.text, createdAt: moment(messages.createdAt).format('h:mm a')})
  $mesages.insertAdjacentHTML('beforeend', html)
})


socket.on('locationMessage', (url) => {
  console.log(url);
  const html = Mustache.render(locationTemplate,{url:url.url, createdAt: moment(url.createdAt).format('h:mm a')})
  $mesages.insertAdjacentHTML('beforeend', html)
})



$mesageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const message = e.target.elements.msg.value;
  
  $mesageFormButton.setAttribute('disabled', 'disabled')


  socket.emit('sendMessage', message, (error) => {
    if(error){
      return console.log(error);
    }
    $mesageFormButton.removeAttribute('disabled')
    $mesageFormInput.value = ''
    $mesageFormInput.focus()
    console.log('Message Delievered!');
  })
})



$shareLocation.addEventListener('click', () => {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by browser');
  }

  $shareLocation.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {

    const location = {latitude: position.coords.latitude, longitude: position.coords.longitude}
    
    socket.emit('sendLocation', location, () => {
      $shareLocation.removeAttribute('disabled')
      console.log('Location assertained');
    })
  })
})