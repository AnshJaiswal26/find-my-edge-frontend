import { useLocation, useNavigate } from "react-router-dom";
import { useUIStore } from "@shared/stores";
import { PAGE_CONFIG } from "@config/pages/pageConfig";
import { PAGE_LIST } from "@config/pages/pageKeys";

const Profile = () => {
  const selectedAvatar = useUIStore((s) => s.selectedAvatar);
  const username = useUIStore((s) => s.username);

  return (
    <div
      className="
        flex items-center gap-3
        border-b border-(--border-muted)
        mt-5 px-4 py-3
        hover:bg-(--hover)
        transition-colors
      "
    >
      <img
        src={selectedAvatar}
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer"
      />
      <h3 className="font-(--font-faimily-base)">{username}</h3>
    </div>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const removeToast = useUIStore((s) => s.removeToast);
  const setPageName = useUIStore((s) => s.setPageName);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={toggleSidebar}
        className="
          fixed inset-0
          bg-gray/40
          backdrop-blur-[2px]
          z-1000
          opacity-0 pointer-events-none
          transition-opacity duration-300
          sidebar-open:opacity-100
          sidebar-open:pointer-events-auto
        "
      />

      {/* Sidebar */}
      <aside
        className="
          fixed top-0 left-0
          h-full
          w-60
          bg-(--surface-muted)
          text-(--text)
          border-r border-(--border-muted)
          shadow-[0_0_10px_rgba(0,0,0,0.1)]
          z-[10000]
          transition-transform duration-200 
          -translate-x-full
          sidebar-open:translate-x-0
          overflow-y-auto
        "
      >
        <Profile />

        {/* Menu */}
        <div
          className="
            flex flex-col gap-4
            p-2.5
            h-[84vh] min-h-[300px]
            overflow-y-auto
          "
        >
          {PAGE_LIST.map((pageKey, index) => {
            const item = PAGE_CONFIG[pageKey];
            const isActive = location.pathname === item.route;

            return (
              <button
                key={index}
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
                    setPageName(item.label);
                  }
                  removeToast("reset");
                  toggleSidebar();
                }}
                className={`
                  w-full
                  flex items-center gap-2
                  text-[0.85rem] font-light
                  px-2.5 py-[0.45rem]
                  rounded
                  transition-colors duration-100
                  text-(--text-muted)
                  ${
                    isActive
                      ? "bg-(--cyan) border-(--cyan) text-white pointer-events-none"
                      : "hover:bg-(--hover) hover:border-(--hover)"
                  }
                `}
              >
                <item.icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
