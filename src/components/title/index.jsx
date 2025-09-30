import React from 'react';

function Title({ title , descrisão }) {
  return (
    <div>

    <h1 className="text-2xl font-bold ml-6" >{title}</h1>
    <p className='text-sm ml-6'>{descrisão}</p>
    </div>
  );
}

export default Title;
