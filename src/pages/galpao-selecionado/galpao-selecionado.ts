import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-galpao-selecionado',
  templateUrl: 'galpao-selecionado.html',
})
export class GalpaoSelecionadoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  voltar(){
    this.navCtrl.setRoot(HomePage)
  }

}
