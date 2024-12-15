import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  // {
  //   id: 'page',
  //   title: 'Events',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'Event',
  //       title: 'Events',
  //       type: 'collapse',
  //       icon: 'ti ti-key',
  //       children: [
  //         {
  //           id: 'login',
  //           title: 'Login',
  //           type: 'item',
  //           url: '/guest/login',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'register',
  //           title: 'Register',
  //           type: 'item',
  //           url: '/guest/register',
  //           target: true,
  //           breadcrumbs: false
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    id: 'elements',
    title: 'Events',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'typography',
        title: 'Events',
        type: 'item',
        classes: 'nav-item',
        url: '/events',
        icon: 'ti ti-typography'
      },
      {
        id: 'color',
        title: 'Add Event',
        type: 'item',
        classes: 'nav-item',
        url: '/create-event',
        icon: 'ti ti-brush'
      },
   
    ]
  },

];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
