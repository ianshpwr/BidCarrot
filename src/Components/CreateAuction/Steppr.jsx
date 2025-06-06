"use client"; 
import './Steppr.css';
import { useState } from 'react';
import Stepper, { Step } from './../ui/Stepper';
import Fileuploadd from './File';
export default function Steppr() {
  const [name, setName] = useState('');

  return (
    <Stepper
      initialStep={1}
      onStepChange={(step) => {
        console.log(step);
      }}
      onFinalStepCompleted={() => console.log("All steps completed!")}
      backButtonText="Previous"
      nextButtonText="Next"
    >
      <Step>
        <h2 className='detailHeading'>Basic Information</h2>

        <h3 className='detailHeading'>Tell us about your auction item</h3>
        <hr style={{padding:"0.5rem",marginTop:'1rem'}}/>

        <label className='Details'>Auction Title *</label>
        <input className='basicDetails' required/>

        <label className='Details'>Category *</label>
        <input className='basicDetails' required/>

        <label className='Details'>Starting Bid ($) *</label>
        <input className='basicDetails' required/>

        <label className='Details'>Reserve Price ($)</label>
        <input className='basicDetails' required/>

        <label className='Details'>Description *</label>
        <input className='basicDetails' required/>

      </Step>

      <Step>
        <h2>Upload Images</h2>
        <p>Add photos to showcase your item</p>
        <Fileuploadd />
      </Step>

      <Step>
        <h2>How about an input?</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name?"
        />
      </Step>

      <Step>
        <h2>Final Step</h2>
        <p>You made it!</p>
      </Step>
    </Stepper>
  );
}
