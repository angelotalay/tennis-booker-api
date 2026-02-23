import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env["DATABASE_URL"],
});
const prisma = new PrismaClient({ adapter });

const utc = (iso: string) => new Date(iso);
const asDateOnlyUTC = (isoDate: string) => new Date(`${isoDate}T00:00:00.000Z`);

type SurfaceType = "HARD" | "CLAY" | "GRASS" | "CARPET";

type CourtSeed = { surface: SurfaceType; indoor: boolean };

type ClubSeed = {
  name: string;
  address: { streetName: string; streetNumber: string; postCode: string };
  courts: CourtSeed[];
};

type UserSeed = {
  firstName: string;
  lastName: string;
  contact: {
    emailAddress: string;
    mobileNumber: string;
    address: { streetName: string; streetNumber: string; postCode: string };
  };
};

async function main() {
  // ---------------------------
  // 0) Clear existing data
  // ---------------------------
  await prisma.$transaction([
    prisma.booking.deleteMany(),
    prisma.user.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.court.deleteMany(),
    prisma.club.deleteMany(),
    prisma.address.deleteMany(),
  ]);

  // ---------------------------
  // 1) Seed Clubs + Addresses + Courts
  // ---------------------------
  const clubsToSeed: ClubSeed[] = [
    {
      name: "Birmingham Central Tennis",
      address: {
        streetName: "High Street",
        streetNumber: "12",
        postCode: "B1 1AA",
      },
      courts: [
        { surface: "HARD", indoor: false },
        { surface: "HARD", indoor: false },
        { surface: "CARPET", indoor: true },
      ],
    },
    {
      name: "Wolverhampton Park Courts",
      address: {
        streetName: "Park Road",
        streetNumber: "88",
        postCode: "WV1 4AB",
      },
      courts: [
        { surface: "CLAY", indoor: false },
        { surface: "CLAY", indoor: false },
        { surface: "GRASS", indoor: false },
      ],
    },
    {
      name: "Solihull Indoor Tennis Centre",
      address: {
        streetName: "Station Lane",
        streetNumber: "4",
        postCode: "B91 2AA",
      },
      courts: [
        { surface: "HARD", indoor: true },
        { surface: "HARD", indoor: true },
        { surface: "CARPET", indoor: true },
        { surface: "CARPET", indoor: true },
      ],
    },
  ];

  for (const club of clubsToSeed) {
    const upsertedClub = await prisma.club.upsert({
      where: { name: club.name },
      create: {
        name: club.name,
        address: { create: club.address },
      },
      update: {
        address: { update: club.address },
      },
      include: { courts: true, address: true },
    });

    await prisma.court.deleteMany({
      where: { clubId: upsertedClub.id },
    });

    await prisma.court.createMany({
      data: club.courts.map((c, idx) => ({
        name: `Court ${idx + 1}`,
        clubId: upsertedClub.id,
        indoor: c.indoor,
        surface: c.surface,
      })),
    });
  }

  // ---------------------------
  // 2) Seed Contacts + Users
  // ---------------------------
  const usersToSeed: UserSeed[] = [
    {
      firstName: "Angelo",
      lastName: "Talay",
      contact: {
        emailAddress: "angelo.talay@example.com",
        mobileNumber: "07700900101",
        address: {
          streetName: "Broad Street",
          streetNumber: "200",
          postCode: "B15 1AY",
        },
      },
    },
    {
      firstName: "Sam",
      lastName: "Khan",
      contact: {
        emailAddress: "sam.khan@example.com",
        mobileNumber: "07700900102",
        address: {
          streetName: "Corporation Street",
          streetNumber: "15",
          postCode: "B4 6TB",
        },
      },
    },
    {
      firstName: "Maya",
      lastName: "Patel",
      contact: {
        emailAddress: "maya.patel@example.com",
        mobileNumber: "07700900103",
        address: {
          streetName: "Dudley Road",
          streetNumber: "51",
          postCode: "B18 7QH",
        },
      },
    },
    {
      firstName: "Jordan",
      lastName: "Smith",
      contact: {
        emailAddress: "jordan.smith@example.com",
        mobileNumber: "07700900104",
        address: {
          streetName: "New Street",
          streetNumber: "9",
          postCode: "B2 4QA",
        },
      },
    },
    {
      firstName: "Aisha",
      lastName: "Brown",
      contact: {
        emailAddress: "aisha.brown@example.com",
        mobileNumber: "07700900105",
        address: {
          streetName: "Hagley Road",
          streetNumber: "120",
          postCode: "B16 8PE",
        },
      },
    },
  ];

  for (const u of usersToSeed) {
    const contact = await prisma.contact.upsert({
      where: { emailAddress: u.contact.emailAddress },
      create: {
        emailAddress: u.contact.emailAddress,
        mobileNumber: u.contact.mobileNumber,
        address: { create: u.contact.address },
      },
      update: {
        mobileNumber: u.contact.mobileNumber,
        address: { update: u.contact.address },
      },
      include: { address: true },
    });

    await prisma.user.upsert({
      where: { contactId: contact.id },
      create: {
        firstName: u.firstName,
        lastName: u.lastName,
        contactId: contact.id,
      },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
      },
    });
  }

  // ---------------------------
  // 3) Seed Bookings
  // ---------------------------
  const courts = await prisma.court.findMany({
    orderBy: { id: "asc" },
  });

  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
  });

  if (courts.length < 3)
    throw new Error(`Expected >= 3 courts, got ${courts.length}`);

  if (users.length < 5)
    throw new Error(`Expected >= 5 users, got ${users.length}`);

  const [courtA, courtB, courtC] = courts;
  const [u1, u2, u3, u4, u5] = users;

  const bookingsToSeed = [
    {
      courtId: courtA.id,
      userId: u1.id,
      date: asDateOnlyUTC("2026-02-10"),
      startTime: utc("2026-02-10T18:00:00.000Z"),
      endTime: utc("2026-02-10T19:00:00.000Z"),
    },
    {
      courtId: courtA.id,
      userId: u2.id,
      date: asDateOnlyUTC("2026-02-10"),
      startTime: utc("2026-02-10T19:00:00.000Z"),
      endTime: utc("2026-02-10T20:00:00.000Z"),
    },
    {
      courtId: courtB.id,
      userId: u3.id,
      date: asDateOnlyUTC("2026-02-10"),
      startTime: utc("2026-02-10T17:30:00.000Z"),
      endTime: utc("2026-02-10T18:30:00.000Z"),
    },
    {
      courtId: courtC.id,
      userId: u4.id,
      date: asDateOnlyUTC("2026-02-11"),
      startTime: utc("2026-02-11T07:00:00.000Z"),
      endTime: utc("2026-02-11T08:00:00.000Z"),
    },
    {
      courtId: courtC.id,
      userId: u5.id,
      date: asDateOnlyUTC("2026-02-11"),
      startTime: utc("2026-02-11T18:00:00.000Z"),
      endTime: utc("2026-02-11T19:30:00.000Z"),
    },
  ];

  await prisma.booking.createMany({ data: bookingsToSeed });

  // ---------------------------
  // 4) Summary
  // ---------------------------
  const [
    addressCount,
    clubCount,
    courtCount,
    contactCount,
    userCount,
    bookingCount,
  ] = await prisma.$transaction([
    prisma.address.count(),
    prisma.club.count(),
    prisma.court.count(),
    prisma.contact.count(),
    prisma.user.count(),
    prisma.booking.count(),
  ]);

  console.log("Seed complete ✅");
  console.log({
    addresses: addressCount,
    clubs: clubCount,
    courts: courtCount,
    contacts: contactCount,
    users: userCount,
    bookings: bookingCount,
  });
}

main()
  .catch((e) => {
    console.error("Seed failed");
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
