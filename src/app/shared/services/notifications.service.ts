import {Injectable} from '@angular/core';
import {ToasterService} from 'angular2-toaster';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(
    private toasterService: ToasterService,
  ) {
  }

  public showPopup(type: string, title: string, message: string): void {
    this.toasterService.pop(type, title, message);
  }
}
