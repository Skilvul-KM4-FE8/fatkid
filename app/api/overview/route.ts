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
        const transactions = await prisma.transaction.findMany({
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

        let food: { name: string; quantity: number }[] = [];
        let drink: { name: string; quantity: number }[] = [];

        transactions.forEach((transaction) => {
            const foodItems = transaction.items.filter(
                (item) => item.category === "Food"
            );
            const drinkItems = transaction.items.filter(
                (item) => item.category === "Drink"
            );

            // Aggregate food items
            foodItems.forEach((item) => {
                const index = food.findIndex((foodItem) => foodItem.name === item.name);
                if (index === -1) {
                    food.push({ name: item.name ?? "Unknown", quantity: item.quantity });
                } else {
                    food[index].quantity += item.quantity;
                }
            });

            // Aggregate drink items
            drinkItems.forEach((item) => {
                const index = drink.findIndex((drinkItem) => drinkItem.name === item.name);
                if (index === -1) {
                    drink.push({ name: item.name ?? "Unknown", quantity: item.quantity });
                } else {
                    drink[index].quantity += item.quantity;
                }
            });
        });

        const data = transactions.map((transaction) => {
            const totalSoldFood = transaction.items
                .filter((item) => item.category === "Food")
                .reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

            const totalSoldDrink = transaction.items
                .filter((item) => item.category === "Drink")
                .reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

            return {
                ...transaction,
                totalSoldFood,
                totalSoldDrink,
            };
        });

        return NextResponse.json({data, food, drink}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Failed to fetch data"})
    }
}