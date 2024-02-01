import { ChangeEvent, useEffect, useState } from 'react';
import { useCreateNewNote, useGetAllNotes } from '../lib/react-query';
import { useAppDispatch, useAppSelector } from '../redux/store';
import List from './List';
import { Models } from 'appwrite';
import { setActiveNote } from '../redux/slices/noteSlice';
import { OneEightyRing } from 'react-svg-spinners';
import { INewNote } from '../types';
import AddSvg from '../svg/AddSvg';
import SearchSvg from '../svg/SearchSvg';

const ListsMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.userInfo.user.id);
  const isListsMenuActive = useAppSelector(
    (state) => state.noteInfo.isListsMenuActive
  );
  const newNote = { title: 'New Note', content: 'This is note' };
  const [search, setSearch] = useState('');
  const { mutateAsync: createNewNote, isPending: isNoteCreating } =
    useCreateNewNote(newNote, userId);

  const { data: notes, isPending } = useGetAllNotes(userId);

  useEffect(() => {
    if (Array.isArray(notes) && notes.length && !isPending) {
      dispatch(setActiveNote(notes[0]));
    }
  }, [dispatch, isPending]);

  const filteredNotes = notes?.filter((note: Models.Document & INewNote) => {
    const searchInput = search.toLowerCase();
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();

    return title.includes(searchInput) || content.includes(searchInput);
  });

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
          <div onClick={async () => await createNewNote()}>
            <AddSvg className="cursor-pointer mr-1" />
          </div>
        )}

        <div className=" relative flex justify-between items-center">
          <input
            value={search}
            onChange={(e) => handleSearch(e)}
            className="bg-slate-200 pl-7 pr-1 py-1 rounded-md"
            type="text"
          />
          <SearchSvg className="absolute" />
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
