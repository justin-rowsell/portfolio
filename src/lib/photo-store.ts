import { writable } from 'svelte/store';
import { Photo } from './models/photos/photo';

// Mock data for the photo gallery
const mockPhotos: Photo[] = [
  Object.assign(new Photo(), {
    image: '/photography/quito_2022.jpeg',
    description: 'A serene landscape with vibrant colors.',
    location: 'Quito, Ecuador'
  }),
  Object.assign(new Photo(), {
    image: '/photography/quito_2022.jpeg',
    description: 'A serene landscape with vibrant colors.',
    location: 'Quito, Ecuador'
  }),
  Object.assign(new Photo(), {
    image: '/photography/quito_2022.jpeg',
    description: 'A serene landscape with vibrant colors.',
    location: 'Quito, Ecuador'
  })
];

export const photoStore = writable<Photo[]>(mockPhotos); 