
mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
    });
   

   


    const marker1 = new mapboxgl.Marker({ color: "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 10})
    .setHTML(`<h3> ${listing.title}</h3><p>Exact Loaction Will We Provided After Booking</p>`))
    .addTo(map);    
     
    
    