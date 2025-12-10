"use client";
import './Steppr.css';
import { useState } from 'react';
import Stepper, { Step } from './../ui/Stepper';
import Fileuploadd from './File';
import Link from 'next/link';

export default function Steppr() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    startingBid: '',
    reservePrice: '',
    description: '',
  });

  function onReload() {
    window.location.reload();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

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
        <hr style={{ padding: "0.5rem", marginTop: '1rem' }} />

        <label className='Details'>Auction Title *</label>
        <input
          className='basicDetails'
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label className='Details'>Category *</label>
        <input
          className='basicDetails'
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label className='Details'>Starting Bid ($) *</label>
        <input
          className='basicDetails'
          name="startingBid"
          type="number"
          value={formData.startingBid}
          onChange={handleChange}
          required
        />

        <label className='Details'>Reserve Price ($)</label>
        <input
          className='basicDetails'
          name="reservePrice"
          type="number"
          value={formData.reservePrice}
          onChange={handleChange}
        />

        <label className='Details'>Description *</label>
        <input
          className='basicDetails'
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </Step>

      <Step>
        <h2>Upload Images</h2>
        <p>Add photos to showcase your item</p>
        <Fileuploadd />
      </Step>

      <Step>
        <h2>Auction Created Successfully!</h2>
        <p>Your auction will go live at the scheduled time</p>
        <div className='summary'>
          <ul className='summaryList'>
            <h3>Auction Summary</h3>
            <li><strong>Title:</strong> {formData.title}</li>
            <li><strong>Category:</strong> {formData.category}</li>
            <li><strong>Starting Bid:</strong> ${formData.startingBid}</li>
          </ul>
          <ul className='summaryList'>
            <h3>Next Steps</h3>
            <li>Your auction is pending review</li>
            <li>You'll receive email confirmation</li>
            <li>Auction goes live at scheduled time</li>
            <li>Monitor bids in your dashboard</li>
          </ul>
        </div>
      </Step>

      <Step>
        <div className='laststep'>
          <Link href="/dashboard">
            <button className='step4'>Go To Dashboard</button>
          </Link>

          <button className='step4' onClick={onReload}>Create Another Auction</button>
        </div>
      </Step>
    </Stepper>
  );
}
