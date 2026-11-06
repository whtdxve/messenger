import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @UseGuards(AuthGuard('jwt'))
  @Get('search')
  search(@Query('name') name: string) {
    return this.appService.search(name);
  }
}
