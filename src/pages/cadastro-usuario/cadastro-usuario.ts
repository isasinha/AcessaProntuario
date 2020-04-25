import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { HomeRecepPage } from '../home-recep/home-recep';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Usuario } from '../../app/Modelo/usuario';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-cadastro-usuario',
  templateUrl: 'cadastro-usuario.html',
})
export class CadastroUsuarioPage {

  usuario: Usuario = {
    prontuario: '',
    nome: '', 
    sobrenome: '',
    dtNasc: '',
    login: '',
    senha: '',
    tipo: 'Usuario'
  }
  
  keyUsuario;
  usuarioSelecionado = [];
  dataNasc = [];
  show = false;
  user = [];
  usuarioKey;
  temUsuario = false;
  refUser = firebase.database().ref('/usuario/');
  public usuarioForm: any;
  messageNome = '';
  erroNome = false;
  messageSobrenome = '';
  erroSobrenome = false;
  messageDtNasc = '';
  erroDtNasc = false;
  meioNomeArray;
  meioSobrenomeArray;
  meioNome;
  meioSobrenome;
  fimLogin;
  num;


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
        sobrenome: ['', Validators.required],
        dtNasc: ['', Validators.required],
      })
  }
  

  ionViewDidLoad() {

  }

  selecionaUsuario(usuarioProntuario: any){
    this.user = [];
    const snapshotToArrayUsuarioProntuario = snapshot => {
      snapshot.forEach(element => {
        let usuarioBanco = element.val();
        usuarioBanco.key = element.key;
        if(usuarioBanco.tipo == 'Usuario'){
          if(usuarioProntuario == usuarioBanco.prontuario){
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
    let {nome, sobrenome, dtNasc} = this.usuarioForm.controls;
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
      if(!dtNasc.valid){
        this.erroDtNasc = true;
        this.messageDtNasc = 'DATA DE NASCIMENTO DEVE SER PREENCHIDA';
      }else{
        this.messageDtNasc = '';
      }
    }else{
      this.usuario.dtNasc = this.dbService.converteData(this.usuario.dtNasc);
      this.usuario.senha = this.dbService.geraRandom();
      this.usuario.login = this.dbService.geraLogin(this.usuario.nome, this.usuario.sobrenome);
      this.keyUsuario = this.dbService.cadastraUsuario(this.usuario);
      loading.present().then((data) => {loading.dismiss(); 
        const alert = this.alertCtrl.create({
            title:this.usuario.nome + ' ' + this.usuario.sobrenome,
            subTitle: 'LOGIN: '+this.usuario.login, 
            message: 'SENHA: '+this.usuario.senha,
            buttons: ['Ok']});
          alert.present().then(r => this.navCtrl.setRoot(HomeRecepPage))})
        .catch((error) => {
          loading.dismiss();
          const alert = this.alertCtrl.create({
            subTitle: 'Cadastro de paciente falhou',
            message: 'Tente novamente',
            buttons: ['Ok']});
          alert.present();})
    
    }
  }

  voltar(){
    this.navCtrl.setRoot(HomeRecepPage);
  }

}
