import { ObjectId } from "mongodb";
import { getDB } from "../config/database.js";

export const getNotesCollection = async () => {
  const db = getDB();
  const collection = db.collection("notes");

  // Create indexes
  await collection.createIndex({ foodId: 1 });

  return collection;
};

export const createNote = async (noteData) => {
  const collection = await getNotesCollection();
  const doc = {
    ...noteData,
    postedDate: new Date().toISOString(),
  };
  const result = await collection.insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

export const getNotesByFoodId = async (foodId) => {
  const collection = await getNotesCollection();
  if (!ObjectId.isValid(foodId)) {
    return [];
  }
  return await collection
    .find({ foodId: foodId })
    .sort({ postedDate: -1 })
    .toArray();
};

export const getAllNotes = async () => {
  const collection = await getNotesCollection();
  return await collection.find({}).sort({ postedDate: -1 }).toArray();
};
