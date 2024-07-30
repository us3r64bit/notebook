import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import Image from 'next/image';

interface ImageDraggableProps {
    url: string;
    isDraggable: boolean;
}

const ImageDraggable = ({ url, isDraggable }: ImageDraggableProps) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    // TODO: make some logic to check if image is draggin in limit, something like image should be dragged more than height(image)
    return (
        <Draggable nodeRef={imgRef}
            disabled={!isDraggable}
        >
            <Image src={url} fill alt="Cover" className="object-cover" ref={imgRef} />

        </Draggable>
    );
};

export default ImageDraggable;