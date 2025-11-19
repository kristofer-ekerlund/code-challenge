'use server';
import { NextRequest, NextResponse } from "next/server";

// For server-side API routes, use a regular env var (not NEXT_PUBLIC_)
const BACKEND_URL = process.env.BACKEND_API_URL || "http://backend:3000";
// if you for some reason don't want to public expose the backend api, you can use a proxy to the backend api
// Another way would be to use redux toolkit query (RTK), but lets keep it simple for now.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "50";
    const sortBy = searchParams.get("sortBy") ?? "name";
    const sortOrder = searchParams.get("sortOrder") ?? "asc";

    // Proxy request to backend (page-based endpoint with v1 API)
    const backendUrl = `${BACKEND_URL}/api/v1/products/paged?page=${page}&limit=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying to backend:", error);
    return NextResponse.json(
      { error: "Failed to fetch products from backend" },
      { status: 500 }
    );
  }
}
