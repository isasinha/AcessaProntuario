import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Usuario } from '../../app/Modelo/usuario';
import { FormBuilder, Validators } from '@angular/forms';
import { HomeMedicoPage } from '../home-medico/home-medico';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Informe } from '../../app/Modelo/informe';

@IonicPage()
@Component({
  selector: 'page-informe',
  templateUrl: 'informe.html',
})
export class InformePage {

  usuario: Usuario = {
    prontuario: '',
    nome: '', 
    sobrenome: '',
    dtNasc: '',
    login: '',
    senha: '',
    tipo: 'Usuario'
  }
  informe: Informe ={
    estado: '',
    horaVisita: '',
    prevAlta: '',
    dataAlta: '',
    dataHora: '',
    loginMedico: '',
    outros: '',
    usuarioKey: ''
  }
  dataHora = new Date();
  usuarioKey;
  keyInforme;
  loginMedico
  public prontuarioForm: any;
  messageEstado = '';
  erroEstado = false;
  messageHoraVisita = '';
  erroHoraVisita = false;
  messagePrevAlta = '';
  erroPrevAlta = false;
  messageDataAlta = '';
  erroDataAlta = false;


  constructor( 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dbService: FirebaseServiceProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public fb: FormBuilder
    ) {
      this.usuario = navParams.get('usuarioPaciente');
      this.usuarioKey = navParams.get('keyPaciente');
      this.loginMedico = navParams.get('loginMedico');
      this.prontuarioForm = fb.group({
        estado: ['', Validators.required],
        horaVisita: ['', Validators.required],
        prevAlta: ['', Validators.required],
        dataAlta: [''],
        outros: ['']

      })
  }

  ionViewDidLoad() {
    
  }

  atualizaInforme(){
    const loading = this.loadingCtrl.create({
      content: 'Cadastrando...'
    }); 
    if(this.informe.dataAlta != "")
    this.informe.dataAlta = this.dbService.converteData(this.informe.dataAlta);
    this.informe.loginMedico = this.loginMedico;
    this.informe.dataHora = this.dataHora.getDate() + '/' + this.dataHora.getMonth() + '/' + this.dataHora.getFullYear() +
                            '  ' + this.dataHora.getHours() + ':' + this.dataHora.getMinutes();   
    this.informe.usuarioKey = this.usuarioKey;
      let {estado, horaVisita, prevAlta} = this.prontuarioForm.controls;
      if(!this.prontuarioForm.valid){
        if(!estado.valid){
          this.erroEstado = true;
          this.messageEstado = 'ESTADO DEVE SER PREENCHIDO';
        }else{
          this.messageEstado = '';
        }
        if(!horaVisita.valid){
          this.erroHoraVisita = true;
          this.messageHoraVisita = 'HORÁRIO DEVE SER PREENCHIDO';
        }else{
          this.messageHoraVisita = '';
        }
        if(!prevAlta.valid){
          this.erroPrevAlta = true;
          this.messagePrevAlta = 'PREVISÃO DE ALTA DEVE SER PREENCHIDA';
        }else{
          this.messagePrevAlta = '';
        }
      }else{
        this.keyInforme = this.dbService.cadastraInforme(this.informe);
        loading.present().then((data) => {loading.dismiss(); 
          const alert = this.alertCtrl.create({
              subTitle: 'Informe atualizado', 
              message: 'Informe de '+this.usuario.nome + ' ' + this.usuario.sobrenome + ' atualizado com sucesso',
              buttons: ['Ok']});
            alert.present().then(r => this.navCtrl.setRoot(HomeMedicoPage,{ usuarioPaciente: this.usuario, keyPaciente: this.usuarioKey, loginMedico: this.loginMedico}))})
          .catch((error) => {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              subTitle: 'Atualização de Informe falhou',
              message: 'Tente novamente',
              buttons: ['Ok']});
            alert.present();})
      
      }    
  }

  voltar(){
    this.navCtrl.setRoot(HomeMedicoPage);
  }

}
