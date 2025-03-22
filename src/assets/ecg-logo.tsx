const ECGLogo = () => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <circle cx="50" cy="50" r="48" fill="#1a237e" />
      <circle cx="50" cy="50" r="45" fill="#fff" stroke="#1a237e" strokeWidth="1" />
      <g transform="translate(50,50) scale(0.6)">
        <path
          d="M0,-40 L23,0 L0,40 L-23,0 Z"
          fill="#ff0000"
          transform="rotate(0)"
        />
        <path
          d="M0,-40 L23,0 L0,40 L-23,0 Z"
          fill="#ff0000"
          transform="rotate(120)"
        />
        <path
          d="M0,-40 L23,0 L0,40 L-23,0 Z"
          fill="#ff0000"
          transform="rotate(240)"
        />
      </g>
      <circle cx="50" cy="50" r="15" fill="#1a237e" />
    </svg>
  );
};

export default ECGLogo; 