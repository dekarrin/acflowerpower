import { SPECIES_ID_ROSE, SPECIES_ID_MUM, SPECIES_ID_LILY, SPECIES_ID_COSMO, SPECIES_ID_PANSY, SPECIES_ID_TULIP, SPECIES_ID_HYACINTH, SPECIES_ID_WINDFLOWER } from './species';

import { Color } from '../color';

export const PHENOTYPES: {[key: number]: any} = {
  [SPECIES_ID_ROSE]: [
		[
			[
				['white', 'white', 'white'],	// Rose 0-0-0-?
				['white', 'white', 'white'],	// Rose 0-0-1-?
				['purple', 'purple', 'purple']	// Rose 0-0-2-?
			],
			[
				['yellow', 'yellow', 'yellow'], // Rose 0-1-0-?
				['white', 'white', 'white'],	// Rose 0-1-1-?
				['purple', 'purple', 'purple']	// Rose 0-1-2-?
			],
			[
				['yellow', 'yellow', 'yellow'],	// Rose 0-2-0-?
				['yellow', 'yellow', 'yellow'],	// Rose 0-2-1-?
				['white', 'white', 'white']		// Rose 0-2-2-?
			]
		],
		[
			[
				['red', 'pink', 'white'],		// Rose 1-0-0-?
				['red', 'pink', 'white'],		// Rose 1-0-1-?
				['red', 'pink', 'purple']		// Rose 1-0-2-?
			],
			[
				['orange', 'yellow', 'yellow'], // Rose 1-1-0-?
				['red', 'pink', 'white'],		// Rose 1-1-1-?
				['red', 'pink', 'purple']		// Rose 1-1-2-?
			],
			[
				['orange', 'yellow', 'yellow'],	// Rose 1-2-0-?
				['orange', 'yellow', 'yellow'],	// Rose 1-2-1-?
				['red', 'pink', 'white']		// Rose 1-2-2-?
			]
		],
		[
			[
				['black', 'red', 'pink'],		// Rose 2-0-0-?
				['black', 'red', 'pink'],		// Rose 2-0-1-?
				['black', 'red', 'pink']		// Rose 2-0-2-?
			],
			[
				['orange', 'orange', 'yellow'], // Rose 2-1-0-?
				['red', 'red', 'white'],		// Rose 2-1-1-?
				['black', 'red', 'purple']		// Rose 2-1-2-?
			],
			[
				['orange', 'orange', 'yellow'],	// Rose 2-2-0-?
				['orange', 'orange', 'yellow'],	// Rose 2-2-1-?
				['blue', 'red', 'white']		// Rose 2-2-2-?
			]
		]
	],
	[SPECIES_ID_COSMO]: [
		[
			['white', 'white', 'white'],		// Cosmo 0-0-?
			['yellow', 'yellow', 'white'],		// Cosmo 0-1-?
			['yellow', 'yellow', 'yellow']		// Cosmo 0-2-?
		],
		[
			['pink', 'pink', 'pink'],			// Cosmo 1-0-?
			['orange', 'orange', 'pink'],		// Cosmo 1-1-?
			['orange', 'orange', 'orange']		// Cosmo 1-2-?
		],
		[
			['red', 'red', 'red'],				// Cosmo 2-0-?
			['orange', 'orange', 'red'],		// Cosmo 2-1-?
			['black', 'black', 'red']			// Cosmo 2-2-?
		]
	],
	[SPECIES_ID_LILY]: [
		[
			['white', 'white', 'white'],		// Lily 0-0-?
			['yellow', 'white', 'white'],		// Lily 0-1-?
			['yellow', 'yellow', 'white']		// Lily 0-2-?
		],
		[
			['red', 'pink', 'white'],			// Lily 1-0-?
			['orange', 'yellow', 'yellow'],		// Lily 1-1-?
			['orange', 'yellow', 'yellow']		// Lily 1-2-?
		],
		[
			['black', 'red', 'pink'],			// Lily 2-0-?
			['black', 'red', 'pink'],			// Lily 2-1-?
			['orange', 'orange', 'white']		// Lily 2-2-?
		]
	],
	[SPECIES_ID_PANSY]: [
		[
			['white', 'white', 'blue'],			// Pansy 0-0-?
			['yellow', 'yellow', 'blue'],		// Pansy 0-1-?
			['yellow', 'yellow', 'yellow']		// Pansy 0-2-?
		],
		[
			['red', 'red', 'blue'],				// Pansy 1-0-?
			['orange', 'orange', 'orange'],		// Pansy 1-1-?
			['yellow', 'yellow', 'yellow']		// Pansy 1-2-?
		],
		[
			['red', 'red', 'purple'],			// Pansy 2-0-?
			['red', 'red', 'purple'],			// Pansy 2-1-?
			['orange', 'orange', 'purple']		// Pansy 2-2-?
		]
	],
	[SPECIES_ID_HYACINTH]: [
		[
			['white', 'white', 'blue'],			// Hyacinth 0-0-?
			['yellow', 'yellow', 'white'],		// Hyacinth 0-1-?
			['yellow', 'yellow', 'yellow']		// Hyacinth 0-2-?
		],
		[
			['red', 'pink', 'white'],			// Hyacinth 1-0-?
			['orange', 'yellow', 'yellow'],		// Hyacinth 1-1-?
			['orange', 'yellow', 'yellow']		// Hyacinth 1-2-?
		],
		[
			['red', 'red', 'red'],				// Hyacinth 2-0-?
			['blue', 'red', 'red'],				// Hyacinth 2-1-?
			['purple', 'purple', 'purple']		// Hyacinth 2-2-?
		]
	],
	[SPECIES_ID_TULIP]: [
		[
			['white', 'white', 'white'],		// Tulip 0-0-?
			['yellow', 'yellow', 'white'],		// Tulip 0-1-?
			['yellow', 'yellow', 'yellow']		// Tulip 0-2-?
		],
		[
			['red', 'pink', 'white'],			// Tulip 1-0-?
			['orange', 'yellow', 'yellow'],		// Tulip 1-1-?
			['orange', 'yellow', 'yellow']		// Tulip 1-2-?
		],
		[
			['black', 'red', 'red'],			// Tulip 2-0-?
			['black', 'red', 'red'],			// Tulip 2-1-?
			['purple', 'purple', 'purple']		// Tulip 2-2-?
		]
	],
	[SPECIES_ID_MUM]: [
		[
			['white', 'white', 'purple'],		// Mum 0-0-?
			['yellow', 'yellow', 'white'],		// Mum 0-1-?
			['yellow', 'yellow', 'yellow']		// Mum 0-2-?
		],
		[
			['pink', 'pink', 'pink'],			// Mum 1-0-?
			['yellow', 'red', 'pink'],			// Mum 1-1-?
			['purple', 'purple', 'purple']		// Mum 1-2-?
		],
		[
			['red', 'red', 'red'],				// Mum 2-0-?
			['purple', 'purple', 'red'],		// Mum 2-1-?
			['green', 'green', 'red']			// Mum 2-2-?
		]
	],
	[SPECIES_ID_WINDFLOWER]: [
		[
			['white', 'white', 'blue'],			// Windflower 0-0-?
			['orange', 'orange', 'blue'],		// Windflower 0-1-?
			['orange', 'orange', 'orange']		// Windflower 0-2-?
		],
		[
			['red', 'red', 'blue'],				// Windflower 1-0-?
			['pink', 'pink', 'pink'],			// Windflower 1-1-?
			['orange', 'orange', 'orange']		// Windflower 1-2-?
		],
		[
			['red', 'red', 'purple'],			// Windflower 2-0-?
			['red', 'red', 'purple'],			// Windflower 2-1-?
			['pink', 'pink', 'purple']			// Windflower 2-2-?
		]
	],
}
