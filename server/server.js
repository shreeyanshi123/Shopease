require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');

const authRouter=require("./routes/auth/auth-routes");
const adminProductsRouter=require("./routes/admin/product-routes");
const shopProductsRouter=require("./routes/shop/product-routes");
const shopCartRouter=require("./routes/shop/cart-routes");
const shopAddressRouter=require("./routes/shop/address-routes");
const shopOrderRouter=require('./routes/shop/order-routes');
const adminOrderRouter=require('./routes/admin/order-routes');
const shopSearchRouter=require('./routes/shop/search-routes')
const adminDashboardRouter = require("./routes/admin/dashboard-routes");
const adminAdminsRouter = require('./routes/admin/admin-routes');
const passport = require('./auth/passport');
const oauthRouter = require('./routes/auth/oauth-routes');


mongoose.connect(process.env.MONGODB_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>console.log('MongoDB connected')).catch(err=>console.log(err));



const app=express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Socket.io connection
let onlineAdmins = 0;
let onlineShoppers = 0;

io.on('connection', (socket) => {
  const role = socket.handshake.query.role === 'shopper' ? 'shopper' : 'admin';
  if (role === 'shopper') {
    onlineShoppers++;
    io.emit('usersOnline', { admins: onlineAdmins, shoppers: onlineShoppers });
    console.log('Shopper connected:', socket.id, 'Online shoppers:', onlineShoppers, 'Query:', socket.handshake.query);
  } else {
    onlineAdmins++;
    io.emit('usersOnline', { admins: onlineAdmins, shoppers: onlineShoppers });
    console.log('Admin dashboard connected:', socket.id, 'Online admins:', onlineAdmins);
  }

  socket.on('disconnect', () => {
    if (role === 'shopper') {
      onlineShoppers = Math.max(onlineShoppers - 1, 0);
      io.emit('usersOnline', { admins: onlineAdmins, shoppers: onlineShoppers });
      console.log('Shopper disconnected:', socket.id, 'Online shoppers:', onlineShoppers);
    } else {
      onlineAdmins = Math.max(onlineAdmins - 1, 0);
      io.emit('usersOnline', { admins: onlineAdmins, shoppers: onlineShoppers });
      console.log('Admin dashboard disconnected:', socket.id, 'Online admins:', onlineAdmins);
    }
  });
});

// Make io accessible in routes/controllers
app.set('io', io);

const PORT=process.env.PORT || 8000;

app.use(
    cors({
        origin:'http://localhost:5173',
        methods:['GET','POST','DELETE','UPDATE','PUT','PATCH'],
        allowedHeaders:['Content-Type','Authorization','Cache-Control','Expires','Pragma'],
        credentials:true
    })
)
app.use(cookieParser());
app.use(express.json()); // Add this line to parse JSON request bodies
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: 'lax', // Allows cross-origin cookies for localhost dev
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth',authRouter);
app.use('/api/admin/products',adminProductsRouter);
app.use('/api/admin/orders',adminOrderRouter);
app.use('/api/admin/dashboard', adminDashboardRouter);
app.use('/api/admin/admins', adminAdminsRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart",shopCartRouter)
app.use('/api/shop/address',shopAddressRouter)
app.use('/api/shop/order',shopOrderRouter);
app.use('/api/shop/search',shopSearchRouter);
app.use('/auth', oauthRouter);


server.listen(PORT,()=>console.log(`Server is now running on port ${PORT}`));
