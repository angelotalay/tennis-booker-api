import {PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'


const adapter = new PrismaPg({connectionString: process.env["DATABASE_URL"]});
const prisma = new PrismaClient({adapter});

const utc = (iso: string) => new Date(iso); // expects ISO string with timezone (e.g. Z)
const asDateOnlyUTC = (isoDate: string) => new Date(`${isoDate}T00:00:00.000Z`);


type CourtSeed = { surface: "Hard" | "Clay" | "Grass" | "Artificial"; indoor: boolean };

type ClubSeed = {
  name: string;
  address: { streetName: string; streetNumber: number; postCode: string };
  courts: CourtSeed[];
};

type PersonSeed = {
  firstName: string;
  lastName: string;
  contact: {
    emailAddress: string;
    mobileNumber: string;
    address: { streetName: string; streetNumber: number; postCode: string };
  };
};

async function main() {
  // Clear the existing data
  await prisma.$transaction([
    prisma.booking.deleteMany(),
    prisma.court.deleteMany(),
    prisma.person.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.club.deleteMany(),
    prisma.surface.deleteMany(),
    prisma.address.deleteMany(),
  ]);

  const surfaceNames = ["Hard", "Clay", "Grass", "Artificial"] as const;

  await prisma.surface.createMany({
    data: surfaceNames.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const surfaces = await prisma.surface.findMany();
  const surfaceIdByName = new Map(surfaces.map((s) => [s.name, s.id]));

  const getSurfaceId = (name: CourtSeed["surface"]): number => {
    const id = surfaceIdByName.get(name);
    if (!id) throw new Error(`Missing Surface row for name="${name}"`);
    return id;
  };

  // Clubs
  const clubsToSeed: ClubSeed[] = [
    {
      name: "Birmingham Central Tennis",
      address: { streetName: "High Street", streetNumber: 12, postCode: "B1 1AA" },
      courts: [
        { surface: "Hard", indoor: false },
        { surface: "Hard", indoor: false },
        { surface: "Artificial", indoor: true },
      ],
    },
    {
      name: "Wolverhampton Park Courts",
      address: { streetName: "Park Road", streetNumber: 88, postCode: "WV1 4AB" },
      courts: [
        { surface: "Clay", indoor: false },
        { surface: "Clay", indoor: false },
        { surface: "Grass", indoor: false },
      ],
    },
    {
      name: "Solihull Indoor Tennis Centre",
      address: { streetName: "Station Lane", streetNumber: 4, postCode: "B91 2AA" },
      courts: [
        { surface: "Hard", indoor: true },
        { surface: "Hard", indoor: true },
        { surface: "Artificial", indoor: true },
        { surface: "Artificial", indoor: true },
      ],
    },
  ];

  await prisma.$transaction(
    clubsToSeed.map((club) =>
      prisma.club.upsert({
        where: { name: club.name }, // name is @unique ✅
        update: {},
        create: {
          name: club.name,
          address: {
            create: club.address,
          },
          Court: {
            create: club.courts.map((c) => ({
              indoor: c.indoor,
              surfaceId: getSurfaceId(c.surface),
            })),
          },
        },
      })
    )
  );

  // Persons
  const peopleToSeed: PersonSeed[] = [
    {
      firstName: "Angelo",
      lastName: "Talay",
      contact: {
        emailAddress: "angelo.talay@example.com",
        mobileNumber: "447700900101",
        address: { streetName: "Broad Street", streetNumber: 200, postCode: "B15 1AY" },
      },
    },
    {
      firstName: "Sam",
      lastName: "Khan",
      contact: {
        emailAddress: "sam.khan@example.com",
        mobileNumber: "447700900102",
        address: { streetName: "Corporation Street", streetNumber: 15, postCode: "B4 6TB" },
      },
    },
    {
      firstName: "Maya",
      lastName: "Patel",
      contact: {
        emailAddress: "maya.patel@example.com",
        mobileNumber: "447700900103",
        address: { streetName: "Dudley Road", streetNumber: 51, postCode: "B18 7QH" },
      },
    },
    {
      firstName: "Jordan",
      lastName: "Smith",
      contact: {
        emailAddress: "jordan.smith@example.com",
        mobileNumber: "447700900104",
        address: { streetName: "New Street", streetNumber: 9, postCode: "B2 4QA" },
      },
    },
    {
      firstName: "Aisha",
      lastName: "Brown",
      contact: {
        emailAddress: "aisha.brown@example.com",
        mobileNumber: "447700900105",
        address: { streetName: "Hagley Road", streetNumber: 120, postCode: "B16 8PE" },
      },
    },
  ];

  await prisma.$transaction(
    peopleToSeed.map((p) =>
      prisma.person.create({
        data: {
          firstName: p.firstName,
          lastName: p.lastName,
          contact: {
            create: {
              emailAddress: p.contact.emailAddress,
              mobileNumber: p.contact.mobileNumber,
              address: { create: p.contact.address },
            },
          },
        },
      })
    )
  );

  // Bookings
  const clubs = await prisma.club.findMany({
    include: { Court: { orderBy: { id: "asc" } } },
    orderBy: { name: "asc" },
  });

  const courtsFlat = clubs.flatMap((c) => c.Court).sort((a, b) => a.id - b.id);
  if (courtsFlat.length < 3) throw new Error("Not enough courts to seed bookings.");

  const people = await prisma.person.findMany({ orderBy: { id: "asc" } });
  if (people.length < 5) throw new Error("Not enough people to seed bookings.");

  // Pick some deterministic courts/people
  const courtA = courtsFlat[0];
  const courtB = courtsFlat[1];
  const courtC = courtsFlat[2];

  const [p1, p2, p3, p4, p5] = people;

  const bookingsToSeed = [
    {
      courtId: courtA.id,
      personId: p1.id,
      date: asDateOnlyUTC("2026-02-03"),
      startTime: utc("2026-02-03T18:00:00.000Z"),
      endTime: utc("2026-02-03T19:00:00.000Z"),
    },
    {
      courtId: courtA.id,
      personId: p2.id,
      date: asDateOnlyUTC("2026-02-03"),
      startTime: utc("2026-02-03T19:00:00.000Z"),
      endTime: utc("2026-02-03T20:00:00.000Z"),
    },
    {
      courtId: courtB.id,
      personId: p3.id,
      date: asDateOnlyUTC("2026-02-03"),
      startTime: utc("2026-02-03T17:30:00.000Z"),
      endTime: utc("2026-02-03T18:30:00.000Z"),
    },
    {
      courtId: courtC.id,
      personId: p4.id,
      date: asDateOnlyUTC("2026-02-04"),
      startTime: utc("2026-02-04T07:00:00.000Z"),
      endTime: utc("2026-02-04T08:00:00.000Z"),
    },
    {
      courtId: courtC.id,
      personId: p5.id,
      date: asDateOnlyUTC("2026-02-04"),
      startTime: utc("2026-02-04T18:00:00.000Z"),
      endTime: utc("2026-02-04T19:30:00.000Z"),
    },
  ];

  await prisma.booking.createMany({ data: bookingsToSeed });

  // ---------------------------------------------------------------------------
  // 5) Summary
  // ---------------------------------------------------------------------------
  const [surfaceCount, addressCount, clubCount, courtCount, contactCount, personCount, bookingCount] =
    await prisma.$transaction([
      prisma.surface.count(),
      prisma.address.count(),
      prisma.club.count(),
      prisma.court.count(),
      prisma.contact.count(),
      prisma.person.count(),
      prisma.booking.count(),
    ]);

  console.log("Seed complete ✅");
  console.log({
    surfaces: surfaceCount,
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
    console.error("Seed failed ❌");
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });