import { Models } from 'appwrite';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { clearActiveNote, setActiveNote } from '../redux/slices/noteSlice';
import { useDeleteNote } from '../lib/react-query';
import { OneEightyRing } from 'react-svg-spinners';

interface ListProps {
  note: Models.Document;
}

const List: React.FC<ListProps> = ({ note }) => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((state) => state.noteInfo);

  const isActive = id === note.$id;

  const changeActiveNote = () => {
    dispatch(setActiveNote(note));
  };

  const { mutateAsync: deleteNoteAsync, isPending: isNoteDeleting } =
    useDeleteNote(note.$id);

  const deleteNote = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (isActive) dispatch(clearActiveNote());
    await deleteNoteAsync();
  };

  return (
    <div
      className={`flex justify-between items-center w-full ${
        isActive
          ? ' bg-violet-800 text-slate-200'
          : 'bg-slate-200 text-violet-800'
      } text-xl px-2 py-2 rounded-md cursor-pointer`}
      onClick={changeActiveNote}
    >
      <p>{note.title}</p>

      {isNoteDeleting ? (
        <OneEightyRing />
      ) : (
        <svg
          onClick={(e) => deleteNote(e)}
          width="24px"
          height="24px"
          viewBox="0 -0.5 21 21"
          className="delete_icon"
        >
          <g strokeWidth="0"></g>
          <g strokeLinecap="round" strokeLinejoin="round"></g>
          <g>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g
                className="delete_icon_g"
                transform="translate(-179.000000, -360.000000)"
                fill={`${isActive ? '#ffffff' : '#000000'}`}
              >
                <g transform="translate(56.000000, 160.000000)">
                  <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z"></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      )}
    </div>
  );
};

export default List;
