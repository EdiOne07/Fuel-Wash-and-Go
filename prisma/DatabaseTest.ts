// // index.ts

// import { PrismaClient, Status } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // Create a new gas station record
//   const newStation = await prisma.gasStations.create({
//     data: {
//       name: "Station One",
//       status: Status.AverageBusy,
//       gas_price: 12,
//       location_id:14,
//       rating:5,
//       washing_station_available:true
//     },
//   });
//   console.log(newStation);
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(() => prisma.$disconnect());
