import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { dish, latitude, longitude, radius_miles = 5 } = body;

    if (!dish) {
      return Response.json({ error: 'Dish name is required' }, { status: 400 });
    }

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

    if (!GOOGLE_API_KEY) {
      // Return mock data if no API key
      const mockRestaurants = generateMockRestaurants(dish, latitude, longitude, radius_miles);
      return Response.json({ results: mockRestaurants, mock: true });
    }

    // Use Google Places Text Search
    const radiusMeters = Math.round(radius_miles * 1609.34);
    const query = encodeURIComponent(`${dish} restaurant`);
    let locationParam = '';
    if (latitude && longitude) {
      locationParam = `&location=${latitude},${longitude}&radius=${radiusMeters}`;
    }

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}${locationParam}&type=restaurant&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return Response.json({ error: `Places API error: ${data.status}`, results: [] }, { status: 200 });
    }

    const results = (data.results || []).map(place => {
      let photoUrl = null;
      if (place.photos && place.photos.length > 0) {
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`;
      }

      let distance = null;
      if (latitude && longitude && place.geometry?.location) {
        distance = calculateDistance(
          latitude, longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        );
      }

      return {
        place_id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        rating: place.rating || null,
        price_level: place.price_level || null,
        total_ratings: place.user_ratings_total || 0,
        latitude: place.geometry?.location?.lat || null,
        longitude: place.geometry?.location?.lng || null,
        photo_url: photoUrl,
        open_now: place.opening_hours?.open_now ?? null,
        distance_miles: distance ? Math.round(distance * 10) / 10 : null,
        within_radius: distance !== null ? distance <= radius_miles : true,
      };
    });

    // Sort: within radius first, then by rating
    results.sort((a, b) => {
      if (a.within_radius !== b.within_radius) return a.within_radius ? -1 : 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    return Response.json({ results, mock: false });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function generateMockRestaurants(dish, lat, lng, radius) {
  const baseLat = lat || 51.5074;
  const baseLng = lng || -0.1278;
  const names = [
    `The Golden ${dish} House`, `${dish} & Co`, `Mama's ${dish} Kitchen`,
    `${dish} Paradise`, `The ${dish} Garden`, `Artisan ${dish} Bar`,
    `${dish} Street Kitchen`, `Le ${dish} Bistro`, `${dish} Republic`, `Spice of ${dish}`
  ];
  return names.map((name, i) => {
    const offset = (i + 1) * 0.008;
    const angle = (i * 36) * Math.PI / 180;
    const distance = (i < 6 ? Math.random() * radius * 0.9 + 0.1 : radius + Math.random() * 3);
    return {
      place_id: `mock_${i}`,
      name,
      address: `${10 + i * 7} ${['High Street', 'Main Road', 'Church Lane', 'Market Square', 'King\'s Road'][i % 5]}, London`,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      price_level: Math.ceil(Math.random() * 3),
      total_ratings: Math.floor(50 + Math.random() * 800),
      latitude: baseLat + Math.sin(angle) * offset,
      longitude: baseLng + Math.cos(angle) * offset,
      photo_url: null,
      open_now: Math.random() > 0.3,
      distance_miles: Math.round(distance * 10) / 10,
      within_radius: i < 6,
    };
  });
}