import AuthenticateUserController from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController';
import { Router } from 'express';

const sessionsRouter = Router();

const authenticateUserController = new AuthenticateUserController();

sessionsRouter.post('/', authenticateUserController.handle);

export default sessionsRouter;
