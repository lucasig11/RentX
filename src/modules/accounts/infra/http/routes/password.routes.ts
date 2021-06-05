import { Router } from 'express';

import ResetPasswordController from '@modules/accounts/useCases/resetPassword/ResetPasswordController';
import SendForgotPasswordMailController from '@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController';

const passwordRouter = Router();

const sendForgotPasswordMail = new SendForgotPasswordMailController();
const resetPassword = new ResetPasswordController();

passwordRouter.post('/', sendForgotPasswordMail.handle);
passwordRouter.post('/reset', resetPassword.handle);

export default passwordRouter;
