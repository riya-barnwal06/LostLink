const itemDetails = document.getElementById('itemDetails');

// Get item ID from URL
const params = new URLSearchParams(window.location.search);
const itemId = params.get('id');

// Fetch individual item details
async function loadItemDetails() {

    if (!itemId || !/^[1-9]\d*$/.test(itemId)) {
        itemDetails.textContent = 'Invalid item ID.';
        return;
    }

    try {

        const response = await fetch('/api/items/' + itemId);

        if (!response.ok) {
            throw new Error('Item not found.');
        }

        const item = await response.json();

        displayItem(item);

    } catch (error) {

        console.error(error);
        itemDetails.textContent = error.message;

    }

}

// Display item details
function displayItem(item) {

    const card = document.createElement('div');
    card.className = 'details-card';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'details-image';

    if (item.image_path) {

        const img = document.createElement('img');
        img.src = item.image_path;
        img.alt = item.item_name;

        imageContainer.appendChild(img);

    } else {

        const placeholder = document.createElement('span');
        placeholder.textContent = '📦';

        imageContainer.appendChild(placeholder);

    }

    const info = document.createElement('div');
    info.className = 'details-info';

    const status = document.createElement('span');
    status.className = 'details-status ' + item.report_type.toLowerCase();
    status.textContent = item.report_type.toUpperCase();

    const name = document.createElement('h1');
    name.textContent = item.item_name;

    const category = document.createElement('p');
    category.innerHTML = '<strong>Category:</strong> ';
    category.append(document.createTextNode(item.category));

    const location = document.createElement('p');
    location.innerHTML = '<strong>Location:</strong> ';
    location.append(document.createTextNode(item.location));

    const date = document.createElement('p');
    date.innerHTML = '<strong>Date:</strong> ';
    date.append(document.createTextNode(item.item_date));

    // Recovery status
    const recoveryStatus = document.createElement('p');
    recoveryStatus.innerHTML = '<strong>Recovery Status:</strong> ';

    const statusText = document.createElement('span');
    statusText.textContent = item.status;
    statusText.className = 'recovery-status';

    recoveryStatus.appendChild(statusText);

    const descriptionBox = document.createElement('div');
    descriptionBox.className = 'details-description';

    const heading = document.createElement('h3');
    heading.textContent = 'Description';

    const description = document.createElement('p');
    description.textContent = item.description;

    descriptionBox.appendChild(heading);
    descriptionBox.appendChild(description);

    info.appendChild(status);
    info.appendChild(name);
    info.appendChild(category);
    info.appendChild(location);
    info.appendChild(date);
    info.appendChild(recoveryStatus);
    info.appendChild(descriptionBox);

    // Mark as Recovered button
    if (item.status === 'Active') {

        const recoverButton = document.createElement('button');
        recoverButton.textContent = 'Mark as Recovered';
        recoverButton.className = 'recover-btn';

        recoverButton.addEventListener('click', async function () {

            const confirmRecovery = confirm(
                'Are you sure you want to mark this item as recovered?'
            );

            if (!confirmRecovery) {
                return;
            }

            try {

                recoverButton.disabled = true;
                recoverButton.textContent = 'Updating...';

                const response = await fetch('/api/items/' + item.id + '/status', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'Recovered'
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message);
                }

                alert('Item marked as recovered successfully!');

                loadItemDetails();

            } catch (error) {

                alert(error.message);
                recoverButton.disabled = false;
                recoverButton.textContent = 'Mark as Recovered';

            }

        });

        info.appendChild(recoverButton);

    } else {

        const recoveredMessage = document.createElement('p');
        recoveredMessage.textContent = '✓ This item has been recovered!';
        recoveredMessage.className = 'recovered-message';

        info.appendChild(recoveredMessage);

    }

    card.appendChild(imageContainer);
    card.appendChild(info);

    itemDetails.replaceChildren(card);

}

loadItemDetails();