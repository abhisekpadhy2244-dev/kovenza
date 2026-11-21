import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

const schema = z.object({
  INITIAL_ADMIN_NAME: z
    .string()
    .trim()
    .min(2, "INITIAL_ADMIN_NAME is required"),
  INITIAL_ADMIN_EMAIL: z
    .string()
    .trim()
    .toLowerCase()
    .email("INITIAL_ADMIN_EMAIL must be a valid email"),
  INITIAL_ADMIN_PASSWORD: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[a-z]/, "Password needs a lowercase letter")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[0-9]/, "Password needs a number")
    .regex(/[^A-Za-z0-9]/, "Password needs a symbol"),
});

async function main() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    console.error("\nCannot create admin:");
    for (const issue of parsed.error.issues) {
      console.error(` - ${issue.path.join(".")}: ${issue.message}`);
    }
    console.error(
      "\nSet INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD, then retry.\n",
    );
    process.exit(1);
  }

  const { INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD } =
    parsed.data;

  const role = await prisma.role.findUnique({ where: { key: "SUPER_ADMIN" } });
  if (!role) {
    console.error('Roles are missing. Run "npm run db:seed" first.');
    process.exit(1);
  }

  const existingSuperAdmin = await prisma.user.findFirst({
    where: { roleId: role.id },
  });
  if (existingSuperAdmin) {
    console.error(
      "A Super Admin already exists. Aborting. Manage admins from the dashboard instead.",
    );
    process.exit(1);
  }

  const passwordHash = await hashPassword(INITIAL_ADMIN_PASSWORD);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: INITIAL_ADMIN_EMAIL,
        fullName: INITIAL_ADMIN_NAME,
        passwordHash,
        roleId: role.id,
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        mustChangePassword: true,
      },
    });
    await tx.activityLog.create({
      data: {
        actorId: user.id,
        action: "admin.bootstrap",
        entityType: "User",
        entityId: user.id,
        metadata: { note: "Initial Super Admin created via CLI" },
      },
    });
  });

  console.log(`\nSuper Admin created: ${INITIAL_ADMIN_EMAIL}`);
  console.log("You must change the password at first login.");
  console.log(
    "IMPORTANT: now remove INITIAL_ADMIN_PASSWORD from your environment / .env file.\n",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
