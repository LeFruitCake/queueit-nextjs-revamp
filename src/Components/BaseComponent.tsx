import React, { PropsWithChildren } from 'react';
import Navbar from './Navbar';

interface BaseComponentProps {
  // You can add more props here if needed
}

const BaseComponent: React.FC<PropsWithChildren<BaseComponentProps>> = ({ children }) => {
    return (
        <div className='h-screen bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] overflow-hidden py-2 px-10 md:px-28 lg:px-28 xl:px-28'>
            <Navbar/>
            {children}
        </div>
    );
};

export default BaseComponent;