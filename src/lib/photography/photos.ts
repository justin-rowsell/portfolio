// Lossless WebP renditions made by scripts/photo.sh and uploaded to R2 by
// scripts/upload-photos.sh, served and cached by the Pages Function in
// photos-cdn/. Each photo exists at these widths (when smaller than the
// original) plus its full width.
export const PHOTOS_URL = 'https://portfolio-photos-cem.pages.dev/photography';
const RENDITION_WIDTHS = [640, 1280, 2048];

export type Photo = {
	slug: string;
	/** Full-resolution size in pixels */
	width: number;
	height: number;
	title: string;
	location: string;
	/** YYYY-MM */
	taken: string;
	camera: string;
	note?: string;
	/** CSS object-position, if the frame ever crops the photo */
	position?: string;
};

// Hung in the order they were taken, oldest first.
export const PHOTOS: Photo[] = [
	{
		slug: 'fuego-after-dark',
		width: 2048,
		height: 1366,
		title: 'Fuego, after dark',
		location: 'Acatenango, Guatemala',
		taken: '2019-02',
		camera: 'Canon EOS M50, 15-45mm',
		position: '50% 40%',
		note: 'We camped on the neighbouring volcano and it erupted every twenty minutes through the night. You feel the sound in your ribs before you hear it. I stopped shooting after this frame and just watched.'
	},
	{
		slug: 'na-pali-coast',
		width: 3024,
		height: 4032,
		title: 'The Nā Pali Coast',
		location: 'Kauaʻi, Hawaiʻi',
		taken: '2019-07',
		camera: 'iPhone 7, from a moving boat',
		position: '50% 60%',
		note: 'The cliffs go straight up from the water and keep going into the cloud. I remember the boat pitching and just holding the phone out, hoping. One in twenty came out level. This is that one.'
	},
	{
		slug: 'whitewashed-bay',
		width: 3024,
		height: 4032,
		title: 'Agios Ioannis Beach',
		location: 'Mykonos, Greece',
		taken: '2021-06',
		camera: 'iPhone 11'
	},
	{
		slug: 'chichen-itza',
		width: 4032,
		height: 3024,
		title: 'El Castillo',
		location: 'Chichén Itzá, Mexico',
		taken: '2021-10',
		camera: 'iPhone 11'
	},
	{
		slug: 'lagoon-islands',
		width: 3024,
		height: 4032,
		title: 'The view from El Peñol',
		location: 'Guatapé, Colombia',
		taken: '2022-02',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'kochelsee-jetty',
		width: 3124,
		height: 3904,
		title: 'Jetty at Kochelsee',
		location: 'Bavaria, Germany',
		taken: '2022-03',
		camera: 'Sony α7 III, 16-35mm',
		note: 'Off-season, a Tuesday, nobody around. The bench faces the wrong way — toward the shore rather than the lake — which I think says something about the person who put it there.'
	},
	{
		slug: 'balloons-at-sunrise',
		width: 3024,
		height: 4032,
		title: 'Balloons at sunrise',
		location: 'Teotihuacán, Mexico',
		taken: '2022-04',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'stilt-docks',
		width: 4032,
		height: 3024,
		title: 'Docks on Isla Solarte',
		location: 'Bocas del Toro, Panama',
		taken: '2022-05',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'highland-overlook',
		width: 4032,
		height: 3024,
		title: 'Above Quito',
		location: 'Rucu Pichincha, Ecuador',
		taken: '2022-06',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'calves-in-pasture',
		width: 3024,
		height: 4032,
		title: 'Calves at pasture',
		location: 'Quijos, Ecuador',
		taken: '2022-06',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'frailejones',
		width: 4032,
		height: 3024,
		title: 'Frailejones on the páramo',
		location: 'Choachí, Colombia',
		taken: '2022-07',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'lake-at-dawn',
		width: 3024,
		height: 4032,
		title: 'Lake Atitlán at dawn',
		location: 'Santa Clara La Laguna, Guatemala',
		taken: '2022-08',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'ash-plume',
		width: 3024,
		height: 4032,
		title: 'Fuego, by day',
		location: 'Acatenango, Guatemala',
		taken: '2022-08',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'moonlit-volcano',
		width: 3024,
		height: 4032,
		title: 'Moonrise over the clouds',
		location: 'Acatenango, Guatemala',
		taken: '2022-08',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'skyline-reflection',
		width: 4032,
		height: 3024,
		title: 'Austin from Lady Bird Lake',
		location: 'Austin, Texas',
		taken: '2022-12',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'iguazu-falls',
		width: 4032,
		height: 3024,
		title: 'Iguazú Falls',
		location: 'Misiones, Argentina',
		taken: '2023-04',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'harbor-sunset',
		width: 4032,
		height: 3024,
		title: 'Marina at sunset',
		location: 'Santa Marta, Colombia',
		taken: '2023-07',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'statue-at-blue-hour',
		width: 3024,
		height: 4032,
		title: 'Monument at blue hour',
		location: 'Florence, Italy',
		taken: '2023-12',
		camera: 'iPhone 13 Pro'
	},
	{
		slug: 'tower-reflection',
		width: 4284,
		height: 5712,
		title: 'Lotte World Tower, reflected',
		location: 'Seoul, South Korea',
		taken: '2026-09',
		camera: 'iPhone 16 Pro Max'
	}
];

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

/** '2022-08' → 'August 2022' */
export function formatTaken(taken: string): string {
	const [year, month] = taken.split('-');
	return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function yearTaken(taken: string): string {
	return taken.slice(0, 4);
}

function widthsOf(photo: Photo): number[] {
	return [...RENDITION_WIDTHS.filter((w) => w < photo.width), photo.width];
}

export function photoSrc(photo: Photo, maxWidth: number): string {
	const widths = widthsOf(photo);
	const width = widths.find((w) => w >= maxWidth) ?? photo.width;
	return `${PHOTOS_URL}/${photo.slug}-${width}.webp`;
}

export function photoSrcset(photo: Photo): string {
	return widthsOf(photo)
		.map((w) => `${PHOTOS_URL}/${photo.slug}-${w}.webp ${w}w`)
		.join(', ');
}
