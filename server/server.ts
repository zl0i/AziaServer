import express from 'express';
import morgan from 'morgan';
import authRouter from './routers/authRouter'
import usersRouter from './routers/usersRouter'
import orderRouter from './routers/orderRouter'
import shopRouter from './routers/shopRouter'
import oauthRouter from './routers/oauthRouter'
import menuRouter from './routers/menuRouter'
import categoryRouter from './routers/categoryRouter'

const app = express();
if (process.env['NODE_ENV'] !== 'test') {
    app.use(morgan(':date[iso] :remote-addr :method :url :status :response-time ms'));
}

app.set('port', 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/restaurant/api/auth', authRouter);
app.use('/restaurant/api/users', usersRouter);
app.use('/restaurant/api/orders', orderRouter);
app.use('/restaurant/api/shops', shopRouter);
app.use('/restaurant/api/menu', menuRouter);
app.use('/restaurant/api/category', categoryRouter);
app.use('/restaurant/api/oauth', oauthRouter);

if (process.env['NODE_ENV'] == 'test') {
    //It's magic!!! This need for the supertest.
    const server = app.listen(0, () => { })
    server.close()
}

export default app