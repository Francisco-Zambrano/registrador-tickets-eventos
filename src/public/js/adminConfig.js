document.addEventListener('DOMContentLoaded', function() {

    const deleteButtons = document.querySelectorAll('.delete_user');

    deleteButtons.forEach(button => {

        button.addEventListener('click', function(event) {

            event.preventDefault();

            const userId = this.getAttribute('data-id');

            if (confirm('Are you sure you want to delete this user?')) {

                fetch('/config/deleteUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                })
                .then(response => {
                    if (response.ok) {
                        alert('User successfully deleted');
                        location.reload();
                    } else {
                        alert('Error deleting user');
                    }
                })
                .catch(error => {
                    console.error('error:', error);
                    alert('An error occurred while deleting the user');
                });
            }
        });
    });


    const premiumButtons = document.querySelectorAll('.premium_user');

    premiumButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const userId = this.getAttribute('data-id');

            if (confirm('Are you sure you want to upgrade this user to premium?')) {
                fetch('/config/updateRole', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, role: 'premium' })
                })
                .then(response => {
                    if (response.ok) {
                        alert('User role successfully updated to premium');
                        location.reload();
                    } else {
                        alert('Error updating user role');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while updating the user role');
                });
            }
        });
    });

});