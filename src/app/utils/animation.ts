import {
  trigger,
  style,
  transition,
  animate,
  query,
  stagger
} from '@angular/animations';

export const inOut = trigger('inOut', [
  transition(':enter', [
    style({
      transform: 'translateY(20px)',
      opacity: 0
    }),
    animate('0.3s cubic-bezier(0.180, -0.265, 0.265, 1.550)')
  ]),
  transition(':leave', [
    animate(
      '0.3s cubic-bezier(0.180, -0.265, 0.265, 1.550)',
      style({
        transform: 'translateY(-20px)',
        opacity: 0
      })
    )
  ])
]);

export const listIn = trigger('listIn', [
  transition(':enter', [
    query('div', style({ transform: 'translateY(20px)', opacity: 0 })),
    query(
      'div',
      stagger('0.01s', [
        animate('0.2s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    )
  ])
]);
