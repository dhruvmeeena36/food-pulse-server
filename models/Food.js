import { ObjectId } from "mongodb";
import { getDB } from "../config/database.js";

export const getFoodsCollection = async () => {
  const db = getDB();
  const collection = db.collection("foods");

  // Create indexes (avoid text indexes with apiStrict mode)
  try {
    await collection.createIndex({ userId: 1 });
    await collection.createIndex({ expiryDate: 1 });
    await collection.createIndex({ category: 1 });
    // Text index removed due to apiStrict: true on MongoDB Atlas
  } catch (error) {
    console.log("Index creation note:", error.message);
  }

  return collection;
};

export const createFood = async (foodData) => {
  const collection = await getFoodsCollection();
  const doc = {
    ...foodData,
    userId: foodData.userId,
    addedDate: new Date(),
    expiryDate: new Date(foodData.expiryDate),
  };
  const result = await collection.insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

export const getFoodById = async (id) => {
  const collection = await getFoodsCollection();
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return await collection.findOne({ _id: new ObjectId(id) });
};

export const updateFood = async (id, updates) => {
  const collection = await getFoodsCollection();
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const updateData = { ...updates };
  if (updates.expiryDate) {
    updateData.expiryDate = new Date(updates.expiryDate);
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );
  return result.value;
};

export const deleteFood = async (id) => {
  const collection = await getFoodsCollection();
  if (!ObjectId.isValid(id)) {
    return false;
  }
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

export const getAllFoods = async () => {
  const collection = await getFoodsCollection();
  return await collection.find({}).toArray();
};

export const getFoodsByUserId = async (userId) => {
  const collection = await getFoodsCollection();
  return await collection.find({ userId: userId }).toArray();
};

export const getExpiredFoods = async (userId) => {
  const collection = await getFoodsCollection();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return await collection
    .find({ userId: userId, expiryDate: { $lt: today } })
    .sort({ expiryDate: -1 })
    .toArray();
};

export const getExpiringFoods = async (userId, daysAhead = 7) => {
  const collection = await getFoodsCollection();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return await collection
    .find({
      userId: userId,
      expiryDate: {
        $gte: today,
        $lte: futureDate,
      },
    })
    .sort({ expiryDate: 1 })
    .toArray();
};

export const getFoodsByCategory = async (category, userId) => {
  const collection = await getFoodsCollection();
  return await collection
    .find({ category: category, userId: userId })
    .toArray();
};

export const searchFoods = async (query, userId) => {
  const collection = await getFoodsCollection();
  // Using regex search instead of text index
  const regex = new RegExp(query, 'i'); // case-insensitive
  return await collection
    .find({
      $or: [
        { foodTitle: { $regex: regex } },
        { description: { $regex: regex } }
      ],
      userId: userId,
    })
    .toArray();
};
