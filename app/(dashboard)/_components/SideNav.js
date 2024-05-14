'use client'

import { ChevronLeft, File, Shield, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SideNav({closeSideBar}) {

    const router = useRouter();

  const menuList = [
    {
      id: 1,
      name: "Upload",
      icon: Upload,
      path: "/upload",
    },
    {
      id: 2,
      name: "Files",
      icon: File,
      path: "/files",
    },
    {
      id: 3,
      name: "Upgrade",
      icon: Shield,
      path: "/upgrade",
    },
  ];

  const[activeIndex, setActiveIndex]=useState();

  return (
    <div className="shadow-sm border-r h-full ">
      <div className="p-10 border-b flex justify-between items-center">
        <Image src="/logo.svg" width={70} height={70} alt="" />
        <ChevronLeft onClick={()=>closeSideBar()} className="text-primary md:hidden"/>
      </div>
      <div className="flex flex-col float-left w-full">
        {menuList.map((item, index) => (
          <button
            className={`flex gap-2 p-4 px-6
                     hover:bg-gray-100 w-full
                     text-gray-500 ${activeIndex==index ? 'bg-blue-50 text-primary':null}`}
            onClick={()=>{setActiveIndex(index); router.push(item.path); closeSideBar()}}
            
            key={index}
          >
            <item.icon />
            <h2>{item.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
