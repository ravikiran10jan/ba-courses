import { getNavigation } from "@/lib/content";

const nav = getNavigation();

export const publicNavLinks = nav.publicLinks;
export const userMenuItems = nav.userMenu;
export const footerLinks = nav.footerLinks;
export const adminNavItems = nav.adminNav;
