import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const headers = req.headers;
	const secret = headers?.get("x-internal-api-secret");

	if (secret !== process.env.NEXT_PUBLIC_INTERNAL_API_SECRET) {
		return NextResponse.json(
			{ message: "Forbidden!!!!!!" },
			{ status: 403 }
		);
	}
	return NextResponse.json({ message: "Hello, world!" });
}
