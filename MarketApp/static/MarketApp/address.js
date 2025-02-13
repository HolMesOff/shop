
function openPopup() {
    document.getElementById('address-popup').style.display = 'block';
    document.getElementById('address-popup').style.width = '600vw';
    updateAddressList();
}

function closePopup() {
    document.getElementById('address-popup').style.display = 'none';
}

function updateAddressList() {
    const addressList = document.getElementById('address-list');
    addressList.innerHTML = ''; // Очистить текущий список

    const addresses = getSavedAddresses();

    addresses.forEach(address => {
        const p = document.createElement('p');
        p.textContent = address;
        p.onclick = () => selectAddress(address);
        addressList.appendChild(p);
    });
}

function saveAddress() {
    const newAddress = document.getElementById('new-address').value.trim();
    if (newAddress) {
        let addresses = getSavedAddresses();
        if (addresses.length >= 3) {
            addresses.shift(); // Удалить старый адрес, если больше 3
        }
        addresses.push(newAddress);
        localStorage.setItem('savedAddresses', JSON.stringify(addresses));
        document.getElementById('addr').textContent = newAddress;
        closePopup();
    }
}

function selectAddress(address) {
    document.getElementById('addr').textContent = address;
    closePopup();
}

function getSavedAddresses() {
    const savedAddresses = localStorage.getItem('savedAddresses');
    return savedAddresses ? JSON.parse(savedAddresses) : [];
}

document.addEventListener('DOMContentLoaded', () => {
    updateAddressList();
});
