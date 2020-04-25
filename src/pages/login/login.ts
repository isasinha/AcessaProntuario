import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { HomeUserPage } from '../home-user/home-user';
import { HomeRecepPage } from '../home-recep/home-recep';
import { RedefinirSenhaPage } from '../redefinir-senha/redefinir-senha';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Usuario } from '../../app/Modelo/usuario';
import * as firebase from 'firebase';
import { HomeAdmPage } from '../home-adm/home-adm';
import { HomeMedicoPage } from '../home-medico/home-medico';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  usuario: Usuario = {
    prontuario: '',
    nome: '',
    sobrenome: '',
    dtNasc: '',
    login: '',
    senha: '',
    tipo: ''
  }
  usuarioSenha:string = '';
  usuarioTipo:string = '';
  usuarioNome:string = '';
  usuarioLogin:string = '';
  usuarioKey = '';
  usuarioSobrenome = '';
  usuarioData=[];
  ref = firebase.database().ref('/usuario/');

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController,
    public dbService: FirebaseServiceProvider
    ) { 
  }

  ionViewDidLoad() {

  }

  login(usuario: Usuario){

    const snapshotToArrayUsuarioLogin = snapshot => {
      let returnArray = [];
      snapshot.forEach(element => {
        let usuarioBanco = element.val();
        usuarioBanco.key = element.key;
        if((usuario.login).toUpperCase() == usuarioBanco.login){
          returnArray.push(usuarioBanco.senha);       //posição 0 = senha
          returnArray.push(usuarioBanco.tipo);        //posição 1 = tipo de usuário
          returnArray.push(usuarioBanco.nome);        //posição 2 = nome
          returnArray.push(usuarioBanco.login);       //posição 3 = login
          returnArray.push(usuarioBanco.key);         //posição 4 = key
          returnArray.push(usuarioBanco.sobrenome);   //posição 5 = sobrenome
        } 
      });
      return returnArray;
    }
    this.ref.on('value', resp => {
      this.usuarioData = [];
      this.usuarioSenha = '';
      this.usuarioTipo = '';
      this.usuarioData = snapshotToArrayUsuarioLogin(resp);
      this.usuarioSenha = this.usuarioData[0];
      this.usuarioTipo = this.usuarioData[1];
      this.usuarioNome = this.usuarioData[2];
      this.usuarioLogin = this.usuarioData[3];
      this.usuarioKey = this.usuarioData[4];
      this.usuarioSobrenome = this.usuarioData[5];

    })

    if(usuario.login == '' || usuario.senha == ''){

      const alert = this.alertCtrl
      .create({
        subTitle:'Login falhou', 
        message: "Login e senha devem estar preenchidos", 
        buttons:['Ok']
      });
      alert.present()
    }else{
      const loading = this.loadingCtrl.create({
        content: 'Logando...',
        duration: 100
      });
      loading.present().then( () => {
        if(this.usuarioData.length <= 0){
          const alert = this.alertCtrl
          .create({
            subTitle:'Login falhou', 
            message: "Verifique login e senha e tente novamente", 
            buttons:['Ok']
          });
          alert.present()
        }else{
          if(usuario.senha == this.usuarioSenha){
            if (this.usuarioSenha == '12345678'){
              this.navCtrl.push(RedefinirSenhaPage, {
                nome: this.usuarioNome
              })
            }else{
              if(this.usuarioTipo == 'Administrador'){
                this.navCtrl.push(HomeAdmPage, {
                  nome: this.usuarioNome
                })
              }else if(this.usuarioTipo == 'Recepcionista'){
                this.navCtrl.push(HomeRecepPage, {
                  nome: this.usuarioNome
                })
              }else if(this.usuarioTipo == 'Medico'){
                this.navCtrl.push(HomeMedicoPage, {
                  nome: this.usuarioNome,
                  loginMedico: this.usuarioLogin
                })
              }else if(this.usuarioTipo == 'Usuario'){
                this.navCtrl.push(HomeUserPage, {
                  nome: this.usuarioNome,
                  sobrenome: this.usuarioSobrenome,
                  usuarioKey: this.usuarioKey
                })
              }   
            }  
          }else{
            const alert = this.alertCtrl
            .create({
              subTitle:'Login falhou', 
              message: "Verifique login e senha e tente novamente", 
              buttons:['Ok']
            });
            alert.present()
          }
        }  
      }
    )}
  }
} 
