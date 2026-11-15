const reportForm = document.getElementById('reportForm');

reportForm.addEventListener('submit', async function (event) {

    event.preventDefault();

    const reportType = document.querySelector('input[name="reportType"]:checked');
    const itemName = document.getElementById('itemName').value.trim();
    const image = document.getElementById('image').files[0];

    if (itemName.length < 2) {
        alert('Please enter a valid item name.');
        return;
    }

    if (image && image.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5 MB.');
        return;
    }

    const formData = new FormData();

    formData.append('reportType', reportType.value);
    formData.append('itemName', itemName);
    formData.append('category', document.getElementById('category').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('date', document.getElementById('date').value);
    formData.append('contact', document.getElementById('contact').value);

    if (image) {
        formData.append('image', image);
    }

    try {

        const response = await fetch('/api/items', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(result.message + '\nReport ID: ' + result.itemId);

        reportForm.reset();

    } catch (error) {

        console.error(error);
        alert(error.message || 'Unable to submit report. Please try again.');

    }

});