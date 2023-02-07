import { trpc } from "../trpc";

interface Props {
  note: {
    _id: string;
    title: string;
    description: string;
    done: boolean;
  };
}

function NoteCard({ note }: Props) {
  const deleteNote = trpc.note.delete.useMutation();
  const toggleDoneNote = trpc.note.toggleDone.useMutation();
  const utils = trpc.useContext();

  const handleDeleteNote = () => {
    deleteNote.mutate(note._id, {
      onSuccess: (response) => {
        if (response) {
          utils.note.get.invalidate();
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div className="bg-zinc-800 p-2 mb-2 flex rounded-md justify-between">
      <div>
        <h1 className="font-bold text-xl">{note.title}</h1>
        <p>{note.description}</p>
      </div>
      <div className="flex gap-x-2">
        <button
          onClick={() => {
            handleDeleteNote();
          }}
          className="bg-red-500 pa px-3 py-2 rounded-md text-white ml-auto"
        >
          delete
        </button>
        <button
          onClick={async () => {
            toggleDoneNote.mutate(note._id, {
              onSuccess: (response) => {
                if (response) {
                  utils.note.get.invalidate();
                }
              },
            });
          }}
          className={`${
            note.done ? "bg-zinc-500" : "bg-green-500"
          } pa px-3 py-2 rounded-md text-white ml-auto`}
        >
          {note.done ? "Undone" : "done"}
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
