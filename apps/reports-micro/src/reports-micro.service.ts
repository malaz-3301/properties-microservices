import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateReportDto } from '@malaz/contracts/dtos/reports/create-report.dto';
import { UsersGetProvider } from '../../users-micro/src/users/providers/users-get.provider';
import {
  Language,
  Reason,
  ReportStatus,
  ReportTitle,
  UserType,
} from '@malaz/contracts/utils/enums';
import { ReportsMicro } from './entities/reports-micro.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class ReportsMicroService {
  constructor(
    @InjectRepository(ReportsMicro)
    private readonly reportsMicroRepository: Repository<ReportsMicro>,
    private usersGetProvider: UsersGetProvider, //محمد شيل هي
    @Inject('USERS_SERVICE')
    private readonly usersClient: ClientProxy,
    @Inject('TRANSLATE_SERVICE') private readonly translateClient: ClientProxy,
  ) {}

  async report(createReportDto: CreateReportDto) {
    if (createReportDto.reason === Reason.Other) {
      createReportDto.reason = createReportDto.otherReason;
    }

    let report = this.reportsMicroRepository.create(createReportDto);
    // await this.createTranslatedReport(report, createReportDto);
    report = await lastValueFrom(
      await this.translateClient.send('translate.createTranslatedReport', {
        report: report,
        reportDto: createReportDto,
      }),
    );
    // report.mult_description = { ar: '', en: '', de: '' };
    return await this.reportsMicroRepository.save(report);
  }

  async getAll(payloadId: number) {
    //فرز الشكاوي للادمن و للفريق المالي
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: payloadId })
        .pipe(retry(2), timeout(5000)),
    );
    if (user?.userType === UserType.SUPER_ADMIN) {
      let reports = await this.reportsMicroRepository.find({
        where: { title: Not(ReportTitle.T3) },
      });
      if (!reports || reports.length === 0) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Empty',
        });
      }
      if (reports)
        for (let i = 0; i < reports.length; i++) {
          // this.getTranslatedReport(reports[i], user.language);
          reports[i] = await lastValueFrom(
            await this.translateClient.send('translate.getTranslatedReport', {
              report: reports[i],
              language: user.language,
            }),
          );
        }
      return reports;
    } else if (user?.userType === UserType.Financial) {
      let reports = await this.reportsMicroRepository.find({
        where: { title: ReportTitle.T3 },
      });
      for (let i = 0; i < reports.length; i++) {
        // this.getTranslatedReport(reports[i], user.language);
        reports[i] = await lastValueFrom(
          await this.translateClient.send('translate.getTranslatedReport', {
            report: reports[i],
            language: user.language,
          }),
        );
      }
      return reports;
    }
  }

  async getAllPending(payloadId: number) {
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: payloadId })
        .pipe(retry(2), timeout(5000)),
    );

    if (user?.userType === UserType.SUPER_ADMIN) {
      let reports = await this.reportsMicroRepository.find({
        where: {
          title: Not(ReportTitle.T3),
          reportStatus: ReportStatus.PENDING,
        },
      });
      if (!reports || reports.length === 0) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Empty',
        });
      }
      for (let i = 0; i < reports.length; i++) {
        // await this.getTranslatedReport(reports[i], user.language);
        reports[i] = await lastValueFrom(
          await this.translateClient.send('translate.getTranslatedReport', {
            report: reports[i],
            language: user.language,
          }),
        );
      }
      return reports;
    } else if (user?.userType === UserType.Financial) {
      let reports = await this.reportsMicroRepository.find({
        where: { title: ReportTitle.T3, reportStatus: ReportStatus.PENDING },
      });
      for (let i = 0; i < reports.length; i++) {
        // await this.getTranslatedReport(reports[i], user.language);
        reports[i] = await lastValueFrom(
          await this.translateClient.send('translate.getTranslatedReport', {
            report: reports[i],
            language: user.language,
          }),
        );
      }
      return reports;
    }
  }

  async getOne(reportId: number, userId: number) {
    const user = await lastValueFrom(
      this.usersClient
        .send('users.findById', { id: userId })
        .pipe(retry(2), timeout(5000)),
    );
    let report = await this.reportsMicroRepository.findOneBy({
      id: reportId,
    });
    if (!report) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Empty',
      });
    }
    // await this.getTranslatedReport(report, user.language);
    report = await lastValueFrom(
      await this.translateClient.send('translate.getTranslatedReport', {
        report: report,
        language: user.language,
      }),
    );
    return report;
  }

  async update(reportId: number, action: boolean) {
    const report = await this.reportsMicroRepository.findOneBy({
      id: reportId,
    });
    if (!report) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not Found Report',
      });
    }
    console.log(reportId);
    if (action) {
      return this.reportsMicroRepository.update(reportId, {
        reportStatus: ReportStatus.FIXED,
      });
    } else {
      return this.reportsMicroRepository.update(reportId, {
        reportStatus: ReportStatus.Rejected,
      });
    }
  }
}
