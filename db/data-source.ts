import { DataSource, DataSourceOptions } from 'typeorm';
import * as process from 'node:process';
import { config } from 'dotenv';
import { Contract } from '../apps/users-micro/src/contracts/entities/contract.entity';
import { User } from '../apps/users-micro/src/users/entities/user.entity';
import { Audit } from '../apps/users-micro/src/audit/entities/audit.entity';
import { NotificationMicro } from '../apps/notifications-micro/src/entities/notification-micro.entity';
import { Favorite } from '../apps/properties-micro/src/favorite/entities/favorite.entity';
import { Vote } from '../apps/properties-micro/src/votes/entities/vote.entity';
import { Plan } from '../apps/commerce-micro/src/plans/entities/plan.entity';
import { ReportsMicro } from '../apps/reports-micro/src/entities/reports-micro.entity';
import { AgencyInfo } from '../apps/users-micro/src/users/entities/agency-info.entity';
import { Statistics } from '../apps/users-micro/src/users/entities/statistics.entity';
import { PriorityRatio } from '../apps/properties-micro/src/properties/entities/priority-ratio.entity';
import { Banned } from '../apps/users-micro/src/banned/entities/banned.entity';
import { View } from '../apps/properties-micro/src/views/entities/view.entity';
import { Order } from '../apps/commerce-micro/src/orders/entities/order.entity';
import { OtpEntity } from '../apps/users-micro/src/users/entities/otp.entity';
import { Property } from '../apps/properties-micro/src/properties/entities/property.entity';

//dotenv config

config({ path: '.env.development' });

//config({ path: '.env' });
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as any, // بورت PostgreSQL الافتراضي
  username: process.env.DB_USERNAME, // اسم المستخدم عندك
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // اسم قاعدة البيانات
  //url: process.env.DATABASE_URL,
  //تاكد من الجداول
  entities: [
    Contract,
    User,
    Audit,
    NotificationMicro,
    Property,
    OtpEntity,
    Favorite,
    Vote,
    Plan,
    Order,
    View,
    ReportsMicro,
    AgencyInfo,
    Statistics,
    PriorityRatio,
    Banned,
  ],
  migrations: ['dist/db/migrations/*.js'],

  // Syria Time Zone -configuration
  extra: {
    options: '-c timezone=+03',
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

//    "migration:generate": "npm run typeorm -- migration:generate",اوعك الفراغ --