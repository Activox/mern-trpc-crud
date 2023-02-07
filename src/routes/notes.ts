import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import Note from "../models/note";
import note from "../models/note";

const getNotes = publicProcedure.query(async () => {
  const notes = await Note.find();
  return notes;
});

const createNote = publicProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const newNote = await new Note({
      title: input.title,
      description: input.description,
    });
    const savedNote = await newNote.save();
    return savedNote;
  });

const deleteNote = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    console.log({ input });
    const noteFound = await Note.findByIdAndDelete(input);
    if (!noteFound) throw new Error("Note Not Found");
    return true;
  });

const toggleDone = publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    const foundNote = await Note.findById(input);
    if (!foundNote) throw new Error("Note not found");
    foundNote.done = !foundNote.done;
    await foundNote.save();
    return true;
  });

export const notesRouter = router({
  get: getNotes,
  create: createNote,
  delete: deleteNote,
  toggleDone,
});
