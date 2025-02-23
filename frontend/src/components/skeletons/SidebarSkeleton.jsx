import {Users} from "lucide-react";

const SidebarSkeleton = () => {

  const skeletonContacts =Array(5).fill(null);

  return (
    <aside className="h-full w-350 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6"></Users>
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>
      
      <div className="overflow-y-auto w-full p-3 flex flex-col items-center gap-3">
        {skeletonContacts.map((_,idx)=>(

        <div key={idx} className="w-full p-3 flex items-center gap-3">
          <div className=" relative mx-auto lg:mx-0">
            <div className="skeleton size-12 rounded-full"></div>
          </div>

          <div className="hidden lg:block text-left min-w-0 flex-1">
            <div className="skeleton h-4 w-32 mb-2"></div>
            <div className="skeleton h-3 w-16"></div>
          </div>
        </div>
        ))}
      </div>
    </aside>
  )
}

export default SidebarSkeleton;
