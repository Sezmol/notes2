import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import useDebounce from '../hooks/useDebounce';
import { useSaveNote } from '../lib/react-query';
import { changeNoteContent, changeNoteTitle } from '../redux/slices/noteSlice';
import { OneEightyRing } from 'react-svg-spinners';
import SaveSvg from '../svg/SaveSvg';

const ListContent = () => {
  const dispatch = useAppDispatch();
  const { id, title, content, isListsMenuActive } = useAppSelector(
    (state) => state.noteInfo
  );
  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);

  const { mutateAsync: saveNote, isPending: isNoteSaving } = useSaveNote();

  useEffect(() => {
    const saveNoteOnChange = async () =>
      await saveNote({
        noteId: id,
        note: { title: debouncedTitle, content: debouncedContent },
      });

    if (id) saveNoteOnChange();
  }, [debouncedTitle, debouncedContent]);

  return (
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
          onChange={(e) => dispatch(changeNoteTitle(e.target.value))}
        />
        <div className="mr-4">
          {isNoteSaving ? (
            <OneEightyRing color="white" height={44} width={44} />
          ) : (
            <div
              onClick={async () =>
                await saveNote({ noteId: id, note: { title, content } })
              }
            >
              <SaveSvg className="cursor-pointer h-12 w-12 sm:h-8 sm:w-8" />
            </div>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => dispatch(changeNoteContent(e.target.value))}
        placeholder="Содержимое заметки..."
        className="flex-1 p-3 text-2xl bg-slate-900"
      ></textarea>
    </div>
  );
};

export default ListContent;
