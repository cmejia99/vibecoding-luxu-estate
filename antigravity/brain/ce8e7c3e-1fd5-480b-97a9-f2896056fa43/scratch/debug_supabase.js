const supabaseUrl = 'https://cpdfgqempyjagwnxivpb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZGZncWVtcHlqYWd3bnhpdnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNzIwMjYsImV4cCI6MjA5Mzg0ODAyNn0.MlftxPsp-6Y00TrOP56a_TntGSOWbnWAhzRekw6cqPY'

async function debug() {
  console.log('Fetching profiles via fetch...')
  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*`, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  })
  
  const data = await response.json()
  if (!response.ok) {
    console.error('Error fetching profiles:', JSON.stringify(data, null, 2))
  } else {
    console.log('Profiles fetched successfully:', data.length)
  }
}

debug()
