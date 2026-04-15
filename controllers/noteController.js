import { createNote, getNotesByFoodId, getAllNotes } from "../models/Note.js";

export const getAllNotesHandler = async (req, res, next) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNotesByFoodHandler = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const notes = await getNotesByFoodId(foodId);
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const createNoteHandler = async (req, res, next) => {
  try {
    const { foodId, text, photoUrl } = req.body;

    if (!foodId || !text) {
      return res.status(400).json({ error: "foodId and text are required" });
    }

    const noteData = {
      foodId,
      text,
      authorName: req.user.displayName || req.user.email,
      email: req.user.email,
      photoUrl: photoUrl || "",
    };

    const newNote = await createNote(noteData);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};
