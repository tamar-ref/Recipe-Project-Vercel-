import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(totalMinutes: number): string {
    if (!totalMinutes || totalMinutes <= 0) {
      return '';
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours} שעות`);
    }

    if (minutes > 0) {
      parts.push(`${minutes} דקות`);
    }

    return parts.join(' ו-');
  }
}
