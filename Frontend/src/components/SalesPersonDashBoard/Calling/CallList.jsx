// dummmy
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import CallerInformation from "./CallerInformation";
import KeywordsAndSuggestions from "./KeywordsAndSuggestions";
import { sendInvite } from '../../../services/operations/emailService';

const CallList = () => {
  const [callList, setCallList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hardcoding a single user
    const hardcodedUser = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      inviteSent: false
    };

    // Set callList to contain the hardcoded user
    setCallList([hardcodedUser]);
    setLoading(false); // Set loading to false immediately since there's no API call
  }, []);

  const handleSendInvite = async (userId) => {
    try {
      const data = await sendInvite(userId);
      console.log(`Invite sent to user ${userId}:`, data);

      // Update the callList to indicate the invite has been sent
      setCallList((prevList) =>
        prevList.map((user) =>
          user.id === userId ? { ...user, inviteSent: true } : user
        )
      );
    } catch (error) {
      console.error('Error sending invite:', error);
      setError('Failed to send invite. Please try again.');
    }
  };

  // Handle loading and error states
  if (loading) {
    return <div className="text-center text-lg">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">{error}</div>;
  }

  // If no users are found, display an empty state (this won't happen with the hardcoded user)
  if (callList.length === 0) {
    return (
      <div className="text-center text-lg text-gray-500">
        No users available. Please check back later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-theme(spacing.32))]">
      {/* Call List Section */}
      <div className="lg:col-span-4 bg-custom-gradient rounded-lg shadow-lg p-4 lg:overflow-hidden flex flex-col ">
        <h2 className="text-xl font-semibold mb-4 text-white">Calls List</h2>
        <div
          className="flex-1 overflow-y-scroll scrollbar-none space-y-3 pr-2"
          style={{
            overflowY: "scroll",
            scrollbarWidth: "none", 
            msOverflowStyle: "none", 
          }}
        >
          {callList.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-lg cursor-pointer transition-all bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="text-gray-400" />
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendInvite(user.id)}
                  className={`${
                    user.inviteSent ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                  } text-white py-1 px-3 rounded`}
                  disabled={user.inviteSent}
                >
                  {user.inviteSent ? "Invite Sent" : "Send Invite"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call Information and Keywords Section */}
      <div className="lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        <div className="flex flex-col h-full">
          <KeywordsAndSuggestions conversation={null} /> {/* Pass null for conversation since activeCall is not used */}
        </div>
        <div className="flex flex-col h-full">
          <CallerInformation
            activeCall={null} // Pass null since activeCall is not used
            customerVideoSrc={null} // Pass null as no video sources are defined
            salespersonVideoSrc={null} // Pass null as no video sources are defined
          />
        </div>
      </div>
    </div>
  );
};

export default CallList;



// Here just implemented the sendInvite function and the handleSendInvite function to handle the invite sending with service implementation

// import { useState, useEffect } from "react";
// import { Phone } from "lucide-react";
// import { toast } from "react-hot-toast";
// import CallerInformation from "./CallerInformation";
// import KeywordsAndSuggestions from "./KeywordsAndSuggestions";
// import { fetchUsers, sendInvite } from '../../../services/operations/emailService';

// const CallList = () => {
//   const [callList, setCallList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const loadUsers = async () => {
//     try {
//       const users = await fetchUsers();
//       setCallList(users);
//       setError(null);
//     } catch (error) {
//       setError('Failed to load users. Please try again.');
//       setCallList([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const handleSendInvite = async (userId) => {
//     try {
//       await sendInvite(userId);
      
//       // Update the UI to show invite sent
//       setCallList((prevList) =>
//         prevList.map((user) =>
//           user.id === userId ? { ...user, inviteSent: true } : user
//         )
//       );
//     } catch (error) {
//       // Error handling is already done in the service with toast
//       console.error('Error in handleSendInvite:', error);
//     }
//   };

//   const handleRetry = () => {
//     setLoading(true);
//     setError(null);
//     loadUsers();
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-theme(spacing.32))]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
//           <p className="text-lg text-gray-600">Loading users...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-theme(spacing.32))]">
//         <div className="text-center">
//           <p className="text-lg text-red-600 mb-4">{error}</p>
//           <button
//             onClick={handleRetry}
//             className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (callList.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-theme(spacing.32))]">
//         <div className="text-center text-lg text-gray-500">
//           No users available at the moment.
//           <button
//             onClick={handleRetry}
//             className="block mx-auto mt-4 text-blue-500 hover:text-blue-600 underline"
//           >
//             Refresh List
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-theme(spacing.32))]">
//       {/* Call List Section */}
//       <div className="lg:col-span-4 bg-custom-gradient rounded-lg shadow-lg p-4 lg:overflow-hidden flex flex-col">
//         <h2 className="text-xl font-semibold mb-4 text-white">Calls List</h2>
//         <div
//           className="flex-1 overflow-y-scroll scrollbar-none space-y-3 pr-2"
//           style={{
//             overflowY: "scroll",
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//           }}
//         >
//           {callList?.map((user) => (
//             <div
//               key={user.id}
//               className="p-4 rounded-lg cursor-pointer transition-all bg-gray-50 hover:bg-gray-100"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Phone className="text-gray-400" />
//                   <div>
//                     <h3 className="font-medium">{user.name}</h3>
//                     <p className="text-sm text-gray-500">{user.email}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleSendInvite(user.id)}
//                   className={`${
//                     user.inviteSent
//                       ? "bg-gray-400"
//                       : "bg-blue-500 hover:bg-blue-600"
//                   } text-white py-1 px-3 rounded transition-colors`}
//                   disabled={user.inviteSent}
//                 >
//                   {user.inviteSent ? "Invite Sent" : "Send Invite"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Call Information and Keywords Section */}
//       <div className="lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
//         <div className="flex flex-col h-full">
//           <KeywordsAndSuggestions conversation={null} />
//         </div>
//         <div className="flex flex-col h-full">
//           <CallerInformation
//             activeCall={null}
//             customerVideoSrc={null}
//             salespersonVideoSrc={null}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CallList;