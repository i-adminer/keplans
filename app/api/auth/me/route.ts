import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
