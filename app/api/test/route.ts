import { prisma } from "@/app/lib/prisma";
import { verifyTelegramInitData } from "@/app/lib/telegramAuth";

// получить задачи
export async function GET() {
    const tasks = await prisma.task.findMany({
        orderBy: { id: "desc" },
    });

    return Response.json(tasks);
}

// создать задачу
// export async function POST(req: Request) {
//     const { title, time, userId } = await req.json();
//
//     const task = await prisma.task.create({
//         data: {
//             title,
//             time,
//             userId,
//             done: false,
//         },
//     });
//
//     return Response.json(task);
// }

export async function POST(req: Request) {
    const body = await req.json();

    const initData = body.initData;

    const isValid = verifyTelegramInitData(
        initData,
        process.env.TELEGRAM_BOT_TOKEN!
    );

    if (!isValid) {
        return Response.json({ ok: false }, { status: 401 });
    }

    const urlParams = new URLSearchParams(initData);
    const user = JSON.parse(urlParams.get("user") || "{}");

    return Response.json({
        ok: true,
        userId: user.id,
        username: user.username,
    });
}