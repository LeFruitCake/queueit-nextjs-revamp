import React, { PropsWithChildren } from 'react';
import Navbar from './Navbar';
import greenTwirly from '../../public/images/img7.png'
import purpleTwirly from '../../public/images/img2.png'
import zIndex from '@mui/material/styles/zIndex';

interface BaseComponentProps {
  // You can add more props here if needed
}


//this is the component that is used by all pages that has a navbar.
//this is done to reduce state reupdate for navbar everytime a child component rerenders.
const BaseComponent: React.FC<PropsWithChildren<BaseComponentProps>> = ({ children }) => {
    return (
        <div className='h-screen bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] overflow-x-hidden px-10 md:px-28 lg:px-28 xl:px-28 relative z-0'>
            <Navbar/>
            <img src={greenTwirly.src} alt="green twirly" style={{position:'absolute', transform:'translate(-30%,-13%)', top:'0%',left:'0%', zIndex:0}}/>
            <img src={purpleTwirly.src} alt="purple twirly" style={{position:'absolute', transform:'translate(30%,60%)', bottom:'0%',right:'0%', zIndex:0}}/>
            {children}
        </div>
    );
};

export default BaseComponent;