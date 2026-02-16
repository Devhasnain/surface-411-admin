import { MapPinIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";

import { BoltIcon, GridIcon, GroupIcon, MailIcon, PageIcon, TableIcon, UserCircleIcon, } from "../icons";


export type NavItem = {
    id?: string;
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};
export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <UserCircleIcon />,
    name: "Profile",
    path: "/profile",
  },
  {
    icon: <GroupIcon />,
    name: "Users",
    path: "/users",
  },
  {
    icon: <GroupIcon />,
    name: "Customers",
    path: "/customers",
  },
  {
    id:"mineral",
    icon: <RectangleGroupIcon />,
    name: "Surface Owners",
    subItems: [
      { name: "Add New", path: "/add-mineral" },
      { name: "List", path: "/mineral" },
    ],
  },
  {
    icon: <MapPinIcon />,
    name: "Locations",
    path: "/locations",
  },
  {
    icon: <BoltIcon />,
    name: "Plans",
    path: "/plans",
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Faqs", path: "/faqs" },
      { name: "Terms & Conditions", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy-policy" },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Contact",
    path: "/contact",
  },
  {
    icon: <MailIcon />,
    name: "News Letters",
    path: "/newsletters",
  },
]