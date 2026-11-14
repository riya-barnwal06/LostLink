const reportForm = document.getElementById('reportForm');

reportForm.addEventListener('submit', function (event) {

    event.preventDefault();

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

    alert('Report form validated successfully!');

    reportForm.reset();

});