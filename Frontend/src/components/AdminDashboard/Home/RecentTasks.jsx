import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import PaginationControls from "./PaginationControls";

function RecentTasks({ recentActivity }) {
  
  const [task, setTask] = useState(recentActivity);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(recentActivity.length / itemsPerPage);

  const paginatedData = recentActivity.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  function TimeAgo({ createdAt }) {
    const [timeAgoText, setTimeAgoText] = useState("");
    // console.log(createdAt);

    // Function to calculate time ago
    const calculateTimeAgo = () => {
      const currentTime = new Date();
      const pastTime = new Date(createdAt);
      const differenceInMs = currentTime - pastTime;

      const differenceInSeconds = Math.floor(differenceInMs / 1000);
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      const remainingMinutes = differenceInMinutes % 60;
      const remainingSeconds = differenceInSeconds % 60;

      let timeString = "";
      if (differenceInHours > 0) {
        timeString = `${differenceInHours} hrs ${remainingMinutes} min ${remainingSeconds} sec ago`;
      } else if (differenceInMinutes > 0) {
        timeString = `${remainingMinutes} min ${remainingSeconds} sec ago`;
      } else {
        timeString = `${remainingSeconds} sec ago`;
      }

      setTimeAgoText(timeString);
    };

    useEffect(() => {
      // Set initial time ago
      calculateTimeAgo();

      // Update time every second
      const intervalId = setInterval(calculateTimeAgo, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, [createdAt]); // Re-run when createdAt changes

    return <span>{timeAgoText}</span>;
  }
  // console.log(recentActivity);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-1/3 text-left pb-3 text-sm font-medium text-gray-600">
                  Task
                </th>
                <th className="w-1/3 text-left pb-3 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="w-1/3 text-left pb-3 text-sm font-medium text-gray-600">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((activity) => (
                <tr
                  key={activity.taskId}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="w-1/3 py-4">
                    <p className="font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.projectTitle}
                    </p>
                  </td>
                  <td className="w-1/3 py-4">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium ${
                        activity.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : activity.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="w-1/3 py-4 text-sm text-gray-600">
                    <TimeAgo createdAt={activity.createdAt} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={recentActivity.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default RecentTasks;
