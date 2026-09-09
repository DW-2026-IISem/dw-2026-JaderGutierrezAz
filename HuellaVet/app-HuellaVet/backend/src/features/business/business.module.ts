import { Module } from '@nestjs/common';

@Module({
  imports: [],
  exports: [],
})
export class BusinessModule {}
EOF_
cat > src/features/auth/auth.module.ts <<'EOF'
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  exports: [],
})
export class AuthModule {}
