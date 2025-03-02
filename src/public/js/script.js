const ticketForm = document.getElementById('ticketForm');
const ticketList = document.getElementById('ticketList');
const filterButton = document.getElementById('filterButton');
const clearFilterButton = document.getElementById('clearFilterButton');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const reasonPopup = document.getElementById('reason-popup');
const reasonText = document.getElementById('reason-text');
const submitReasonButton = document.getElementById('submit-reason');
const cancelReasonButton = document.getElementById('cancel-reason');
let currentStartDate = '';
let currentEndDate = '';


function showReasonPopup(ticketId, type) {
    reasonPopup.style.display = 'flex';
    reasonText.value = '';
    submitReasonButton.onclick = () => {
        const reason = reasonText.value;
        if (type === 'complete') {
            completeTicket(ticketId, reason);
        } else if (type === 'cancel') {
            cancelTicket(ticketId, reason);
        }
        reasonPopup.style.display = 'none';
    };
    cancelReasonButton.onclick = () => {
        reasonPopup.style.display = 'none';
    };
}

// Вывод обращений
function fetchTickets(startDate = currentStartDate, endDate = currentEndDate) {
    let url;

    if (startDate) {
        // If startDate is provided, use the filter endpoint
        url = 'http://localhost:3000/api/tickets/filter';
    } else {
        // If no startDate, fetch all tickets
        url = 'http://localhost:3000/api/tickets/get-tickets';
    }

    const requestBody = {
        startDate: startDate,
        endDate: endDate
    };

    fetch(url, {
        method: startDate ? 'POST' : 'GET', // Use POST for filtering, GET for all tickets
        headers: {
            'Content-Type': 'application/json'
        },
        body: startDate ? JSON.stringify(requestBody) : null // Only send body if filtering
    })
        .then(response => response.json())
        .then(data => {
            ticketList.innerHTML = ''; // Clear the current ticket list
            data.forEach(ticket => {
                const ticketDiv = document.createElement('div');
                ticketDiv.className = 'ticket';
                ticketDiv.innerHTML = `
                    <h3>Тема обращения: ${ticket.subject}</h3>
                    <p>Текст обращения: ${ticket.message}</p>
                    <p>Статус: ${ticket.status}</p>
                `;

                // Add buttons based on the ticket status
                switch (ticket.status) {
                    case 'Завершено':
                        ticketDiv.innerHTML += `
                            <p>Решение проблемы: ${ticket.resolution || 'Не доступно'}</p>
                            <p>Создано: ${new Date(ticket.createdAt).toUTCString()}</p>
                            <p>Обновлено: ${new Date(ticket.updatedAt).toUTCString()}</p>
                        `;
                        break;
                    case 'Отменено':
                        ticketDiv.innerHTML += `
                            <p>Причина отмены: ${ticket.cancellationReason || 'Не доступно'}</p>
                            <p>Создано: ${new Date(ticket.createdAt).toUTCString()}</p>
                            <p>Обновлено: ${new Date(ticket.updatedAt).toUTCString()}</p>
                        `;
                        break;
                    case 'В работе':
                        ticketDiv.innerHTML += `
                            <p>Создано: ${new Date(ticket.createdAt).toUTCString()}</p>
                            <p>Обновлено: ${new Date(ticket.updatedAt).toUTCString()}</p>
                            <button onclick="showReasonPopup('${ticket.id}', 'complete')">Выполнить</button>
                            <button onclick="showReasonPopup('${ticket.id}', 'cancel')">Отмена</button>
                        `;
                        break;
                    default:
                        ticketDiv.innerHTML += `
                            <p>Создано: ${new Date(ticket.createdAt).toUTCString()}</p>
                            <p>Обновлено: ${new Date(ticket.updatedAt).toUTCString()}</p>
                            <button onclick="takeToWork('${ticket.id}')">Взять на обработку</button>
                            <button onclick="showReasonPopup('${ticket.id}', 'cancel')">Отмена</button>
                        `;
                        break;
                }

                ticketList.appendChild(ticketDiv);
            });
        })
        .catch(error => console.error('Ошибка:', error));
}

// Добавление нового обращения
ticketForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    fetch('http://localhost:3000/api/tickets/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject, message })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchTickets();
            ticketForm.reset();
        })
        .catch(error => console.error('Ошибка:', error));
});

// Взять обращение на работу
function takeToWork(ticketId) {
    fetch(`http://localhost:3000/api/tickets/take`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: ticketId })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchTickets();
        })
        .catch(error => console.error('Ошибка:', error));
}

// Обращение выполнено
function completeTicket(ticketId, reason) {
    fetch(`http://localhost:3000/api/tickets/complete`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: ticketId, completeReason: reason })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchTickets();
        })
        .catch(error => console.error('Ошибка:', error));
}

// Отменить обращение
function cancelTicket(ticketId, reason) {
    fetch(`http://localhost:3000/api/tickets/cancel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: ticketId, cancelReason: reason })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchTickets();
        })
        .catch(error => console.error('Ошибка:', error));
}


// Фильтруем обращения по диапозону дат или дате
filterButton.addEventListener('click', function () {
    currentStartDate = startDate.value;
    currentEndDate = endDate.value;
    fetchTickets(currentStartDate, currentEndDate);
});

// Очищаем фильтр
clearFilterButton.addEventListener('click', function () {
    startDate.value = '';
    endDate.value = '';
    currentStartDate = '';
    currentEndDate = '';
    fetchTickets();
});

// Отмена всех обращений в работе
function cancelAllInProgress() {
    fetch('http://localhost:3000/api/tickets/cancel-all', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchTickets();
        })
        .catch(error => console.error('Ошибка:', error));
}

document.getElementById('cancelAllButton').addEventListener('click', function () {
    // Подтверждаем деиствие
    if (confirm('Вы уверены в отмене всех обращений в работе?')) {
        fetch('http://localhost:3000/api/tickets/cancel-all', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                // Обновляем список обращений
                fetchTickets();
            })
            .catch(error => console.error('Ошибка:', error));
    }
});

// Initial fetch of tickets
fetchTickets();
