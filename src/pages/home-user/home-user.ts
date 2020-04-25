import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { Informe } from '../../app/Modelo/informe';
import { DetalheInformePage } from '../detalhe-informe/detalhe-informe';

@Component({
  selector: 'page-home-user',
  templateUrl: 'home-user.html'
})
export class HomeUserPage {

nomeUsuario;
sobrenomeUsuario;
usuarioKey;
inform = [];
refInforme = firebase.database().ref('/informe/');
informes = [];
informeSelecionado = []
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
opcoes: Array<{item: string, informe: Informe, endereco: any}>

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
      this.nomeUsuario = navParams.get('nome');
      this.sobrenomeUsuario = navParams.get('sobrenome');
      this.usuarioKey = navParams.get('usuarioKey');

    this.inform = [];
    const snapshotToArrayUsuarioProntuario = snapshot => {
      snapshot.forEach(element => {
        let informeBanco = element.val();
        informeBanco.key = element.key;
        if(informeBanco.usuarioKey == this.usuarioKey){
            this.inform.push(informeBanco);
        }
      });
      return this.inform;
    }
    this.refInforme.on('value', resp => {
      this.informes=[]
      this.informes = snapshotToArrayUsuarioProntuario(resp);
    })
}


opcaoEscolhida(informe: any){
  this.navCtrl.setRoot(DetalheInformePage,{
    informe: informe, 
    nomeUsuario: this.nomeUsuario, 
    sobrenomeUsuario: this.sobrenomeUsuario}); 
}

}
