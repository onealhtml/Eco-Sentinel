let map = L.map('mapContainer').setView([-14.235, -51.925], 4); // Center of Brazil

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const fireIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});


const preDefinedFires = [
    { lat: -23.5505, lng: -46.6333, description: "Incêndio florestal em São Paulo" },
    { lat: -22.9068, lng: -43.1729, description: "Fogo na Floresta da Tijuca, Rio de Janeiro" },
    { lat: -15.7801, lng: -47.9292, description: "Queimada no Cerrado, Brasília" },
    { lat: -3.7319, lng: -38.5267, description: "Incêndio na região metropolitana de Fortaleza" },
    { lat: -12.9714, lng: -38.5014, description: "Fogo em área de preservação, Salvador" }
];


function addFireMarker(lat, lng, description) {
    const address = document.getElementById('address').value;
    const marker = L.marker([lat, lng], { icon: fireIcon }).addTo(map);
    marker.bindPopup(`<b>Incêndio Reportado</b><br>${description}<br>Reportado em ${new Date().toLocaleString()}`);


    addAlert(`Novo incêndio reportado em ${address}`);
}


preDefinedFires.forEach(fire => {
    addFireMarker(fire.lat, fire.lng, fire.description);
});


async function geocodeAddress(address) {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`);
    const data = await response.json();

    if (data.length === 0) {
        throw new Error('Endereço não encontrado');
    }

    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
    };
}


const fireReportForm = document.getElementById('fireReportForm');

fireReportForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const address = document.getElementById('address').value;
    const description = document.getElementById('description').value;

    try {
        const coordinates = await geocodeAddress(address);
        addFireMarker(coordinates.lat, coordinates.lng, description);
        alert('Relatório de incêndio enviado com sucesso!');
        fireReportForm.reset();
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
});


function addAlert(message) {
    const alertsList = document.getElementById('alertsList');
    const newAlert = document.createElement('li');
    newAlert.textContent = message;
    alertsList.insertBefore(newAlert, alertsList.firstChild);


    if (alertsList.children.length > 5) {
        alertsList.removeChild(alertsList.lastChild);
    }
}


addAlert("Alerta de incêndio na região metropolitana de São Paulo");
addAlert("Risco elevado de incêndios no Pantanal devido à seca prolongada");
addAlert("Operação de combate a incêndios iniciada no Parque Nacional da Chapada dos Veadeiros");


document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});