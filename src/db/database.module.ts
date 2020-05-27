/*
 * @file-description : this file connects to the mongoDb altas database on the cloud
 * @author{Yassine JOUT} yassinejout@gmail.com
 */

// Import the required modules
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
config();

//export the database module that connects to mongoDb altas on the cloud
export const dbModule = MongooseModule.forRoot(
  process.env.MOGOOS_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
);
