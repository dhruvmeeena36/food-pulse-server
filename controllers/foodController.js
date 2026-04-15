import {
  getAllFoods,
  getFoodsByUserId,
  getFoodById,
  getExpiredFoods,
  getExpiringFoods,
  getFoodsByCategory,
  searchFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../models/Food.js";
import { getNotesByFoodId } from "../models/Note.js";

export const getAllFoodsHandler = async (req, res, next) => {
  try {
    const foods = await getAllFoods();
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const getMyFoodsHandler = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.uid;
    const foods = await getFoodsByUserId(userId);
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const getFoodByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await getFoodById(id);

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    // Get notes for this food
    const notes = await getNotesByFoodId(id);

    res.json({ ...food, notes });
  } catch (error) {
    next(error);
  }
};

export const getExpiredFoodsHandler = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.uid;
    const foods = await getExpiredFoods(userId);
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const getExpiringFoodsHandler = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.uid;
    const foods = await getExpiringFoods(userId);
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const getCategoryFoodsHandler = async (req, res, next) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const userId = req.user._id || req.user.uid;
    const foods = await getFoodsByCategory(category, userId);
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const searchFoodsHandler = async (req, res, next) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const userId = req.user._id || req.user.uid;
    const foods = await searchFoods(search, userId);
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

export const createFoodHandler = async (req, res, next) => {
  try {
    const { foodTitle, foodImage, category, expiryDate, quantity, description } =
      req.body;

    // Validate required fields
    if (!foodTitle || !expiryDate) {
      return res
        .status(400)
        .json({ error: "foodTitle and expiryDate are required" });
    }

    const foodData = {
      foodTitle,
      foodImage: foodImage || "",
      category: category || "Others",
      expiryDate,
      quantity: quantity || 1,
      description: description || "",
      userId: req.user._id || req.user.uid,
    };

    const newFood = await createFood(foodData);
    res.status(201).json(newFood);
  } catch (error) {
    next(error);
  }
};

export const updateFoodHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { foodTitle, foodImage, category, expiryDate, quantity, description } =
      req.body;

    // Check if food exists and belongs to user
    const food = await getFoodById(id);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    const userId = req.user._id || req.user.uid;
    if (food.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updates = {};
    if (foodTitle !== undefined) updates.foodTitle = foodTitle;
    if (foodImage !== undefined) updates.foodImage = foodImage;
    if (category !== undefined) updates.category = category;
    if (expiryDate !== undefined) updates.expiryDate = expiryDate;
    if (quantity !== undefined) updates.quantity = quantity;
    if (description !== undefined) updates.description = description;

    const updatedFood = await updateFood(id, updates);
    res.json(updatedFood);
  } catch (error) {
    next(error);
  }
};

export const deleteFoodHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if food exists and belongs to user
    const food = await getFoodById(id);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    const userId = req.user._id || req.user.uid;
    if (food.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const deleted = await deleteFood(id);
    if (deleted) {
      res.json({ message: "Food deleted successfully" });
    } else {
      res.status(500).json({ error: "Failed to delete food" });
    }
  } catch (error) {
    next(error);
  }
};
