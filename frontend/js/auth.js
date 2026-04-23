const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const email = inputs[0].value;
        const password = inputs[1].value;

        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (res.token) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
                window.location.href = 'dashboard.html';
            } else {
                alert(res.msg || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = registerForm.querySelectorAll('input');
        const role = document.getElementById('role-select').value;
        
        const data = {
            name: inputs[0].value,
            email: inputs[1].value,
            password: inputs[2].value,
            role: role,
            age: inputs[3].value,
            doctorName: inputs[4].value
        };

        try {
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (res.token) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
                window.location.href = 'dashboard.html';
            } else {
                alert(res.msg || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        }
    });
}
