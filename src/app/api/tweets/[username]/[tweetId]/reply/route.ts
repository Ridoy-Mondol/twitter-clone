import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma/client";
import { verifyJwtToken } from "@/utilities/auth";

export async function GET(request: NextRequest, { params: { tweetId } }: { params: { tweetId: string } }) {
    try {
        const replies = await prisma.reply.findMany({
            where: {
                parentId: tweetId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        photoUrl: true,
                    },
                },
                likedBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        description: true,
                        followers: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                photoUrl: true,
                            },
                        },
                        photoUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json({ success: true, replies });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}

export async function POST(request: NextRequest, { params: { tweetId } }: { params: { tweetId: string } }) {
    const { authorId, text, photoUrl } = await request.json();

    const token = request.cookies.get("token")?.value;
    const verifiedToken = token && (await verifyJwtToken(token));

    if (!verifiedToken)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    if (verifiedToken.id !== authorId)
        return NextResponse.json({ success: false, message: "You are not authorized to perform this action." });

    try {
        await prisma.reply.create({
            data: {
                text,
                photoUrl,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
                parent: {
                    connect: {
                        id: tweetId,
                    },
                },
            },
        });
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error });
    }
}