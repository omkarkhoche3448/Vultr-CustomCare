import { Home, List, Users, FileText } from "lucide-react";

const adminIcons = [
    { id: 1, name: "Dashboard", Icon: Home },
    { id: 2, name: "Tasks", Icon: List },
    { id: 3, name: "Representatives", Icon: Users },
    { id: 4, name: "Customers", Icon: FileText },
];

export default function AdminSidebar({ selectedIcon, onIconClick }) {
  return (
    <div className="lg:relative lg:h-screen lg:w-24">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:h-full lg:flex-col lg:items-center lg:justify-center lg:border-r-2">
        <svg
          width="85"
          height="700"
          viewBox="0 0 74 464"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-1/2 -translate-y-1/2"
        >
          <path
            d="M35.979 44.5C12.9524 37.7 2.3986 12 0 0V232H73.5V80.5C70.5874 71.3333 59.0056 51.3 35.979 44.5Z"
            fill="#6434F8"
          />
          <path
            d="M35.979 419.5C12.9524 426.3 2.3986 452 0 464L0 232L73.5 232L73.5 383.5C70.5874 392.667 59.0056 412.7 35.979 419.5Z"
            fill="#6434F8"
          />
        </svg>
        <div className="relative z-10 flex h-full w-20 flex-col items-center justify-center space-y-8 py-8">
          {adminIcons.map(({ id, Icon, name }) => (
            <div
              key={id}
              className="relative cursor-pointer"
              onClick={() => onIconClick(id)}
              title={name}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    selectedIcon === id ? "text-teal" : "text-white"
                  } hover:text-teal`}
                />
              </div>
              {selectedIcon === id && (
                <div className="absolute left-[68px] top-1/2 h-12 w-1 -translate-y-1/2 rounded-l bg-teal transition-all duration-300 ease-in-out" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 z-50 w-full bg-white shadow-md lg:hidden">
        <div className="relative flex h-16 items-center justify-around px-4">
          <div className="absolute inset-0 bg-[#6434F8] opacity-90" />
          {adminIcons.map(({ id, Icon, name }) => (
            <div
              key={id}
              className="relative z-10 cursor-pointer"
              onClick={() => onIconClick(id)}
              title={name}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full">
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    selectedIcon === id ? "text-teal" : "text-white"
                  } hover:text-teal`}
                />
              </div>
              {selectedIcon === id && (
                <div className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-t bg-teal transition-all duration-300 ease-in-out" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile content padding */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
