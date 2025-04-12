"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiOfficeBuilding,
  HiCalendar,
  HiInformationCircle,
} from "react-icons/hi";

export default function AdminSidebar() {
  return (
    <Sidebar aria-label="Default sidebar example" className="m-3 h-full">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/admin/properties" icon={HiOfficeBuilding}>
            Properties
          </SidebarItem>
          <SidebarItem href="#" icon={HiCalendar}>
            Bookings
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem href="/admin/propertyTypes" icon={HiInformationCircle}>
            Property Types
          </SidebarItem>
          <SidebarItem href="/admin/areas" icon={HiInformationCircle}>
            Areas
          </SidebarItem>
          <SidebarItem href="/admin/cities" icon={HiInformationCircle}>
            Cities
          </SidebarItem>
          <SidebarItem href="/admin/states" icon={HiInformationCircle}>
            States
          </SidebarItem>
          <SidebarItem href="/admin/activities" icon={HiInformationCircle}>
            Activities
          </SidebarItem>
          <SidebarItem href="/admin/amenities" icon={HiInformationCircle}>
            Amenities
          </SidebarItem>
          <SidebarItem href="/admin/admins" icon={HiInformationCircle}>
            Admins
          </SidebarItem>
          <SidebarItem href="/admin/users" icon={HiInformationCircle}>
            Users
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
