import React from 'react';
import Image from 'next/image';

export const Logo = () => {
    return (
        <Image src="/potzilla.jpg" alt="logo" width="100" height="150" />
    );
}