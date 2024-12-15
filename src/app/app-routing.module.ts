import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
      },
  
      
      
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      },
      {
        path: 'create-event',
        canActivate: [AuthGuard], 
        loadComponent: () => import('./pages/admin/create-event/create-event.component')
      },
      {
        path: 'edit-event/:id',
        canActivate: [AuthGuard], 
        loadComponent: () => import('./pages/admin/edit-event/edit-event.component')
      },
      {
        path: 'events',
        canActivate: [AuthGuard], 
        loadComponent: () => import('./pages/admin/event-list/event-list.component').then((s)=>s.EventListComponent)
      },
    
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
