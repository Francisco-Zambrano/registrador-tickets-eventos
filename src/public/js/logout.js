import { logger } from "../../utils/logger.js";

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();

        fetch('/api/sessions/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/login';
            } else {
                logger.error('Error when trying to log out');
            }
        })
        .catch(error => {
            logger.error('Error in fetch request:', error);
        });
    });
});