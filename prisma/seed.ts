import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env["DATABASE_URL"],
});
const prisma = new PrismaClient({ adapter });

const utc = (iso: string) => new Date(iso); // ISO with Z
const asDateOnlyUTC = (isoDate: string) => new Date(`${isoDate}T00:00:00.000Z`);

type SurfaceType = "HARD" | "CLAY" | "GRASS" | "CARPET";

type CourtSeed = { surface: SurfaceType; indoor: boolean };

type ClubSeed = {
  name: string;
  address: { streetName: string; streetNumber: string; postCode: string };
  courts: CourtSeed[];
};

type PersonSeed = {
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
  // 0) Clear existing data (order matters because of FKs)
  // ---------------------------
  await prisma.$transaction([
    prisma.booking.deleteMany(),
    prisma.person.deleteMany(),
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
        // addressId is unique so this updates the same Address row (good)
        address: { update: club.address },
      },
      include: { courts: true, address: true },
    });

    // Ensure courts align with seed by recreating them for this club
    await prisma.court.deleteMany({ where: { clubId: upsertedClub.id } });

    await prisma.court.createMany({
      data: club.courts.map((c, idx) => ({
        // NOTE: @db.Char(30) will be padded by Postgres; that's expected with CHAR.
        // If you want to avoid padding, change to @db.VarChar(30).
        name: `Court ${idx + 1}`,
        clubId: upsertedClub.id,
        indoor: c.indoor,
        surface: c.surface,
      })),
    });
  }

  // ---------------------------
  // 2) Seed Contacts + People
  // ---------------------------
  const peopleToSeed: PersonSeed[] = [
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

  for (const p of peopleToSeed) {
    const contact = await prisma.contact.upsert({
      where: { emailAddress: p.contact.emailAddress },
      create: {
        emailAddress: p.contact.emailAddress,
        mobileNumber: p.contact.mobileNumber,
        address: { create: p.contact.address },
      },
      update: {
        mobileNumber: p.contact.mobileNumber,
        address: { update: p.contact.address },
      },
      include: { address: true },
    });

    await prisma.person.upsert({
      where: { contactId: contact.id },
      create: {
        firstName: p.firstName,
        lastName: p.lastName,
        contactId: contact.id,
      },
      update: {
        firstName: p.firstName,
        lastName: p.lastName,
      },
    });
  }

  // ---------------------------
  // 3) Seed Bookings
  // ---------------------------
  const courts = await prisma.court.findMany({ orderBy: { id: "asc" } });
  if (courts.length < 3)
    throw new Error(`Expected >= 3 courts, got ${courts.length}`);

  const people = await prisma.person.findMany({ orderBy: { id: "asc" } });
  if (people.length < 5)
    throw new Error(`Expected >= 5 people, got ${people.length}`);

  const [courtA, courtB, courtC] = courts;
  const [p1, p2, p3, p4, p5] = people;

  const bookingsToSeed = [
    {
      courtId: courtA.id,
      personId: p1.id,
      date: asDateOnlyUTC("2026-02-10"),
      startTime: utc("2026-02-10T18:00:00.000Z"),
      endTime: utc("2026-02-10T19:00:00.000Z"),
    },
    {
      courtId: courtA.id,
      personId: p2.id,
      date: asDateOnlyUTC("2026-02-10"),
      startTime: utc("2026-02-10T19:00:00.000Z"),
      endTime: utc("2026-02-10T20:00:00.000Z"),
    },
    {
      courtId: courtB.id,
      personId: p3.id,
      date: asDateOnlyUTC("2026-02-10"),
      startTime: utc("2026-02-10T17:30:00.000Z"),
      endTime: utc("2026-02-10T18:30:00.000Z"),
    },
    {
      courtId: courtC.id,
      personId: p4.id,
      date: asDateOnlyUTC("2026-02-11"),
      startTime: utc("2026-02-11T07:00:00.000Z"),
      endTime: utc("2026-02-11T08:00:00.000Z"),
    },
    {
      courtId: courtC.id,
      personId: p5.id,
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
    personCount,
    bookingCount,
  ] = await prisma.$transaction([
    prisma.address.count(),
    prisma.club.count(),
    prisma.court.count(),
    prisma.contact.count(),
    prisma.person.count(),
    prisma.booking.count(),
  ]);

  console.log("Seed complete ✅");
  console.log({
    addresses: addressCount,
    clubs: clubCount,
    courts: courtCount,
    contacts: contactCount,
    people: personCount,
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
