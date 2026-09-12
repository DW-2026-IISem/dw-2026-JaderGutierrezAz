import { Module } from '@nestjs/common';
import { OwnersModule } from './owners/owners.module.js';

@Module({
  imports: [OwnersModule],
  exports: [OwnersModule],
})
export class BusinessModule {}
