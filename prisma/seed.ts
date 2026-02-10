import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env["DATABASE_URL"],
})
const prisma = new PrismaClient({adapter});

const utc = (iso: string) => new Date(iso); // ISO with Z
const asDateOnlyUTC = (isoDate: string) => new Date(`${isoDate}T00:00:00.000Z`);

type SurfaceType = "Hard" | "Clay" | "Grass" | "Artificial";

type CourtSeed = { surface: SurfaceType; indoor: boolean };

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
        mobileNumber: string; // String in schema ✅
        address: { streetName: string; streetNumber: number; postCode: string };
    };
};

async function main() {
    // ---------------------------
    // 0) Clear existing data
    // ---------------------------
    await prisma.$transaction([
        prisma.booking.deleteMany(),
        prisma.court.deleteMany(),
        prisma.person.deleteMany(),
        prisma.contact.deleteMany(),
        prisma.club.deleteMany(),
        prisma.surface.deleteMany(),
        prisma.address.deleteMany(),
    ]);

    // ---------------------------
    // 1) Seed Surfaces
    // ---------------------------
    const surfaceTypes: SurfaceType[] = ["Hard", "Clay", "Grass", "Artificial"];

    await prisma.surface.createMany({
        data: surfaceTypes.map((type) => ({ type })),
        skipDuplicates: true,
    });

    const surfaces = await prisma.surface.findMany();
    const surfaceIdByType = new Map(surfaces.map((s) => [s.type.trim(), s.id])); // trim for CHAR padding

    const getSurfaceId = (type: SurfaceType): number => {
        const id = surfaceIdByType.get(type);
        if (!id) throw new Error(`Missing Surface row for type="${type}"`);
        return id;
    };

    // ---------------------------
    // 2) Seed Clubs + Addresses + Courts
    // ---------------------------
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
            include: { Court: true },
        });

        // Ensure courts align with seed by recreating them for this club
        await prisma.court.deleteMany({ where: { clubId: upsertedClub.id } });

        await prisma.court.createMany({
            data: club.courts.map((c) => ({
                clubId: upsertedClub.id,
                indoor: c.indoor,
                surfaceId: getSurfaceId(c.surface),
            })),
        });
    }

    // ---------------------------
    // 3) Seed Contacts + People
    // ---------------------------
    const peopleToSeed: PersonSeed[] = [
        {
            firstName: "Angelo",
            lastName: "Talay",
            contact: {
                emailAddress: "angelo.talay@example.com",
                mobileNumber: "07700900101",
                address: { streetName: "Broad Street", streetNumber: 200, postCode: "B15 1AY" },
            },
        },
        {
            firstName: "Sam",
            lastName: "Khan",
            contact: {
                emailAddress: "sam.khan@example.com",
                mobileNumber: "07700900102",
                address: { streetName: "Corporation Street", streetNumber: 15, postCode: "B4 6TB" },
            },
        },
        {
            firstName: "Maya",
            lastName: "Patel",
            contact: {
                emailAddress: "maya.patel@example.com",
                mobileNumber: "07700900103",
                address: { streetName: "Dudley Road", streetNumber: 51, postCode: "B18 7QH" },
            },
        },
        {
            firstName: "Jordan",
            lastName: "Smith",
            contact: {
                emailAddress: "jordan.smith@example.com",
                mobileNumber: "07700900104",
                address: { streetName: "New Street", streetNumber: 9, postCode: "B2 4QA" },
            },
        },
        {
            firstName: "Aisha",
            lastName: "Brown",
            contact: {
                emailAddress: "aisha.brown@example.com",
                mobileNumber: "07700900105",
                address: { streetName: "Hagley Road", streetNumber: 120, postCode: "B16 8PE" },
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
    // 4) Seed Bookings
    // ---------------------------
    const courts = await prisma.court.findMany({ orderBy: { id: "asc" } });
    if (courts.length < 3) throw new Error(`Expected >= 3 courts, got ${courts.length}`);

    const people = await prisma.person.findMany({ orderBy: { id: "asc" } });
    if (people.length < 5) throw new Error(`Expected >= 5 people, got ${people.length}`);

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
    // 5) Summary
    // ---------------------------
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
        console.error("Seed failed");
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });