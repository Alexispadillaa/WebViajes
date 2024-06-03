// Función para redirigir después de registro exitoso
function redirectToLogin() {
    window.location.href = "login.html";
}

// Registro de Usuario
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (storedUsers.find(user => user.username === newUsername)) {
        alert('El nombre de usuario ya existe');
    } else {
        storedUsers.push({ username: newUsername, password: newPassword });
        localStorage.setItem('users', JSON.stringify(storedUsers));
        alert('Usuario registrado exitosamente');
        redirectToLogin();
    }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'schedule.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

// Agendar Cita
document.getElementById('scheduleForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = localStorage.getItem('loggedInUser');
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const description = document.getElementById('description').value;

    const storedAppointments = JSON.parse(localStorage.getItem('appointment')) || [];
    
    const editIndex = localStorage.getItem('editIndex');
    if (editIndex !== null) {
        storedAppointments[editIndex] = { username, origin, destination, date, time, description };
        localStorage.removeItem('editIndex');
        alert('Cita actualizada exitosamente');
    } else {
        storedAppointments.push({ username, origin, destination, date, time, description });
        alert('Cita agendada exitosamente');
    }

    localStorage.setItem('appointment', JSON.stringify(storedAppointments));
    document.getElementById('scheduleForm').reset();
    window.location.href = 'appointment.html';
});

// Mostrar Citas
function loadAppointments() {
    const storedAppointments = JSON.parse(localStorage.getItem('appointment')) || [];
    const appointmentsTable = document.getElementById('appointmentsTable');

    storedAppointments.forEach((appointment, index) => {
        const row = appointmentsTable.insertRow();
        row.insertCell(0).innerText = appointment.username;
        row.insertCell(1).innerText = appointment.origin;
        row.insertCell(2).innerText = appointment.destination;
        row.insertCell(3).innerText = appointment.date;
        row.insertCell(4).innerText = appointment.time;
        row.insertCell(5).innerText = appointment.description;

        const actionsCell = row.insertCell(6);
        const editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.className = 'btn btn-warning btn-sm mr-2';
        editButton.addEventListener('click', () => editAppointment(index));

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Eliminar';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.addEventListener('click', () => deleteAppointment(index));

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    });

    // Inicializar el calendario
    $('#calendar').fullCalendar({
        events: storedAppointments.map(appointment => ({
            title: `${appointment.username} - ${appointment.time}`,
            start: appointment.date,
            description: appointment.description
        })),
        eventRender: function(event, element) {
            element.find('.fc-title').append(`<br/><span class="fc-description">${event.description}</span>`);
        }
    });
}

// Editar Cita
function editAppointment(index) {
    localStorage.setItem('editIndex', index);
    window.location.href = 'schedule.html';
}

// Eliminar Cita
function deleteAppointment(index) {
    const storedAppointments = JSON.parse(localStorage.getItem('appointment')) || [];
    storedAppointments.splice(index, 1);
    localStorage.setItem('appointment', JSON.stringify(storedAppointments));

    alert('Cita eliminada exitosamente');
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('appointmentsTable')) {
        loadAppointments();
    }
});
