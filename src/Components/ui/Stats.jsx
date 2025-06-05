// StatsMarquee.jsx
import React from "react";

const stats = [
  { value: "$2.5M+", label: "Total Volume" },
  { value: "15K+", label: "Active Users" },
  { value: "850+", label: "Completed Auctions" },
  { value: "99.9%", label: "Success Rate" },
    { value: "$2.5M+", label: "Total Volume" },
  { value: "15K+", label: "Active Users" },
  { value: "850+", label: "Completed Auctions" },
  { value: "99.9%", label: "Success Rate" },
    { value: "$2.5M+", label: "Total Volume" },
  { value: "15K+", label: "Active Users" },
  { value: "850+", label: "Completed Auctions" },
  { value: "99.9%", label: "Success Rate" },
    { value: "$2.5M+", label: "Total Volume" },
  { value: "15K+", label: "Active Users" },
  { value: "850+", label: "Completed Auctions" },
  { value: "99.9%", label: "Success Rate" },
];

const StatsMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-[#0e0e0e] py-20">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-24">
        {Array(2)
          .fill("")
          .map((_, i) => (
            <div key={i} className="flex gap-24">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                 <h3 className="text-3xl font-bold text-gray-400">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default StatsMarquee;
