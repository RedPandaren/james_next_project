"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "./auth";

export async function createTeam(teamName: string) {
  const user = await getSessionUser();
  const userId = user?.id;

  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    // Start database transaction for data consistency
    const result = await db.$transaction(async (tx) => {
      // Create the team
      const team = await tx.teams.create({
        data: {
          name: teamName,
        },
      });

      // Create user-team relationship
      const userTeam = await tx.userteams.create({
        data: {
          user_id: userId,
          team_id: team.id,
          role: "OWNER", // Creator becomes team owner
        },
      });

      // Return the created team with relationship data
      return {
        ...team,
        userteams: [userTeam],
      };
    });

    return {
      success: true,
      message: "Team Created Successfully",
      team: result,
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return {
      error: "Failed to create team. Please try again.",
    };
  }
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
