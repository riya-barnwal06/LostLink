const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async function (event) {

    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = 'Login successful! Redirecting...';
        message.style.color = 'green';

        loginForm.reset();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {

        message.textContent = error.message;
        message.style.color = 'red';

    }

});