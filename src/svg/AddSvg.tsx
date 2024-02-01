interface AddSvgProps {
  className?: string;
}

const AddSvg: React.FC<AddSvgProps> = ({ className }) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g strokeWidth="0"></g>
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.72"></g>
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
  );
};

export default AddSvg;
