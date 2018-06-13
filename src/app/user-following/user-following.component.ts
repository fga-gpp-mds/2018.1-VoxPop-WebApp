import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-user-following',
  templateUrl: './user-following.component.html',
  styleUrls: ['./user-following.component.css']
})
export class UserFollowingComponent implements OnInit {

  term = '';
  tokenValue = '';
  offset = 1;
  itemsPerPage = 36;
  pages = 1;
  loading = true;

  parliamentarians: any = [
    {
      parliamentary: {
        parliamentarian_id: null,
        name: '',
        gender: '',
        federal_unit: '',
        photo: '',
        compatibility: '',
      }
    }
  ];
  auxParliamentarian: any = [
    {
      parliamentary: {
        parliamentarian_id: null,
        name: '',
        gender: '',
        federal_unit: '',
        photo: '',
        compatibility: '',
      }
    }
  ];

  constructor(private requester: RequestsService,
    private cookieService: CookieService,
    private token: TokenService) { }

  ngOnInit() {
    this.tokenValue = this.cookieService.get('token');
    this.token.checkToken(this.tokenValue);
    this.loadPage(1, '');
  }

  loadPage(offset: number, term) {
    this.term = term;
    let req: any;
    term = term.toUpperCase();
    console.log(Number(offset));
    if (offset < 1 || isNaN(Number(offset))) {
      alert('Número de páginas inválido, favor digitar um número positivo');
      return;
    }
    this.offset = Number(offset);
    console.log(this.offset);
    req =  this.requester.getSearchFollowingParliamentarians(this.itemsPerPage, (this.offset - 1) * this.itemsPerPage, term);
    this.handleFollowingParliamentariansResponse(req, this.offset);
  }

  handleFollowingParliamentariansResponse(request, offset) {
    request.subscribe( response => {
      this.auxParliamentarian = response['body']['results'];
      const auxPages = Math.ceil(response['body']['count'] / this.itemsPerPage);
      if (auxPages === 0) {
        alert('A pesquisa não retornou resultados');
        return;
      } else if (this.auxParliamentarian.length <= 0) {
        alert('Número da página inválido, favor digitar entre 1 e ' + this.pages);
        return;
      }
      this.pages = auxPages;
      console.log(this.pages);
      this.parliamentarians = this.auxParliamentarian;
      this.updateButtonsAppearence(this.offset, this.pages);
      this.parliamentarians = this.auxParliamentarian;
      this.loading = false;
      // console.log(this.parliamentarians);
      // console.log(this.pages);
    });
  }

  updateButtonsAppearence(offset, limit) {
    if (offset === 1) {
      document.getElementById('beforeBtn1').style.display = 'none';
      document.getElementById('beforeBtn2').style.display = 'none';
    } else {
      document.getElementById('beforeBtn1').style.display = 'block';
      document.getElementById('beforeBtn2').style.display = 'block';
    }
    if (offset === limit) {
      document.getElementById('afterBtn1').style.display = 'none';
      document.getElementById('afterBtn2').style.display = 'none';
    } else {
      document.getElementById('afterBtn1').style.display = 'block';
      document.getElementById('afterBtn2').style.display = 'block';
    }
    if (this.pages < 2) {
      document.getElementById('pageBtn1').style.display = 'none';
      document.getElementById('pageBtn2').style.display = 'none';
    } else {
      document.getElementById('pageBtn1').style.display = 'block';
      document.getElementById('pageBtn2').style.display = 'block';
    }

  }

}
