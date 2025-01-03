import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

