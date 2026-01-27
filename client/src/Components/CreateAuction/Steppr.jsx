"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auctions } from '@/lib/api';
import { Card } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Check, ChevronRight, ChevronLeft, Search, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader } from "@/Components/ui/Loader";

const THEMES = [
  { id: 'tech', label: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' },
  { id: 'art', label: 'Art & Collectibles', image: 'https://images.unsplash.com/photo-1576082987593-0e1deb66b3b5?q=80&w=800&auto=format&fit=crop' },
  { id: 'vehicles', label: 'Vehicles', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop' },
  { id: 'fashion', label: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
  { id: 'realestate', label: 'Real Estate', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop' },
  { id: 'others', label: 'Others', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop' },
];

export default function Steppr() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    duration: '3600000', // Default 1 hour
    theme: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Backend expects durationMs, basePrice (Int)
      const payload = {
        title: formData.title,
        description: `[${formData.theme.toUpperCase()}] ${formData.description}`,
        basePrice: parseInt(formData.basePrice),
        durationMs:parseInt(formData.duration),
      };

      await auctions.create(payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create auction.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-black" />
        </div>
        <h2 className="text-3xl font-bold mb-4 gradient-text">Auction Created!</h2>
        <p className="text-gray-400 mb-8">Your item has been successfully listed.</p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
             <Button variant="primary">Go to Dashboard</Button>
          </Link>
          <Button variant="secondary" onClick={() => window.location.reload()}>Create Another</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-12 px-4">
         {[1, 2, 3].map((s) => (
           <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-white text-black' : 'bg-white/10 text-gray-400'}`}>
                {s}
              </div>
              <span className={`hidden md:inline ${step >= s ? 'text-white' : 'text-gray-600'}`}>
                 {s === 1 ? 'Details' : s === 2 ? 'Visuals' : 'Review'}
              </span>
           </div>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key={1}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card>
               <h2 className="text-2xl font-bold mb-6">Item Details</h2>
               <div className="space-y-6">
                  <Input 
                    label="Auction Title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="e.g. Vintage Rolex Submariner"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input 
                       label="Base Price ($)" 
                       name="basePrice" 
                       type="number"
                       value={formData.basePrice} 
                       onChange={handleChange}
                       placeholder="100"
                     />
                     <div>
                       <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Duration</label>
                       <select 
                         name="duration" 
                         value={formData.duration} 
                         onChange={handleChange}
                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500"
                       >
                         <option value="3600000">1 Hour</option>
                         <option value="21600000">6 Hours</option>
                         <option value="86400000">24 Hours</option>
                         <option value="259200000">3 Days</option>
                         <option value="604800000">7 Days</option>
                       </select>
                     </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-white"
                      placeholder="Describe your item in detail..."
                    />
                  </div>
               </div>
               <div className="flex justify-end mt-8">
                  <Button onClick={handleNext} disabled={!formData.title || !formData.basePrice}>
                    Next Step <ChevronRight size={18} className="ml-1 inline" />
                  </Button>
               </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key={2}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card>
               <h2 className="text-2xl font-bold mb-6">Select a Theme</h2>
               <p className="text-gray-400 mb-6">Select a category to apply a premium visual theme to your auction.</p>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {THEMES.map((theme) => (
                    <div 
                      key={theme.id} 
                      onClick={() => setFormData({...formData, theme: theme.id})}
                      className={`relative group cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition-all ${formData.theme === theme.id ? 'border-yellow-500 scale-105' : 'border-transparent hover:border-white/30'}`}
                    >
                       <img src={theme.image} alt={theme.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="font-bold text-white text-lg">{theme.label}</span>
                       </div>
                       {formData.theme === theme.id && (
                         <div className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full p-1">
                           <Check size={14} />
                         </div>
                       )}
                    </div>
                  ))}
               </div>

               <div className="flex justify-between mt-8">
                  <Button variant="secondary" onClick={handleBack}><ChevronLeft size={18} className="mr-1 inline" /> Back</Button>
                  <Button onClick={handleNext} disabled={!formData.theme}>Next Step <ChevronRight size={18} className="ml-1 inline" /></Button>
               </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key={3}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
             <Card>
                <h2 className="text-2xl font-bold mb-6">Review & Launch</h2>
                
                <div className="glass rounded-xl p-6 mb-8 flex gap-6 items-start">
                   <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0">
                      <img src={THEMES.find(t => t.id === formData.theme)?.image} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold mb-1">{formData.title}</h3>
                      <p className="text-white font-bold text-lg mb-2">${formData.basePrice}</p>
                      <p className="text-gray-400 text-sm">{formData.description}</p>
                   </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 text-center">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                   <Button variant="secondary" onClick={handleBack}>Back</Button>
                   <Button 
                     onClick={user ? handleSubmit : () => router.push('/login')} 
                     disabled={loading}
                     className={`${user ? 'bg-green-500 hover:bg-green-600' : 'bg-white text-black hover:bg-gray-200'} font-bold px-8`}
                   >
                     {loading ? <div className="scale-50"><Loader /></div> : user ? "Launch Auction" : "Login to Launch"}
                   </Button>
                </div>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
