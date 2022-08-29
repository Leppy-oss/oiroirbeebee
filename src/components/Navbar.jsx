import React from 'react';
import { ReactComponent as Logo } from '../res/logo2.svg';

export default function Navbar() {
    return (
        <div className='w-full relative h-[225px] bg-oiroirbeebee-yellow-1 flex flex-row justify-between flex-nowrap p-[15px] mt-0 items-center inset-0'>
            <Logo className='w-[200px] h-[200px] ml-[-10px]' href='http://localhost:3000/' />
            <h1 className='opacity-[0.75] text-[100px] mr-[10px] animate-pulse font-comfortaa text-oiroirbeebee-greyllow-1'><a href='http://localhost:3000/'>oiroirbeebee</a></h1>
        </div>
    );
}