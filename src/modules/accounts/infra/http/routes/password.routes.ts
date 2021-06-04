import { Router } from 'express';

import SendForgotPasswordMailController from '@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController';

const passwordRouter = Router();

const sendForgotPasswordMail = new SendForgotPasswordMailController();

passwordRouter.post('/', sendForgotPasswordMail.handle);

export default passwordRouter;
