import { ChangeEvent, useEffect, useState } from 'react';
import { useCreateNewNote, useGetAllNotes } from '../lib/react-query';
import { useAppDispatch, useAppSelector } from '../redux/store';
import List from './List';
import { Models } from 'appwrite';
import { setActiveNote } from '../redux/slices/noteSlice';
import { OneEightyRing } from 'react-svg-spinners';
import { INewNote } from '../types';

const ListsMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.userInfo.user.id);
  const isListsMenuActive = useAppSelector(
    (state) => state.noteInfo.isListsMenuActive
  );
  const newNote = { title: 'New Note', content: 'This is note' };
  const [search, setSearch] = useState('');
  const { mutateAsync: mutateCreateNewNote, isPending: isNoteCreating } =
    useCreateNewNote(newNote, userId);

  const { data: notes, isPending } = useGetAllNotes(userId);

  useEffect(() => {
    if (typeof notes !== 'object' && !isPending) {
      dispatch(setActiveNote(notes[0]));
    }
  }, [isPending]);

  const filteredNotes = notes?.filter((note: Models.Document & INewNote) => {
    const searchInput = search.toLowerCase();
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();

    return title.includes(searchInput) || content.includes(searchInput);
  });

  const createNewNote = async () => {
    await mutateCreateNewNote();
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div
      className={`${
        isListsMenuActive ? 'sm:block sm:flex-1' : 'sm:hidden'
      } h-full w-80 border-r text-slate-950 border-r-slate-800`}
    >
      <div className="h-14 flex justify-between items-center px-4 py-2 border-b border-b-slate-800">
        {isNoteCreating ? (
          <OneEightyRing color="white" />
        ) : (
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer mr-1"
            onClick={async () => await createNewNote()}
          >
            <g strokeWidth="0"></g>
            <g
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.72"
            ></g>
            <g>
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#ffffff"
                strokeWidth="1.5"
              ></circle>
              <path
                d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
            </g>
          </svg>
        )}

        <div className=" relative flex justify-between items-center">
          <input
            value={search}
            onChange={(e) => handleSearch(e)}
            className="bg-slate-200 pl-7 pr-1 py-1 rounded-md"
            type="text"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute"
          >
            <path
              d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
      </div>
      <ul className="mt-3 flex items-center justify-center flex-col gap-3">
        {isPending ? (
          <OneEightyRing color="white" />
        ) : filteredNotes.length ? (
          filteredNotes.map((note: Models.Document & INewNote) => (
            <List key={note.$id} note={note}></List>
          ))
        ) : (
          <div className="text-slate-200 text-center">
            У вас нет заметок. <br />
            Вы можете создать новую, нажав на плюсик сверху
          </div>
        )}
      </ul>
    </div>
  );
};

export default ListsMenu;
