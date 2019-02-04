import { NgModule } from '@angular/core';
import { Routes, Route, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { PaymentDoneComponent } from './payment-done/payment-done.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const fallBackRoute: Route = {
  path: "**",
  component: PageNotFoundComponent
}

const indexRoute: Route = {
  path: "",   redirectTo: "/home", pathMatch: "full"
}

const routes: Routes = [
	{path: "home", component: HomeComponent},
	{path: "cart", component: CartComponent},
	{path: "payment-done", component: PaymentDoneComponent},
	indexRoute,
    fallBackRoute
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
