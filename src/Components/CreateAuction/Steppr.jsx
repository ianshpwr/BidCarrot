"use client"; 
import './Steppr.css';
import { useState } from 'react';
import Stepper, { Step } from './../ui/Stepper';

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
        <h2>Step 2</h2>
        <img
          style={{
            height: '100px',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center -70px',
            borderRadius: '15px',
            marginTop: '1em'
          }}
          src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894"
        />
        <p>Custom step content!</p>
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
