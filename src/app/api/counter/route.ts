import { NextResponse } from "next/server";

// In a real application, you would use a database
let count = 0;

export async function GET() {
  return NextResponse.json({ count });
}

export async function POST(request: Request) {
  const { count: newCount } = await request.json();
  count = newCount;
  return NextResponse.json({ count });
}
