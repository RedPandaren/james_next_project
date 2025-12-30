"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "./auth";
import { tasks } from "@prisma/client";

export async function createTask(formData: FormData) {
  const user = await getSessionUser();

  const userId = user?.id;
  const teamId = user?.team_id;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  console.log(formData.get("priority"));
  const assigned_to = formData.get("assigned_to") as string;
  const priority = formData.get("priority") === "true";
  const dueDateString = formData.get("due_date") as string;
  const due_date = dueDateString ? new Date(dueDateString) : null;

  const task = await db.tasks.create({
    data: {
      title,
      description,
      assigned_to: userId,
      team_id: null,
      due_date,
      priority,
    },
  });

  if (!task) {
    return { error: "Invalid Task Creation" };
  }

  return {
    message: "Task Created Succesfully",
  };
}

export async function getUserTask(sortBy: string | "created_at") {
  const user = await getSessionUser();

  const userId = user?.id;

  if (!userId) {
    return { error: "Authentication required" };
  }

  const order =
    sortBy === "due_date" || sortBy === "status" || sortBy === "priority"
      ? "desc"
      : "asc";

  const tasks = await db.tasks.findMany({
    where: {
      assigned_to: userId,
    },
    orderBy: {
      [sortBy]: order,
    },
  });

  console.log(userId);

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
        id: task_id,
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
