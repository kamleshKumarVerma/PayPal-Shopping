import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-done',
  templateUrl: './payment-done.component.html',
  styleUrls: ['./payment-done.component.scss']
})
export class PaymentDoneComponent implements OnInit {

	private subscribeForParams: any;
	transactionId: string = "";

	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
		this.subscribeForParams = this.route.params.subscribe(params => {
			this.transactionId = params['transactionId'];
	    });
	}

	ngOnDestroy() {
		this.subscribeForParams.unsubscribe();
	}

}
