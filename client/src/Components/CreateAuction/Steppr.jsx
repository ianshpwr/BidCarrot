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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";

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
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auctionSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    basePrice: z.coerce.number().min(1, "Price must be at least $1"),
    duration: z.string(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    theme: z.string().min(1, "Please select a theme"),
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      title: "",
      basePrice: "", // Initialize as empty for placeholder to show
      duration: "3600000",
      description: "",
      theme: "",
    },
  });

  const formData = watch(); // Watch all fields to keep existing UI logic working

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["title", "basePrice", "duration", "description"]);
    } else if (step === 2) {
      isValid = await trigger("theme");
    }
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(step - 1);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        description: `[${data.theme.toUpperCase()}] ${data.description}`,
        basePrice: parseInt(data.basePrice),
        durationMs: parseInt(data.duration),
      };

      await auctions.create(payload);
      setSuccess(true);
      toast.success("Auction created successfully!");
    } catch (err) {
      const msg = err.message || "Failed to create auction.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-xl mx-auto text-center py-12">
        {/* ... success view ... */}
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
                  <div>
                    <Input 
                      label="Auction Title" 
                      placeholder="e.g. Vintage Rolex Submariner"
                      {...register("title")}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <Input 
                         label="Base Price ($)" 
                         type="number"
                         placeholder="100"
                         {...register("basePrice")}
                       />
                       {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
                     </div>
                     <div>
                       <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">Duration</label>
                       <select 
                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500"
                         {...register("duration")}
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
                      rows={4}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-white"
                      placeholder="Describe your item in detail..."
                      {...register("description")}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>
               </div>
               <div className="flex justify-end mt-8">
                  <Button onClick={handleNext}>
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
                      onClick={() => setValue("theme", theme.id)}
                      className={`relative group cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition-all ${formData.theme === theme.id ? 'border-yellow-500 scale-105' : 'border-transparent hover:border-white/30'}`}
                    >
                       <Image 
                         src={theme.image} 
                         alt={theme.label} 
                         fill
                         className="object-cover group-hover:scale-110 transition-transform duration-500" 
                         sizes="(max-width: 768px) 50vw, 33vw"
                       />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
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
               {errors.theme && <p className="text-red-500 text-sm mt-4 text-center">{errors.theme.message}</p>}

               <div className="flex justify-between mt-8">
                  <Button variant="secondary" onClick={handleBack}><ChevronLeft size={18} className="mr-1 inline" /> Back</Button>
                  <Button onClick={handleNext}>Next Step <ChevronRight size={18} className="ml-1 inline" /></Button>
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
                   <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0 relative">
                      <Image 
                        src={THEMES.find(t => t.id === formData.theme)?.image || THEMES[0].image} 
                        alt="Theme Preview"
                        fill
                        className="object-cover" 
                      />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold mb-1">{formData.title}</h3>
                      <p className="text-white font-bold text-lg mb-2">${formData.basePrice}</p>
                      <p className="text-gray-400 text-sm">{formData.description}</p>
                   </div>
                </div>

                <div className="flex justify-between">
                   <Button variant="secondary" onClick={handleBack}>Back</Button>
                   <Button 
                     onClick={user ? handleSubmit(onSubmit) : () => router.push('/login')} 
                     disabled={isLoading}
                     className={`${user ? 'bg-green-500 hover:bg-green-600' : 'bg-white text-black hover:bg-gray-200'} font-bold px-8`}
                   >
                     {isLoading ? <div className="scale-50"><Loader /></div> : user ? "Launch Auction" : "Login to Launch"}
                   </Button>
                </div>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
