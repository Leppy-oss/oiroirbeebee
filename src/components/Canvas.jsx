import React, { useRef, useEffect } from 'react';

const Canvas = props => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const document = canvas.ownerDocument;
        console.log(document);
        context.fillStyle = '#ff0000';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }, [])

    return <canvas ref={canvasRef} {...props} className='w-[600px] h-[600px] outline outline-1 mt-[5%]' />
}

export default Canvas;