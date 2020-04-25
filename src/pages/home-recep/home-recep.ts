import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CadastroUsuarioPage } from '../cadastro-usuario/cadastro-usuario';

@IonicPage()
@Component({
  selector: 'page-home-recep',
  templateUrl: 'home-recep.html',
})
export class HomeRecepPage {

  nomeUsuario;
  
  constructor( 
    public navCtrl: NavController, 
    public navParams: NavParams,
    ) {
      this.nomeUsuario = navParams.get('nome');
  }

  ionViewDidLoad() {

  }

  novoPaciente(){
    this.navCtrl.push(CadastroUsuarioPage)
  }


}
