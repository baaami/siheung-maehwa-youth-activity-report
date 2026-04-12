import { NextResponse } from "next/server";
import { createClub } from "@/lib/repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      category?: string;
      description?: string;
    };

    const club = await createClub({
      name: body.name ?? "",
      category: body.category ?? "",
      description: body.description ?? "",
    });

    return NextResponse.json({
      redirectUrl: `/admin/clubs/${club.id}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "동아리를 저장하지 못했습니다.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
