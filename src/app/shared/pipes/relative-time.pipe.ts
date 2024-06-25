import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Convierte la fecha en UTC y resta 5 horas para ajustar la zona horaria incorrecta
    const date = new Date(new Date(value).getTime() - 5 * 60 * 60 * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay >= 14) {
      return this.formatDate(date);
    } else if (diffDay > 0) {
      return `${diffDay} ${diffDay > 1 ? 'days' : 'day'} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour > 1 ? 'hours' : 'hour'} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin > 1 ? 'minutes' : 'minute'} ago`;
    } else {
      return `${diffSec} ${diffSec > 1 ? 'seconds' : 'second'} ago`;
    }
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
