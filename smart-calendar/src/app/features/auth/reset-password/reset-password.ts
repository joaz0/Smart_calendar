import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { passwordValidator } from '../../../utils/validation-utils';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
})
export class ResetPassword implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, passwordValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        this.notificationService.error('Token de recuperação inválido');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.loadingService.show();
      try {
        const newPassword = this.resetPasswordForm.get('password')?.value;
        await this.authService.resetPassword(this.token, newPassword);
        this.notificationService.success('Senha alterada com sucesso!');
        this.router.navigate(['/auth/login']);
      } catch (error) {
        this.notificationService.error('Erro ao alterar senha. Tente novamente.');
      } finally {
        this.loadingService.hide();
      }
    }
  }
}
