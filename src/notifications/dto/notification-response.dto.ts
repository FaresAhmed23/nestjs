import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ example: true })
  sent: boolean;

  @ApiProperty({ example: 'Email sent successfully' })
  message: string;

  @ApiProperty({ example: 'client@example.com' })
  recipient: string;

  @ApiProperty({ example: 'New vendor match for your project' })
  subject: string;
}
