import {Component} from '@angular/core';
import {ToasterConfig} from 'angular2-toaster';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public config: ToasterConfig =
    new ToasterConfig({
      animation: 'flyRight',
      positionClass: 'toast-bottom-right',
      limit: 3,
      timeout: 2500,
    });
}
