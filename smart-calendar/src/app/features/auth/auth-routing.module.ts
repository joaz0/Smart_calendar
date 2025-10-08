import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    data: { title: 'Login' },
  },
  {
    path: 'register',
    component: Register,
    data: { title: 'Criar Conta' },
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
    data: { title: 'Recuperar Senha' },
  },
  {
    path: 'reset-password',
    component: ResetPassword,
    data: { title: 'Redefinir Senha' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
