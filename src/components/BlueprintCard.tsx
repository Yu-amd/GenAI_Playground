import React from 'react';

interface BlueprintCardProps {
  image: string;
  name: string;
  description: string;
  label: string;
  onClick?: () => void;
}

const BlueprintCard: React.FC<BlueprintCardProps> = ({
  image,
  name,
  description,
  label,
  onClick,
}) => (
  <div
    className='group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 flex flex-row items-center hover:bg-white/20 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all cursor-pointer h-[200px] w-full'
    onClick={onClick}
  >
    <img
      src={image}
      alt={name}
      className='w-36 h-36 object-cover rounded-2xl border-2 border-neutral-700 shadow-md transition mr-10 flex-shrink-0'
    />
    <div className='flex-1 min-w-0 flex flex-col justify-center'>
      <span className='text-xs uppercase tracking-widest text-blue-200 font-semibold mb-1'>
        {label}
      </span>
      <h2 className='text-xl font-bold mb-2 group-hover:text-blue-400 transition truncate'>
        {name}
      </h2>
      <div className='text-base text-neutral-200 mb-4 line-clamp-2'>
        {description}
      </div>
    </div>
  </div>
);

export default BlueprintCard;
