
document.addEventListener('DOMContentLoaded', () => {
  // Verify required globals exist
  if (typeof mapToken === 'undefined' || typeof listing === 'undefined' || !listing.geometry) {
    console.error('Required map variables missing');
    return;
  }

  try {
    // Initialize mapbox
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: listing.geometry.coordinates,
      zoom: 9
    });

    // Add marker
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)
      )
      .addTo(map);

  } catch (err) {
    console.error('Error initializing map:', err);
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
      mapDiv.style.display = 'none';
    }
  }
});