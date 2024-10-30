import Sidebar from "./components/common/Sidebar";
import CallList from "./components/SalesPersonDashBoard/CallList";

export default function Dashboard() {
  document.title = "DynamicDialers | Dashboard";
  
  return (
    <div className="flex min-h-screen max-h-screen flex-col lg:flex-row bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm px-8 py-4 border-b-2">
          <h1 className="text-2xl font-bold text-gray-800">DynamicDialers</h1>
        </header>
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <CallList />
        </main>
      </div>
    </div>
  );
}
