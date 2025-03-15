import { db } from "@/lib/prisma-client";

type ParamsType = {
  params: Promise<{ user_id: string }>;
};

export const GET = async (req: Request, { params }: ParamsType) => {
  try {
    const user_id = (await params).user_id;

    const user_sub = await db.subscription.findFirst({
      where: {
        order: {
          userId: user_id,
        },
        status: { in: ["active", "completed"] },
      },
      include: { order: true }
    });

    if(!user_sub) {
        return Response.json({ error: "user plan not found" }, { status: 400 });
    }

    return Response.json({ data: user_sub.order.name }, { status: 200 });
  } catch (error) {
    console.log({ error });
    return Response.json({ error: "error" }, { status: 500 });
  }
};
