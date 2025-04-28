"use client";

import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiOfficeBuilding,
  HiCalendar,
  HiInformationCircle,
  HiGlobe,
  HiSearch,
  HiUser,
  HiUserCircle,
} from "react-icons/hi";
import { HiWrench } from "react-icons/hi2";

export default function AdminSidebar() {
  return (
    <Sidebar className="m-3 h-full w-78">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/admin/admins" icon={HiInformationCircle}>
            Admins
          </SidebarItem>
          <SidebarItem href="/admin/users" icon={HiUser}>
            Users
          </SidebarItem>
          <SidebarItem href="/admin/customers" icon={HiUserCircle}>
            Customers
          </SidebarItem>
          <SidebarItem href="/admin/properties" icon={HiOfficeBuilding}>
            Properties
          </SidebarItem>
          <SidebarItem href="/admin/bookings" icon={HiCalendar}>
            Bookings
          </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem href="/admin/propertyTypes" icon={HiWrench}>
            Property Types
          </SidebarItem>
          <SidebarCollapse label="Locations" icon={HiGlobe}>
            <SidebarItem href="/admin/areas" icon={HiInformationCircle}>
              Areas
            </SidebarItem>
            <SidebarItem href="/admin/cities" icon={HiInformationCircle}>
              Cities
            </SidebarItem>
            <SidebarItem href="/admin/states" icon={HiInformationCircle}>
              States
            </SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse label="Property Info Options" icon={HiSearch}>
            <SidebarItem href="/admin/activities" icon={HiInformationCircle}>
              Activities
            </SidebarItem>
            <SidebarItem href="/admin/amenities" icon={HiInformationCircle}>
              Amenities
            </SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
