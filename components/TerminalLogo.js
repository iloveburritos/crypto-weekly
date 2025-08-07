// components/TerminalLogo.js

const TerminalLogo = ({ size = "40" }) => {
  return (
    <div className="flex items-center gap-4">
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
          x="8" 
          y="12" 
          width="84" 
          height="76" 
          rx="10" 
          stroke="currentColor" 
          strokeWidth="6" 
          fill="none"
        />
        
        {/* Terminal Prompt Arrow */}
        <path 
          d="M22 35 L35 48 L22 61" 
          stroke="currentColor" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
        
        {/* Terminal Cursor Line */}
        <line 
          x1="45" 
          y1="48" 
          x2="70" 
          y2="48" 
          stroke="currentColor" 
          strokeWidth="5" 
          strokeLinecap="round"
        />
      </svg>
      
      {/* Text Logo - Two Lines */}
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-xl tracking-wide">CRYPTO</span>
        <span className="font-bold text-xl tracking-wide">WEEKLY</span>
      </div>
    </div>
  );
};

export default TerminalLogo;