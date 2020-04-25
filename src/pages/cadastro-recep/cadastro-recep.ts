
/**************************************************** 
// ESSE CADASTRO É DE USO EXCLUSIVO PARA IMPLANTAÇÃO
****************************************************/

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Usuario } from '../../app/Modelo/usuario';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, Validators } from '@angular/forms';
import { HomeAdmPage } from '../home-adm/home-adm';

@IonicPage()
@Component({
  selector: 'page-cadastro-recep',
  templateUrl: 'cadastro-recep.html',
})
export class CadastroRecepPage {

  usuario: Usuario = {
    prontuario: '',
    nome: '', 
    sobrenome: '',
    dtNasc: '',
    login: '',
    senha: '12345678',
    tipo: 'Recepcionista'
  }
  
  keyUsuario;
  usuarioSelecionado = [];
  user = [];
  usuarioKey;
  temUsuario = false;
  refUser = firebase.database().ref('/usuario/');
  public usuarioForm: any;
  messageNome = '';
  erroNome = false;
  messageSobrenome = '';
  erroSobrenome = false;

  constructor( 
    public navCtrl: NavController, 
    public navParams: NavParams,
    // private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public dbService: FirebaseServiceProvider,
    public db: AngularFireDatabase,
    public fb: FormBuilder
    ) {
      this.usuarioForm = fb.group({
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required]
      })
  }
  

  ionViewDidLoad() {

  }

  selecionaUsuario(usuarioNome: any, usuarioSobrenome: any){
    this.user = [];
    const snapshotToArrayUsuarioProntuario = snapshot => {
      snapshot.forEach(element => {
        let usuarioBanco = element.val();
        usuarioBanco.key = element.key;
        if(usuarioBanco.tipo == 'Recepcionista'){
          if(usuarioNome == usuarioBanco.nome && usuarioSobrenome == usuarioBanco.sobrenome){
            this.user = usuarioBanco;
            this.usuarioKey = usuarioBanco.key;
            this.temUsuario = true;
          }
        }
      });
      return this.user;
    }
    this.refUser.on('value', resp => {
      this.usuarioSelecionado = [];
      this.temUsuario = false;
      this.usuarioSelecionado = snapshotToArrayUsuarioProntuario(resp);
    })
  }

  
  addUsuario(usuario: Usuario){
    const loading = this.loadingCtrl.create({
      content: 'Cadastrando...'
    }); 
    this.selecionaUsuario(usuario.nome, usuario.sobrenome);
    if(!this.temUsuario){
      let {nome, sobrenome} = this.usuarioForm.controls;
      if(!this.usuarioForm.valid){
        if(!nome.valid){
          this.erroNome = true;
          this.messageNome = 'NOME DEVE SER PREENCHIDO';
        }else{
          this.messageNome = '';
        }
        if(!sobrenome.valid){
          this.erroSobrenome = true;
          this.messageSobrenome = 'SOBRENOME DEVE SER PREENCHIDO';
        }else{
          this.messageSobrenome = '';
        }
      }else{
        this.usuario.login = this.dbService.geraLogin(this.usuario.nome, this.usuario.sobrenome);
        this.keyUsuario = this.dbService.cadastraUsuario(this.usuario);
        loading.present().then((data) => {loading.dismiss(); 
          const alert = this.alertCtrl.create({
              title:this.usuario.nome + ' ' + this.usuario.sobrenome,
              subTitle: 'LOGIN: '+this.usuario.login, 
              message: 'SENHA PROVISÓRIA: '+this.usuario.senha,
              buttons: ['Ok']});
            alert.present().then(r => this.navCtrl.setRoot(HomeAdmPage))})
          .catch((error) => {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              subTitle: 'Cadastro de recepcionista falhou',
              message: 'Tente novamente',
              buttons: ['Ok']});
            alert.present();})
      
      }
    }else{
      const alert = this.alertCtrl.create({
        subTitle: 'Cadastro de recepcionista falhou',
        message: 'Já existe um recepcionista cadastrado com esse nome',
        buttons: ['Ok']});
      alert.present();
    }
    
  }

  voltar(){
    this.navCtrl.setRoot(HomeAdmPage);
  }

}
