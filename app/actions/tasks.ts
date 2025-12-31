"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "./auth";
import { tasks } from "@prisma/client";

export async function createTask(formData: FormData) {
  const user = await getSessionUser();
  const userId = user?.id;
  console.log(user);
  if (!userId) return { error: "Authentication required" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string; // 'low', 'medium', 'high'
  const dueDateString = formData.get("due_date") as string;
  const due_date = dueDateString ? new Date(dueDateString) : null;

  try {
    const task = await db.tasks.create({
      data: {
        title,
        description,
        priority,
        due_date,
        created_by: userId,

        usertasks: {
          create: {
            user_id: userId,
            role: "OWNER",
          },
        },
      },
    });

    return { message: "Task Created Successfully", taskId: task.id };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create task. Check if database fields match." };
  }
}

export async function getUserTasks(sortBy: string = "created_at") {
  const user = await getSessionUser();
  const userId = user?.id;

  if (!userId) {
    return { error: "Authentication required" };
  }

  // Determine sort direction
  const order = ["due_date", "status", "priority"].includes(sortBy)
    ? "desc"
    : "asc";

  const tasks = await db.tasks.findMany({
    where: {
      usertasks: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      // teams: true,
      usertasks: true,
    },
    orderBy: {
      [sortBy]: order,
    },
  });

  if (!tasks || tasks.length === 0) return { error: "No tasks found" };

  return tasks;
}

export async function updateUserTask(task_id: string, task: tasks) {
  const user = await getSessionUser();

  if (!user || !user.id) {
    return { error: "User not authenticated" };
  }

  try {
    const updatedTask = await db.tasks.update({
      where: {
        id: parseInt(task_id),
      },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
      },
    });

    return updatedTask;
  } catch (error) {
    console.error("Failed to update task:", error);
    return { error: "Failed to update task in database" };
  }
}
