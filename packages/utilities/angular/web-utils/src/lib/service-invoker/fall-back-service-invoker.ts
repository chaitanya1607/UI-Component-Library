import { Inject } from '@angular/core';
import { ServiceInvoker } from './service-invoker.service';

@Inject({
  providedIn : 'root'
})
export class FallBackServiceInvoker extends ServiceInvoker {

}
