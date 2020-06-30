const socket = io();

socket.on('message', (message) => {
    console.log(message);
})

const $mesageForm = document.querySelector('#msg-form')
const $mesageFormInput = document.querySelector('input')
const $mesageFormButton = document.querySelector('button')

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

const $shareLocation = document.querySelector('#share-location')

$shareLocation.addEventListener('click', () => {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by browser');
  }

  $shareLocation.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {

    const location = {latitude: position.coords.latitude, longitude: position.coords.latitude}
    
    socket.emit('sendLocation', location, () => {
      $shareLocation.removeAttribute('disabled')
      console.log('Location assertained');
    })
  })
})