import { Module } from '@nestjs/common';
import { FinancialRecordsService } from './financial-records.service';
import { FinancialRecordsController } from './financial-records.controller';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [FinancialRecordsService],
  controllers: [FinancialRecordsController],
})
export class FinancialRecordsModule {}
