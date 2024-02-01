interface QuitSvgProps {
  className?: string;
}

const QuitSvg: React.FC<QuitSvgProps> = ({ className }) => {
  return (
    <svg
      fill="#ffffff"
      viewBox="0 0 16.00 16.00"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      strokeWidth="0.00016"
      className={className}
    >
      <g strokeWidth="0">
        <g
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#CCCCCC"
          strokeWidth="0.096"
        />
        <path
          d="M12.207 9H5V7h7.136L11.05 5.914 12.464 4.5 16 8.036l-3.536 3.535-1.414-1.414L12.207 9zM10 4H8V2H2v12h6v-2h2v4H0V0h10v4z"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export default QuitSvg;
