import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private updateSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  update$: Observable<string> = this.updateSubject.asObservable();

  constructor(
    private router: Router) {
    }

  updateMessage(message: string) {     
      console.log("EERRER",message)   
      this.updateSubject.next(message);
      this.router.navigate(['error']);
  }
}
