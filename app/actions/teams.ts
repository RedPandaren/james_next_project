"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "./auth";

export async function createTeam(teamName: string) {
  const user = await getSessionUser();

  const userId = user?.id;

  const task = await db.teams.create({
    data: {
      team_name: teamName,
      owner_user_id: userId,
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
      owner_user_id: userId,
    },
  });

  if (!task) {
    return { error: "No Teams Found" };
  }

  return task;
}
