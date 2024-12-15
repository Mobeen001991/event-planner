// Angular import
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { CurrentUser } from 'src/app/model/user.data';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavRightComponent {
  currentUser = this.authService.currentUser
  constructor(private authService: AuthService, private router:Router){
    
    console.log(this.currentUser)
  }
  async logout(){
   await this.authService.logout()
  //  this.router.navigate(['/auth/login'])

  }
}
