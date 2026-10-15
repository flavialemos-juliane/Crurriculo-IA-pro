import React from 'react';

export default function ChatHelpIcon({ size = 24, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      className={className}
    >
      <path 
        d="M21 11.5C21 16.75 16.75 21 11.5 21C9.5 21 7.7 20.4 6.2 19.3L3 21L4.7 17.8C3.6 16.3 3 14.5 3 12.5C3 7.25 7.25 3 12.5 3C17.75 3 22 7.25 22 12.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="11.5" cy="11.5" r="1.5" fill="currentColor"/>
      <circle cx="15.5" cy="11.5" r="1.5" fill="currentColor"/>
      <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor"/>
    </svg>
  );
}
