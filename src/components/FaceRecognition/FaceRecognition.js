import React from "react";
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, box}) => {

    const faces = (box)=>{
        var arr = [];
        for(let i=0; i<box.length; ++i){
            arr.push(<div key={i} className='bounding-box' style={{top: box[i].topRow, right: box[i].rightCol, bottom: box[i].bottomRow, left: box[i].leftCol }}> </div>)
        }
        if(arr) return arr;
    }


    return (
        <div className='center'>
            <div className='absolute mt2'>
                <img id='inputImage' alt='' src={imageUrl}  width='500px' height='auto'/>
                {faces(box)}
            </div>
        </div>
    )
}
export default FaceRecognition;