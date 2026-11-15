const itemGrid = document.getElementById('itemGrid');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

let allItems = [];

// Fetch reports from the database
async function loadItems() {

    try {

        const response = await fetch('/api/items');

        if (!response.ok) {
            throw new Error('Failed to fetch reports.');
        }

        allItems = await response.json();

        updateStatistics(allItems);
        displayItems(allItems);

    } catch (error) {

        console.error(error);
        itemGrid.textContent = 'Unable to load reports. Please try again later.';

    }

}

// Update homepage statistics
function updateStatistics(items) {

    const total = items.length;

    const recovered = items.filter(
        item => item.status === 'Recovered'
    ).length;

    const active = items.filter(
        item => item.status === 'Active'
    ).length;

    document.getElementById('totalItems').textContent = total;
    document.getElementById('recoveredItems').textContent = recovered;
    document.getElementById('activeItems').textContent = active;

}

// Display reports
function displayItems(items) {

    itemGrid.innerHTML = '';

    if (items.length === 0) {
        itemGrid.textContent = 'No reports found.';
        return;
    }

    items.forEach(item => {

        const card = document.createElement('div');
        card.className = 'item-card';

        const image = document.createElement('div');
        image.className = 'item-image';

        if (item.image_path) {

            const img = document.createElement('img');
            img.src = item.image_path;
            img.alt = item.item_name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';

            image.appendChild(img);

        } else {

            image.textContent = '📦';

        }

        const info = document.createElement('div');
        info.className = 'item-info';

        const status = document.createElement('span');
        status.className = 'status ' + item.report_type.toLowerCase();
        status.textContent = item.report_type.toUpperCase();

        const name = document.createElement('h3');
        name.textContent = item.item_name;

        const location = document.createElement('p');
        location.textContent = '📍 ' + item.location;

        const date = document.createElement('p');
        date.textContent = 'Reported on: ' + item.item_date;

        const category = document.createElement('p');
        category.textContent = item.category;

        info.appendChild(status);
        info.appendChild(name);
        info.appendChild(category);
        info.appendChild(location);
        info.appendChild(date);

        // View Details button
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'View Details →';

        detailsButton.addEventListener('click', function () {
            window.location.href = 'item.html?id=' + item.id;
        });

        info.appendChild(detailsButton);

        card.appendChild(image);
        card.appendChild(info);

        itemGrid.appendChild(card);

    });

}

// Search reports
function searchItems() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredItems = allItems.filter(item => {

        return item.item_name.toLowerCase().includes(searchText) ||
            item.category.toLowerCase().includes(searchText) ||
            item.location.toLowerCase().includes(searchText) ||
            item.report_type.toLowerCase().includes(searchText);

    });

    displayItems(filteredItems);

}

searchButton.addEventListener('click', searchItems);

searchInput.addEventListener('input', searchItems);

// Load reports when homepage opens
loadItems();

// Check whether the user is logged in
async function checkLoginStatus() {

    const authButton = document.getElementById('authButton');

    try {

        const response = await fetch('/api/auth/me');

        if (!response.ok) {
            return;
        }

        const user = await response.json();

        authButton.textContent = 'Logout';
        authButton.href = '#';

        authButton.addEventListener('click', async function (event) {

            event.preventDefault();

            const logoutResponse = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });

            if (logoutResponse.ok) {
                window.location.reload();
            }

        });

    } catch (error) {

        console.error('Unable to check login status:', error);

    }

}

checkLoginStatus();