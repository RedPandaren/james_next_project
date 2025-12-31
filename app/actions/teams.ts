"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "./auth";

export async function createTeam(teamName: string) {
  const user = await getSessionUser();

  const userId = user?.id;

  const task = await db.teams.create({
    data: {
      name: teamName,
    },
  });

  if (!task) {
    return { error: "Invalid Team Creation" };
  }

  return {
    message: "Team Created Succesfully",
  };
}

export async function getTeam() {
  const user = await getSessionUser();

  const userId = user?.id;

  const task = await db.teams.findMany({
    where: {
      userteams: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      // teams: true,
      userteams: true,
    },
  });

  if (!task) {
    return { error: "No Teams Found" };
  }

  return task;
}
