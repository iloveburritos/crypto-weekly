// components/TerminalLogo.js

const TerminalLogo = ({ size = "32" }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Terminal Icon */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Terminal Box */}
        <rect 
          x="10" 
          y="15" 
          width="80" 
          height="70" 
          rx="8" 
          stroke="currentColor" 
          strokeWidth="6" 
          fill="none"
        />
        
        {/* Terminal Prompt Arrow */}
        <path 
          d="M25 35 L35 45 L25 55" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
        
        {/* Terminal Cursor Line */}
        <line 
          x1="45" 
          y1="45" 
          x2="65" 
          y2="45" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round"
        />
      </svg>
      
      {/* Text Logo */}
      <span className="font-bold text-xl tracking-wide">
        CRYPTO WEEKLY
      </span>
    </div>
  );
};

export default TerminalLogo;