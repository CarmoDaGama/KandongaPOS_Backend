import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { FinancialRecordsModule } from './modules/financial-records/financial-records.module';
import { EntitiesModule } from './modules/entities/entities.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PosModule } from './modules/pos/pos.module';
import { CreditRequestsModule } from './modules/credit-requests/credit-requests.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { GroupsModule } from './modules/groups/groups.module';
import { AiAnalysisModule } from './modules/ai-analysis/ai-analysis.module';
import { PlatformLogsModule } from './modules/platform-logs/platform-logs.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BusinessesModule,
    FinancialRecordsModule,
    EntitiesModule,
    InventoryModule,
    PosModule,
    CreditRequestsModule,
    InvoicesModule,
    GroupsModule,
    AiAnalysisModule,
    PlatformLogsModule,
    ReportsModule,
  ],
})
export class AppModule {}
