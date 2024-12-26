//setup express server to run the application


// src 
//  |
//  |----application
//  |       |---services
//  |       |---use-cases
//  |            |---registerUser.ts
//  |            |---loginUser.ts
//  |----domain
//  |       |---entities
//  |       |---models
//  |            |---user.ts
//  |       |---repositories
//  |            |---userRepository.ts
//  |----infrastructure
//  |       |---data
//  |            |---repositories
//  |            |---mongoUserRepository.ts
//  |       |---frameworks 
//  |----interface
//  |       |---controllers
//  |            |---userController.ts
//  |       |---middlewares
//  |       |---routes
//  |            |---userRoutes.ts
//  |----server.ts   

// ------------------------------------------

//config - cloudinaryConfig.ts , firebaseConfig.ts , connectDB.ts
//controllers - chatController.ts , adminController.ts
//entities - adminEntity.ts , otpEntity.ts
//middlewares - authMiddleware.ts
//models - userModel.ts , otpSchema.ts
//repositories - implementations -
//              , interface
//routes - userRouter.ts , adminRouter.ts
//services - implementation -
//              , interface
//socket - socketHandler.ts
//uploads 
//utils - sendOtp.ts , generateOtp.ts , bcrypt.ts , jwt.ts , multer.ts , notificationService.ts
//validator - otpValidator.ts , registerValidator.ts , loginValidator.ts
//server.ts