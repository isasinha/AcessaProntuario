import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Usuario } from '../../app/Modelo/usuario';
import * as firebase from 'firebase';
import { InformePage } from '../informe/informe';

@IonicPage()
@Component({
  selector: 'page-home-medico',
  templateUrl: 'home-medico.html',
})
export class HomeMedicoPage {

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
  nomeUsuario;
  loginMedico;

  constructor( 
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
      // aqui recebe os valores passados por outra página
      this.nomeUsuario = navParams.get('nome');
      this.loginMedico = navParams.get('loginMedico');
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

  atualizarProntuario(){
    //aqui será aberta a página Informe e será passados para ela alguns valores que só existiam aqui, para que a outra
    //página também tenha essa informação
    this.navCtrl.push(InformePage,{
      usuarioPaciente: this.user,
      keyPaciente: this.usuarioKey,
      loginMedico: this.loginMedico
    })
  }

}
