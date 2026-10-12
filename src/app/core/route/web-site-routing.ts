import { Routes } from "@angular/router";
import { ProductComponent } from "../../module/web-site/product/product.component";
import { RateComponent } from "../../module/web-site/rate/rate.component";
import { DocumentationComponent } from "../../module/web-site/documentation/documentation.component";

export default [

  {
    path: '',
    redirectTo: 'product',
    pathMatch: 'full'
  },
  {
    path: 'product',
    component: ProductComponent,
    data: { title: 'TNB SmsGateway — Accueil' }
  },
  {
    path: 'rate',
    component: RateComponent,
    data: { title: 'TNB SmsGateway — Tarifs' }
  },
  {
    path: 'documentation',
    component: DocumentationComponent,
    data: { title: 'TNB SmsGateway — Documentation' }
  }

] as Routes;
