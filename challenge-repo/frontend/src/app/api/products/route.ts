export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    
    const response = await fetch(
      `${process.env.BACKEND_URL}/products?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    return Response.json(data)
  } catch (error) {
    console.error('Error fetching products from backend:', error)
    // Fallback to empty products if backend is unavailable
    return Response.json({ 
      products: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    })
  }
} 