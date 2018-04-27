import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import { PropositionModel } from '../../models/proposition';

@Component({
  selector: 'app-minhas-pls',
  templateUrl: './minhas-pls.component.html',
  styleUrls: ['./minhas-pls.component.css']
})
export class MinhasPlsComponent implements OnInit {

  numberPLsVoted: number;
  pages: Array<number> = [1];
  itemsPerPage = 10;

  proposition: Array<PropositionModel> = [
    {
      proposition_id: 0,
      proposition_type: '',
      proposition_type_initials: '',
      number: 0,
      year: 0,
      abstract: '',
      processing: '',
      situation: '',
      url_full: ''
    }
  ];

  constructor(private requester: RequestsService) { }

  ngOnInit() {
    this.numberPLsVoted = 1;
    this.propositions(0);
  }

  propositions(offset: number) {
    this.pages = [1];
    this.requester.getVotedProposition((offset - 1) * this.itemsPerPage).subscribe( response => {
      this.proposition = response['results'];
      this.numberPLsVoted = response['count'];
      for (let i = 2; i <= this.numberPLsVoted / this.itemsPerPage; i++) {
        this.pages.push(i);
      }
      console.log(this.proposition);
      console.log(this.numberPLsVoted);
    });
  }

}
