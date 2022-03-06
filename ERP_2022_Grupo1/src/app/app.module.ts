import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthSigninComponent } from './components/auth-signin/auth-signin.component';
import { SigninFormComponent } from './components/signin-form/signin-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ModulesComponent } from './components/modules/modules.component';
import { ListadoPedidosComponent } from './components/createOrder/listado-pedidos.component';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PruebaComponent } from './components/prueba/prueba.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import { StepperCreateOrderCompleteComponent } from './components/stepper-create-order-complete/stepper-create-order-complete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorComponent } from './components/error/error.component';
import { PruebaLuisComponent } from './components/prueba-luis/prueba-luis.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ConfirmingDialogComponent } from './components/confirming-dialog/confirming-dialog.component';


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgwt2VRlrDGKe4iy9awUCtEXD47df43iI",
  authDomain: "login-erp-a95b6.firebaseapp.com",
  projectId: "login-erp-a95b6",
  storageBucket: "login-erp-a95b6.appspot.com",
  messagingSenderId: "597059530321",
  appId: "1:597059530321:web:9e2264aaec19a94a48d270",
  measurementId: "G-D95TDL5CNC"
};

const app = initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    AuthSigninComponent,
    SigninFormComponent,
    LoginFormComponent,
    ListadoPedidosComponent,
    PruebaComponent,
    StepperCreateOrderCompleteComponent,
    ErrorComponent,
    PruebaLuisComponent,
    OrderListComponent,
    ModulesComponent,
    ConfirmingDialogComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSelectModule,
    MatStepperModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
