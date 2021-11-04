import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  

  currentTheme = 'default';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private authService: NbAuthService,
              private router: Router,
              private route: ActivatedRoute,
             ) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

      this.authService.onTokenChange().pipe(takeUntil(this.destroy$)).subscribe((r:any)=>{
        this.user=r.payload;
      })
      this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
      

    
    

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }



  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  onContecxtItemSelection(title) {
   
    if(title==='Log out') {
      this.authService.logout('google')
      .pipe(take(1))
      .subscribe((authResult: NbAuthResult) => {
        this.router.navigate(['/auth/login'], { relativeTo: this.route });
      });
    }
  }
}
