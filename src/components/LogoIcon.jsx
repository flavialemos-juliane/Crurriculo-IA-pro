import React from 'react';

export default function LogoIcon({ size = 18, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor"/>
      <rect x="5" y="4" width="10" height="14" rx="2" fill="white" fillOpacity="0.95"/>
      <path d="M8 8H14M8 11H12M8 14H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="17" r="4.5" fill="#10B981"/>
      <path d="M15 17L16.5 18.5L19.5 15.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
