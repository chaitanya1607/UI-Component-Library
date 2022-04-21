import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { ServiceLocator } from '@utilities/angular-web-utils';
import { Storage } from '@ionic/storage-angular';
import { Router, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

function initServiceLocator(injector: Injector) {
  return () => (ServiceLocator.injector = injector);
}

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    RouterModule.forRoot([])
  ],
  exports: [],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initServiceLocator,
      multi: true,
      deps: [Injector],
    },
    Storage,
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
})
export class SharedModule {}
