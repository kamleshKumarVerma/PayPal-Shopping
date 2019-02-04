import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

declare const paypal:any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

	/* Initial products on cart */
	products: any = [
	    {
	      name: 'Hat',
	      description: 'Brown hat.',
	      quantity: '1',
	      price: '0.01',
	      currency: 'USD'
	    },
	    {
	      name: 'Hand bag',
	      description: 'Black handbag.',
	      quantity: '1',
	      price: '16',
	      currency: 'USD'
	    }
	];

	/* subtotal of the products which available on cart */
	subTotal: number = 0;

	shippingAddressForm: FormGroup;

	constructor(private formBuilder: FormBuilder, private router: Router) { }

	ngOnInit() {
		this.init();
		this.generateForm();
	}

	generateForm() {
		this.shippingAddressForm = this.formBuilder.group({
		    "recipient_name": ["Kamlesh verma", [Validators.required]],
		    "line1":["4th Floor", [Validators.required]],
		    "line2":["Unit #34", [Validators.required]],
		    "city":["San Jose", [Validators.required]],
		    "country_code": ["US", [Validators.required]],
		    "postal_code": ["95131", [Validators.required]],
		    "phone": ["011862212345678", [Validators.required]],
		    "state": ["CA", [Validators.required]]
		});
	}

	ngAfterContentChecked()  {
		/* Update the sub-total when quantity is changed on cart */
		this.subTotal = this.products.reduce((acc: number, product: any) => {
			acc = acc + (product.price * product.quantity);
			return acc;
		}, 0);
	}

	init() {
		/* Render the PayPal button */
		paypal.Button.render({
			env: 'sandbox', // sandbox | production
			style: {
				layout: 'vertical',  // horizontal | vertical
				size:   'medium',    // medium | large | responsive
				shape:  'rect',      // pill | rect
				color:  'gold'       // gold | blue | silver | white | black
			},

			/* Specify allowed and disallowed funding sources
			
			Options:
			 - paypal.FUNDING.CARD
			 - paypal.FUNDING.CREDIT
			 - paypal.FUNDING.ELV */

			funding: {
				allowed: [
					paypal.FUNDING.CARD,
					paypal.FUNDING.CREDIT
				],
				disallowed: []
			},

			/* Enable Pay Now checkout flow (optional) */
			commit: true,

			client: {
				sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
				production: '<insert production client id>'
			},

			/* Setting up a payment */

			payment: (data, actions) => {
			  return actions.payment.create({
			    transactions: [{
			      amount: {
			        total: this.subTotal,
			        currency: 'USD',
			        details: {
			          subtotal: this.subTotal			        }
			      	},
			      	description: 'The payment transaction description.',
			      	custom: '90048630024435',
			      	payment_options: {
			       		allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
			      	},
			      	soft_descriptor: 'ECHI5786786',
			      	item_list: {
			        	items: this.products,
			        	shipping_address: this.shippingAddressForm.value
			      	}
			    }],
			    note_to_payer: 'Contact us for any questions on your order.'
			  });
			},

			onAuthorize:  (data, actions) => {
				return actions.payment.execute()
					.then( (data) => {
						/* Redirecting to the payment-done page after successfully payment */
						this.router.navigate(['payment-done/' + data.id]);
				});
			}
		}, '#paypal-button-container');
	}

	removeProduct(productName) {
		this.products = this.products.filter( (item: any) => {
            return item.name !== productName;
        });
	}

}

