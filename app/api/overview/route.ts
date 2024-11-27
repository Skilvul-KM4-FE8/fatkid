import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
    const auth = getAuth(req as NextRequest)
    if (!auth?.userId) {
        return new Response(JSON.stringify({message: "Unauthorized!"}), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    try {
        const data = await prisma.transaction.findMany({
            where: {
                userId: auth.userId,
            }, 
            include: {
                items: {}
            }
        })
        return NextResponse.json(data, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Failed to fetch data"})
    }
}