import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { Informe } from '../../app/Modelo/informe';

@Component({
  selector: 'page-detalhe-informe',
  templateUrl: 'detalhe-informe.html'
})
export class DetalheInformePage {

informe: Informe = {
  estado: '',
  horaVisita: '',
  prevAlta: '',
  dataAlta: '',
  dataHora: '',
  loginMedico: '',
  outros: '',
  usuarioKey: ''
}
loginMedico;
nomeMedico;
sobrenomeMedico;
nomeUsuario;
sobrenomeUsuario;
medico;
user;
refUser = firebase.database().ref('/usuario/');

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
      this.informe = navParams.get('informe');
      this.nomeUsuario = navParams.get('nomeUsuario'), 
      this.sobrenomeUsuario = navParams.get('sobrenomeUsuario')
      this.loginMedico = this.informe.loginMedico;
       
        const snapshotToArrayUsuarioProntuario = snapshot => {
          snapshot.forEach(element => {
            let usuarioBanco = element.val();
            usuarioBanco.key = element.key;
            if(usuarioBanco.tipo == 'Medico'){
              if(this.loginMedico == usuarioBanco.login){
                this.nomeMedico = usuarioBanco.nome;
                this.sobrenomeMedico = usuarioBanco.sobrenome;
                this.user = this.nomeMedico + " " + this.sobrenomeMedico;
              }
            }
          });
          return this.user;
        }
        this.refUser.on('value', resp => {
          this.medico = '';
          this.medico = snapshotToArrayUsuarioProntuario(resp);
        })
      }

    



}
