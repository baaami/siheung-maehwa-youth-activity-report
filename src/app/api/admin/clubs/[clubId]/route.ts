import { NextResponse } from "next/server";
import { RepositoryConflictError, deleteClub, updateClub } from "@/lib/repository";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ clubId: string }> },
) {
  try {
    const { clubId } = await params;
    const body = (await request.json()) as {
      name?: string;
      category?: string;
      description?: string;
      expectedUpdatedAt?: string;
    };

    const club = await updateClub(
      clubId,
      {
        name: body.name ?? "",
        category: body.category ?? "",
        description: body.description ?? "",
      },
      body.expectedUpdatedAt,
    );

    if (!club) {
      return NextResponse.json({ message: "동아리를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({
      redirectUrl: `/admin/clubs/${club.id}`,
    });
  } catch (error) {
    const status = error instanceof RepositoryConflictError ? 409 : 400;
    const message = error instanceof Error ? error.message : "동아리를 수정하지 못했습니다.";
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ clubId: string }> },
) {
  const { clubId } = await params;
  await deleteClub(clubId);

  return NextResponse.json({
    redirectUrl: "/admin",
  });
}
