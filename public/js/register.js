const registerForm = document.getElementById('registerForm');
const message = document.getElementById('message');

registerForm.addEventListener('submit', async function (event) {

    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match!';
        message.style.color = 'red';
        return;
    }

    if (password.length < 8) {
        message.textContent = 'Password must be at least 8 characters.';
        message.style.color = 'red';
        return;
    }

    try {

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = 'Registration successful! Redirecting to login...';
        message.style.color = 'green';

        registerForm.reset();

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {

        message.textContent = error.message;
        message.style.color = 'red';

    }

});