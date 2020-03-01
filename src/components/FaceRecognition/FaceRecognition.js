import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imgUrl, boxes}) => {

	return (
		<div className='center ma'>
			<div className='absolute mt2 bg-black'>
			<img alt='' id='inputImage' src={imgUrl} width={'900px'}/>
				{
				boxes.map((b,i) => {
					return (
						<div key={i} style={{top: b.topRow, right: b.rightCol, bottom: b.btmRow, left: b.leftCol}} className='bounding-box'></div>
					);
				})
			}
			</div>
		</div>
	);
};

export default FaceRecognition;