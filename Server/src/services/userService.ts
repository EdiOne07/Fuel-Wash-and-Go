import prisma from '../config/db';

type User = ReturnType<typeof prisma.user.create> extends Promise<infer T> ? T : never;

export const createUser = async (
  firebaseUid: string,
  email: string,
  username: string,
  location: string
): Promise<User> => {
  return prisma.user.create({
    data: {
      firebaseUid,
      email,
      username,
      location,
    },
  });
};

export const getUserByFirebaseUid = async (firebaseUid: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { firebaseUid },
  });
};