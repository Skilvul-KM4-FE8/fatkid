import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { parseISO, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const filterFrom = !from ? subDays(new Date(), 30) : parseISO(from);
  const filterTo = !to ? new Date() : parseISO(to);

  const auth = getAuth(req as NextRequest);
  if (!auth?.userId) {
    return new Response(JSON.stringify({ message: "Unauthorized!" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: auth.userId,
        createdAt: {
          gte: filterFrom,
          lte: filterTo,
        },
      },
      include: {
        items: true,
      },
    });

    const food: { name: string; quantity: number }[] = [];
    const drink: { name: string; quantity: number }[] = [];
    const allitems: { name: string; quantity: number }[] = [];

    // Helper function to aggregate items
    const aggregateItems = (targetArray: { name: string; quantity: number }[], items: (typeof transactions)[0]["items"]) => {
      items.forEach((item) => {
        const index = targetArray.findIndex((existing) => existing.name === item.name);
        if (index === -1) {
          targetArray.push({ name: item.name ?? "Unknown", quantity: item.quantity });
        } else {
          targetArray[index].quantity += item.quantity;
        }
      });
    };

    // Process transactions
    transactions.forEach((transaction) => {
      const foodItems = transaction.items.filter((item) => item.category === "Food");
      const drinkItems = transaction.items.filter((item) => item.category === "Drink");

      aggregateItems(food, foodItems);
      aggregateItems(drink, drinkItems);
      aggregateItems(allitems, transaction.items); // Include all items
    });

    const data = transactions.map((transaction) => {
      const totalSoldFood = transaction.items.filter((item) => item.category === "Food").reduce((sum, item) => sum + (item.price ?? 0), 0);

      const totalSoldDrink = transaction.items.filter((item) => item.category === "Drink").reduce((sum, item) => sum + (item.price ?? 0), 0);

      return {
        ...transaction,
        totalSoldFood,
        totalSoldDrink,
      };
    });

    return NextResponse.json({ data, food, drink, allitems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
