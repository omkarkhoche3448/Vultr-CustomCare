import React, { useEffect, useMemo, useState } from 'react';
import { Users, LifeBuoy, Settings } from 'lucide-react';

const StatsGrid = () => {
  const [representatives, setRepresentatives] = useState([]);

  useEffect(() => {
    // Simulate an API call to fetch representatives
    const fetchRepresentatives = () => {
      // Dummy data to simulate API response
      const dummyData = [
        { name: "John Doe", email: "john@example.com", skillset: "Customer Support", status: "Active" },
        { name: "Jane Smith", email: "jane@example.com", skillset: "Technical Support", status: "Inactive" },
        { name: "Alice Johnson", email: "alice@example.com", skillset: "Customer Support", status: "Active" },
        { name: "Bob Brown", email: "bob@example.com", skillset: "Technical Support", status: "Active" },
        { name: "Charlie Davis", email: "charlie@example.com", skillset: "Customer Support", status: "Inactive" }
      ];

      // Simulate network delay
      setTimeout(() => {
        setRepresentatives(dummyData);
      }, 1000); // 1 second delay
    };

    fetchRepresentatives();
  }, []);

  const stats = useMemo(() => {
    const customerSupportCount = representatives.filter(
      (rep) => rep.skillset === "Customer Support"
    ).length;

    const technicalSupportCount = representatives.filter(
      (rep) => rep.skillset === "Technical Support"
    ).length;

    return [
      {
        title: "Total Representatives",
        count: representatives.length,
        icon: Users,
        gradient: "from-indigo-500/10 to-blue-500/10",
        textColor: "text-indigo-600",
        trendValue: "+12.5%",
        trend: "up"
      },
      {
        title: "Customer Support",
        count: customerSupportCount,
        icon: LifeBuoy,
        gradient: "from-blue-500/10 to-cyan-500/10",
        textColor: "text-blue-600",
        trendValue: "+8.3%",
        trend: "up"
      },
      {
        title: "Technical Support",
        count: technicalSupportCount,
        icon: Settings,
        gradient: "from-purple-500/10 to-pink-500/10",
        textColor: "text-purple-600",
        trendValue: "+5.2%",
        trend: "up"
      }
    ];
  }, [representatives]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100/20 shadow-md backdrop-blur-sm"
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-30`} />
          
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className={`${stat.textColor} bg-white/80 rounded-lg p-2.5 inline-flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-gray-800">
                    {stat.count}
                  </span>
                  <span className="text-sm font-medium text-green-500 flex items-center">
                    {stat.trendValue}
                    <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  {stat.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
