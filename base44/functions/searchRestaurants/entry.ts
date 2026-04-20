const searchRestaurants = async ({ dish, latitude, longitude, radius_miles }) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch('/api/searchRestaurants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ dish, latitude, longitude, radius_miles })
  });

  if (!response.ok) throw new Error('Search failed');
  return response.json();
};