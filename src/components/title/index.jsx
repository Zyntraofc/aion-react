import React from 'react';

function Title({ title , descricao }) {
  return (
    <div>

    <h1 className="text-2xl font-bold ml-2" >{title}</h1>
    <p className='text-sm ml-2'>{descricao}</p>
    </div>
  );
}

export default Title;
