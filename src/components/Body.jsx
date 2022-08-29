import React from 'react';

export default function Body() {
    return (
        <div className='relative flex items-center justify-items-center justify-between flex-row flex-nowrap justify-self-center text-oiroirbeebee-greyllow-2 font-roboto bg-oiroirbeebee-greyllow-3 rounded-2xl'>
            <h1 className='text-[75px] animate-pulse p-[10px]'>Welcome to oiroirbeebee!</h1>
            <h2 className='setup opacity-[70%] text-[25px]'>Steps for setup:</h2>
            <ol className='font-roboto opacity-[70%]'>
                <li>Download this project from <a target="_blank" rel="noopener noreferrer" href='https://github.com/Leppy-oss/oiroirbeebee' className='visited:text-oiroirbeebee-greyllow-2 underline'>Github</a></li>
                <li>Navigate to your terminal and enter the directory for <code>oiroirbeebe</code></li>
                <li>Type <code>npm start</code></li>
                <li>Everything will run automatically and your webpage will be available on <code>http://localhost:3000/</code></li>
            </ol>
        </div>
    );
}