import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { getDB } from "../config/database.js";

export const getUsersCollection = async () => {
  const db = getDB();
  const collection = db.collection("users");

  // Create indexes
  try {
    await collection.createIndex({ email: 1 }, { unique: true });
  } catch (error) {
    console.log("Index creation note:", error.message);
  }

  return collection;
};

export const createUser = async (userData) => {
  const collection = await getUsersCollection();

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const doc = {
    email: userData.email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(doc);
  return { _id: result.insertedId, email: doc.email, createdAt: doc.createdAt };
};

export const findUserByEmail = async (email) => {
  const collection = await getUsersCollection();
  return await collection.findOne({ email });
};

export const findUserById = async (id) => {
  const collection = await getUsersCollection();
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return await collection.findOne({ _id: new ObjectId(id) });
};

export const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};