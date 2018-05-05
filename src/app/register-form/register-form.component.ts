import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { UserModel } from '../../models/user';
import { SocialInformationModel } from '../../models/socialInformation'
import { and } from '@angular/router/src/utils/collection';
import { InputValidatorService } from '../input-validator.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  valuePassword = '';
  valueInvalidPassword = '';
  valueUsername = '';
  valueEmail = '';
  valueInvalidInput = '';
  password = '';
  confirmPassword = '';
  username = '';
  statusPassword = false;
  statusValidPassword = false;
  statusUsername = false;
  statusEmail = false;
  danger = '#d9534f';
  sucess = '#5cb85c';

  constructor(private router: Router,
              private requester: RequestsService,
              private validator: InputValidatorService,
  ) { }

  ngOnInit() {
  }

  registerUser(e) {
    e.preventDefault();
    let user: UserModel;

    user = {
      username: e.target.elements[0].value,
      first_name: e.target.elements[1].value,
      last_name: e.target.elements[2].value,
      password: e.target.elements[3].value,
      email: e.target.elements[5].value,
      social_information: {
        state: e.target.elements[7].value,
        city: e.target.elements[8].value,
        income: e.target.elements[9].value,
        education: e.target.elements[10].value,
        job: e.target.elements[11].value,
        birth_date: e.target.elements[12].value
      }
     };
    // TODO - adicionar validação de criação. Checar http status code = 201.
    // AINDA é TODO /\
    this.requester.postUser(user).subscribe(response => {
      const statusUser = response.status;
      console.log('STATUS CODE RETURNED ON USER: ' + statusUser);

        if (this.requester.didSucceed(statusUser)) {
          this.router.navigate(['']);
        }
    });

  }

  clickFirstButton() {
       if (this.validator.statusPassword && this.validator.statusUsername && this.validator.statusEmail && this.validator.statusValidPassword) {
            document.getElementById('firstPart').style.display = 'none';
            document.getElementById('secondPart').style.display = 'block';
            document.querySelector('#registerBtn').removeAttribute('disabled');
       } else {
        document.getElementById('alert-invalid-inputs').style.display = 'block';
        this.valueInvalidInput = 'Por favor, preencha os campos obrigatórios';
        if (!this.statusPassword) {
          this.validator.borderColor('password', this.danger);
          this.validator.borderColor('confirm-password', this.danger);
        } else {
          this.validator.borderColor('password', this.sucess);
          this.validator.borderColor('confirm-password', this.sucess);
        }

        if (!this.statusUsername) {
          this.validator.borderColor('username', this.danger);
        } else {
          this.validator.borderColor('username', this.sucess);
        }

        if (!this.statusEmail) {
          this.validator.borderColor('email', this.danger);
        } else {
          this.validator.borderColor('email', this.sucess);
        }
       }
 }

 clickReturnButton() {
      document.getElementById('firstPart').style.display = 'block';
      document.getElementById('secondPart').style.display = 'none';
      document.querySelector('#registerBtn').setAttribute('disabled', 'disabled');
}

}
