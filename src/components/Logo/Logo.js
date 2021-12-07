import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import face_logo from './face_logo.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max: 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner">
                    <img alt='face_logo' style={{ marginTop: '18px' }} src={face_logo} />
                </div>
            </Tilt>
        </div>
    )
}
export default Logo;