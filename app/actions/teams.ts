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

export async function deleteTeam(teamId: number) {
  const user = await getSessionUser();
  const userId = user?.id;

  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    // Start database transaction for data consistency
    const result = await db.$transaction(async (tx) => {
      // First verify the user has permission to delete this team
      const userTeam = await tx.userteams.findFirst({
        where: {
          user_id: userId,
          team_id: teamId,
        },
      });

      if (!userTeam) {
        throw new Error("You don't have permission to delete this team");
      }

      // Only allow OWNER or ADMIN to delete teams
      if (userTeam.role !== "OWNER" && userTeam.role !== "ADMIN") {
        throw new Error("Only team owners and admins can delete teams");
      }

      // Delete user-team relationships first (cascade delete)
      await tx.userteams.deleteMany({
        where: {
          team_id: teamId,
        },
      });

      // Delete the team (tasks should be handled according to business logic)
      // For now, we'll delete the team - tasks will be orphaned or need separate handling
      const deletedTeam = await tx.teams.delete({
        where: {
          id: teamId,
        },
      });

      return deletedTeam;
    });

    return {
      success: true,
      message: "Team deleted successfully",
      team: result,
    };
  } catch (error) {
    console.error("Error deleting team:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete team. Please try again.",
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
