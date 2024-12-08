import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { parseISO, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)

    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const filterFrom = !from ? subDays(new Date(), 30) : parseISO(from)
    const filterTo = !to ? new Date() : parseISO(to)

    const auth = getAuth(req as NextRequest)
    if (!auth?.userId) {
        return new Response(JSON.stringify({message: "Unauthorized!"}), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    console.log("from:", from)
    console.log("to:", to)
    console.log("filterFrom:", filterFrom)
    console.log("filterTo:", filterTo)

    try {
        const data = await prisma.transaction.findMany({
            where: {
                userId: auth.userId,
                createdAt: {
                    gte: filterFrom,
                    lte: filterTo
                }
            }, 
            include: {
                items: {}
            }
        })

        const food = await prisma.transaction.findMany({
            where: {
                userId: auth.userId,
                createdAt: {
                    gte: filterFrom,
                    lte: filterTo
                },
                items: {
                    some: {
                        category: "Food"
                    }
                }
            },
            include: {
                items: { }
            }
        })

        const drink = await prisma.transaction.findMany({
            where: {
                userId: auth.userId,
                createdAt: {
                    gte: filterFrom,
                    lte: filterTo
                },
                items: {
                    some: {
                        category: "Drink"
                    }
                }
            },
            include: {
                items: { }
            }
        })

        return NextResponse.json({data, food, drink}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Failed to fetch data"})
    }
}