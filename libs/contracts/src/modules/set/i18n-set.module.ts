import { Module } from '@nestjs/common';
import * as path from 'path'; // يجب أن يكون هكذا
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

@Module({
  imports: [ I18nModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
      path: path.join(__dirname, 'i18n'), // المسار الفعلي
      watch: true,
    },
    resolvers : [AcceptLanguageResolver],

  })],
  exports: [I18nModule]
})
export class I18nSetModule {}