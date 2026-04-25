const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

function redirectUser(role) {
    if (role === 'admin') {
        window.location.href = '/admin.html';
    } else {
        // Patient, doctor, and caregiver all use the unified dashboard
        window.location.href = '/dashboard.html';
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        const role = document.getElementById('login-role')?.value;

        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, role })
            });
            console.log('Login response:', res);

            if (res && res.token) {
                localStorage.setItem('token', res.token);
                // Backward compatibility + root level assignment
                const userObj = res.user ? res.user : {
                    id: res._id || res.id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    age: res.age,
                    doctorName: res.doctorName
                };
                localStorage.setItem('user', JSON.stringify(userObj));
                redirectUser(userObj.role);
            } else {
                alert(res?.msg || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('An error occurred');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Registration form submitted');
        
        const name = document.getElementById('reg-name')?.value;
        const email = document.getElementById('reg-email')?.value;
        const password = document.getElementById('reg-password')?.value;
        const role = document.getElementById('role-select')?.value;
        const age = document.getElementById('reg-age')?.value;
        const doctorName = document.getElementById('reg-doctor')?.value;
        
        const data = { name, email, password, role, age, doctorName };
        console.log('Registration data:', data);

        try {
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            console.log('Registration response:', res);

            if (res && res.token) {
                localStorage.setItem('token', res.token);
                // Backward compatibility + root level assignment
                const userObj = res.user ? res.user : {
                    id: res._id || res.id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    age: res.age,
                    doctorName: res.doctorName
                };
                localStorage.setItem('user', JSON.stringify(userObj));
                redirectUser(userObj.role);
            } else {
                alert(res?.msg || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert('An error occurred');
        }
    });
}
