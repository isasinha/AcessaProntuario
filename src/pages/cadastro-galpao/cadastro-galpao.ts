import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { HomeAdmPage } from '../home-adm/home-adm';
import { Galpao, Unidade, snapshotToArrayUnidade } from '../../app/Modelo/galpao';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-cadastro-galpao',
  templateUrl: 'cadastro-galpao.html',
})
export class CadastroGalpaoPage {

  unidade: Unidade={
    nomeUnidade: null,
    unidadesGalpao: null, 
    endereco: null,
    telefone: null
  };
  galpao: Galpao = {
    nomeGalpao: null,
    largura: null,
    altura: null,
    profundidade: null,
    imagem: null
  };
  unidades = [];
  ref = firebase.database().ref('/unidade');
  keyU;
  qtdeGalpoes = null;
  galpoes = [];
  nomeGalpao;
  nomesGalpao = [];
  exemploImg =  'assets/imgs/exemploImg.jpg';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public dbService: FirebaseServiceProvider,
    public db: AngularFireDatabase,
    private camera: Camera
    ) {
      if(navParams.get('unidadeKey') == '')
        this.keyU = null;
      else
        this.keyU = navParams.get('unidadeKey');
  }

  ionViewDidLoad() {
    this.ref.on('value', resp => {
      this.unidades = snapshotToArrayUnidade(resp);
    })
  }

  geraArrayGalpoes(qtdeGalpoes){
    var cont= 0;
    this.galpoes = [];
    while(qtdeGalpoes > cont){
      this.galpoes.push(this.galpao);
      cont = cont + 1;
    }
  }


  addGalpao(nomesGalpao: any, galpao: Galpao, novaKey: any){
    this.dbService.cadastraGalpaoInicial(galpao, nomesGalpao, novaKey);
    this.exibeAlerta();
  }

  addGalpaoUni(nomesGalpao:any, galpao: Galpao){
    this.dbService.cadastraGalpaoInicial(galpao, nomesGalpao, this.keyU);
    this.exibeAlerta();
  }

  exibeAlerta(){
    const loading = this.loadingCtrl.create({
      content: 'Cadastrando...'
    });
    loading.present().then((data) => { loading.dismiss(); const alert = this.alertCtrl.create({
      subTitle: 'Galpão cadastrado com sucesso!',
      message: 'Deseja cadastrar outro galpão?',
      buttons: [{
        text: 'Não',
        handler: () => {this.navCtrl.setRoot('HomeAdmPage')}
      },
      {
        text: 'Sim',
        handler: () => {this.navCtrl.setRoot(this.navCtrl.getActive().component), this.qtdeGalpoes = ''}
      }]});
    alert.present()
  })
  .catch((error) => {loading.dismiss(); const alert = this.alertCtrl.create({
      subTitle: 'Cadastro de galpão falhou',
      message: error.message,
      buttons: ['Ok']});
    alert.present();})
  }

  tirarFoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetWidth: 750,
      targetHeight: 625
    }

    this.camera.getPicture(options).then((imageData) => {
      this.galpao.imagem = 'data:image/jpeg;base64,' + imageData; 
      this.exemploImg = this.galpao.imagem;
    }, (err) => {
      //erro aqui
    });
  }


  voltar(){
    this.navCtrl.setRoot(HomeAdmPage)
  }

}