import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br3 shadow-2" options={{ max : 55 }} style={{ height: 128, width: 128 }} >
 				<div className="Tilt-inner h-100 pa4 ">
 					<img alt='logo' className='' src={brain}/>
 				</div>
			</Tilt>
		</div>
	);
};

export default Logo;