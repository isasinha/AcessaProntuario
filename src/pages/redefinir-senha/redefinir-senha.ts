import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Usuario } from '../../app/Modelo/usuario';
import { LoginPage } from '../login/login';
import { FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-redefinir-senha',
  templateUrl: 'redefinir-senha.html',
})
export class RedefinirSenhaPage {

  usuario: Usuario = {
    nome: null,
    sobrenome: null,
    cpf: null,
    email: null,
    senha: null,
    tipo: null
  };

  usuarioSelecionado = [];
  usuarioDados = [];
  user = [];
  temUsuario = false;
  usuarioCpf;
  usuarioKey;
  confirmaSenha;
  refUser = firebase.database().ref('/usuario/');
  public cpfForm: any;
  public senhaForm: any;
  messageCpf = '';
  erroCpf = false;
  messageSenha = '';
  erroSenha = false;
  messageConfirmaSenha = '';
  erroConfirmaSenha = false;
    
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public dbService: FirebaseServiceProvider,
    public db: AngularFireDatabase,
    public fb: FormBuilder
    ) {
      this.cpfForm = fb.group({
        cpf: ['', Validators.required]
      })
      this.senhaForm = fb.group({
        senhaF: ['', Validators.required],
        confirmaSenhaF: ['', Validators.required]
      })
  }

  ionViewDidLoad() {
  }


  selecionaUsuario(usuarioCpf: any){
    this.user = [];
    const snapshotToArrayUsuarioCPF = snapshot => {
      snapshot.forEach(element => {
        let usuarioBanco = element.val();
        usuarioBanco.key = element.key;
        if(usuarioCpf == usuarioBanco.cpf){
          this.user = usuarioBanco;
          this.usuarioKey = usuarioBanco.key;
          this.temUsuario = true;
        }
      });
      return this.user;
    }
    this.refUser.on('value', resp => {
      this.usuarioSelecionado = [];
      this.temUsuario = false;
      this.usuarioSelecionado = snapshotToArrayUsuarioCPF(resp);
    })
  }

  alteraUsuario(usuario: Usuario, confirmaSenha: string){
    const loading = this.loadingCtrl.create({
      content: 'Alterando...'
    });
    let {cpf} = this.cpfForm.controls;
    if(!this.cpfForm.valid){
      if(!cpf.valid){
        this.erroCpf = true;
        this.messageCpf = 'CPF DEVE SER PREENCHIDO';
      }else{
        this.messageCpf = '';
      }
    }else{
      let {senhaF, confirmaSenhaF} = this.senhaForm.controls;
      if(!this.senhaForm.valid){
        if(!senhaF.valid){
          this.erroSenha = true;
          this.messageSenha = 'SENHA DEVE SER PREENCHIDA';
        }else{
          this.messageSenha = '';
        }
        if(!confirmaSenhaF.valid){
          this.erroConfirmaSenha = true;
          this.messageConfirmaSenha = 'CONFIRMAÇÃO DE SENHA DEVE SER PREENCHIDA';
        }else{
          this.messageConfirmaSenha = '';
        }
      }else{
        if(usuario.senha != confirmaSenha){
          loading.present().then((data) => {loading.dismiss(); const alert = this.alertCtrl.create({
            subTitle: 'Senhas digitadas não conferem',
            message: 'Favor conferir as senhas digitadas e tentar novamente!',
            buttons: ['Ok']});
          alert.present()});
        }else if(usuario.senha == '12345678' || confirmaSenha == '12345678'){
          loading.present().then((data) => {loading.dismiss(); const alert = this.alertCtrl.create({
            subTitle: 'Senha digitada é a igual à senha padrão',
            message: 'Favor digitar uma senha diferente e tentar novamente!',
            buttons: ['Ok']});
          alert.present()});
        }else{
          this.dbService.editaUsuario(this.usuarioKey, usuario);
          loading.present().then((data) => {loading.dismiss(); const alert = this.alertCtrl.create({
                            subTitle: 'Alteração de Usuário',
                            message: 'Senha alterada com sucesso!',
                            buttons: ['Ok']});
                          alert.present().then(r => this.navCtrl.setRoot('LoginPage'))})
                        .catch((error) => {loading.dismiss(); const alert = this.alertCtrl.create({
                            subTitle: 'Alteração de senha falhou',
                            message: error.message,
                            buttons: ['Ok']});
                          alert.present();});
        }
      }
    }                      
  }

  voltar(){
    this.navCtrl.setRoot(LoginPage)
  }

}