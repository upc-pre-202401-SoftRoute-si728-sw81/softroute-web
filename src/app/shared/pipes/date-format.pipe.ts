// src/app/pipes/date-format.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const date = new Date(value);

    // Formatear la fecha a yyyy/MM/dd
    const formattedDate = `${date.getFullYear()}/${this.padZero(
      date.getMonth() + 1
    )}/${this.padZero(date.getDate())}`;

    // Obtener la hora en formato 24 horas
    const hours = date.getHours();
    const minutes = this.padZero(date.getMinutes());

    const wa = hours > 12 ? 'pm' : 'am';

    // Retornar el formato deseado
    return `${formattedDate} ${hours}:${minutes} ${wa}`;
  }

  // Función auxiliar para añadir ceros a la izquierda si es necesario
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}
