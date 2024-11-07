import React, { useEffect, useMemo } from 'react';
import { Users, LifeBuoy, Settings } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRepresentatives } from '../../../services/operations/adminServices';
import { setRepresentatives, setLoading, setError } from '../../../slices/representativesSlice';

const StatsGrid = () => {
  const dispatch = useDispatch();
  const { representatives, loading } = useSelector((state) => state.representatives);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadRepresentatives = async () => {
      try {
        dispatch(setLoading(true));
        const reps = await fetchRepresentatives(token);
        dispatch(setRepresentatives(reps));
      } catch (err) {
        dispatch(setError("Failed to fetch representatives"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (representatives.length === 0) {
      loadRepresentatives();
    }
  }, [dispatch, token, representatives.length]);

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
        textColor: "text-indigo-600"
      },
      {
        title: "Customer Support",
        count: customerSupportCount,
        icon: LifeBuoy,
        gradient: "from-blue-500/10 to-cyan-500/10",
        textColor: "text-blue-600"
      },
      {
        title: "Technical Support",
        count: technicalSupportCount,
        icon: Settings,
        gradient: "from-purple-500/10 to-pink-500/10",
        textColor: "text-purple-600"
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