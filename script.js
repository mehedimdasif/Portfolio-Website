const email = document.getElementById('exampleInputEmail1')
const message = document.getElementById('exampleInputPassword1')
const form = document.getElementById('form')

form.addEventListener('submit',(e) => {
    let message = []
    if(email.value === '' || email.value === null) {
        message.push('Email is required')
    }

    if(message.value === '' || message.value === null) {
        message.push('Email is required')
    }
})