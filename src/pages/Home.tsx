import { ChangeEvent, useEffect } from 'react';
import Header from '../components/Header';
import ListsMenu from '../components/ListsMenu';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { changeNoteContent, changeNoteTitle } from '../redux/slices/noteSlice';
import { useSaveNote } from '../lib/react-query';
import { OneEightyRing } from 'react-svg-spinners';
import useDebounce from '../hooks/useDebounce';

function Home() {
  const dispatch = useAppDispatch();
  const { id, title, content, isListsMenuActive } = useAppSelector(
    (state) => state.noteInfo
  );
  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    const saveNoteOnChange = async () =>
      await saveNote({
        noteId: id,
        note: { title: debouncedTitle, content: debouncedContent },
      });

    if (id) saveNoteOnChange();
  }, [debouncedTitle, debouncedContent]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(changeNoteTitle(e.target.value));
  };

  const handleChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(changeNoteContent(e.target.value));
  };

  const { mutateAsync: saveNote, isPending: isNoteSaving } = useSaveNote();

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <ListsMenu />

        <div
          className={`${
            isListsMenuActive ? 'sm:hidden' : 'sm:flex'
          } flex-1 flex flex-col `}
        >
          <div className="flex justify-center h-14 items-center border-b border-b-slate-800">
            <input
              className="bg-slate-900 text-2xl h-full w-full px-3 py-1"
              placeholder="Название заметки..."
              value={title}
              onChange={(e) => handleChangeInput(e)}
            />
            <div className="mr-4">
              {isNoteSaving ? (
                <OneEightyRing color="white" height={44} width={44} />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                  className="cursor-pointer h-12 w-12 sm:h-8 sm:w-8"
                  onClick={async () =>
                    await saveNote({ noteId: id, note: { title, content } })
                  }
                >
                  <g strokeWidth="0"></g>
                  <g strokeLinecap="round" strokeLinejoin="round"></g>
                  <g>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                      fill="#ffffff"
                    ></path>
                  </g>
                </svg>
              )}
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => handleChangeTextarea(e)}
            placeholder="Содержимое заметки..."
            className="flex-1 p-3 text-2xl bg-slate-900"
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default Home;

// : isSuccess ? (
//   <svg
//     viewBox="0 0 512 512"
//     fill="#ffffff"
//     stroke="#ffffff"
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-12 w-12"
//   >
//     <g>
//       <polygon points="440.469,73.413 218.357,295.525 71.531,148.709 0,220.229 146.826,367.055 218.357,438.587 289.878,367.055 512,144.945"></polygon>
//     </g>
//   </svg>
