from enum import Enum, auto
import random

InvertWhiteGeneNotation = True


class Color(Enum):
	WHITE = auto()
	PURPLE = auto()
	YELLOW = auto()
	RED = auto()
	PINK = auto()
	ORANGE = auto()
	BLACK = auto()
	BLUE = auto()
	GREEN = auto()


class Species(Enum):
	ROSE = auto()
	COSMO = auto()
	LILY = auto()
	PANSY = auto()
	HYACINTH = auto()
	TULIP = auto()
	MUM = auto()
	WINDFLOWER = auto()


def sequence_to_genes(seq):
	if len(seq) % 2 != 0:
		raise ValueError("not a valid gene sequence: " + str(seq))
	genes = []
	for c1, c2 in zip(seq[0::2], seq[1::2]):
		g = 0
		if c1.isupper():
			g += 1
		if c2.isupper():
			g += 1
		genes.append(g)
	return genes


class Flower:

	def __init__(self, species, *genes):
		if len(genes) < 3:
			raise ValueError("All flowers need at least 3 genes: " + repr(genes))
		if genes[0] != 0 and genes[0] != 1 and genes[0] != 2:
			raise ValueError("One or more genes out of range [0, 2]: " + repr(genes))
		if genes[1] != 0 and genes[1] != 1 and genes[1] != 2:
			raise ValueError("One or more genes out of range [0, 2]: " + repr(genes))
		if genes[2] != 0 and genes[2] != 1 and genes[2] != 2:
			raise ValueError("One or more genes out of range [0, 2]: " + repr(genes))
		set_genes = list(genes[0:3])
		if species == Species.ROSE:
			if len(genes) < 4:
				raise ValueError("Roses need 4 genes")
			if genes[3] != 0 and genes[3] != 1 and genes[3] != 2:
				raise ValueError("One or more genes out of range [0, 2]: " + repr(genes))
			set_genes.append(genes[3])

		self._genes = set_genes
		self._species = species

	def get_species(self):
		return self._species

	def get_genes(self):
		return list(self._genes)

	def get_color(self):
		color = _PHENOTYPES[self._species]
		for g in self._genes:
			color = color[g]
		return color

	def get_gene_sequence(self):
		gene_sequence = ''
		for letter, g in zip(_GENE_LABELS[self._species], self._genes):
			letter = letter.lower()
			if letter == 'w' and InvertWhiteGeneNotation:
				if g == 0:
					g = 2
				elif g == 2:
					g = 0
			if g == 0:
				gene_sequence += letter + letter
			elif g == 1:
				gene_sequence += letter.upper() + letter
			elif g == 2:
				gene_sequence += letter.upper() + letter.upper()
			else:
				raise ValueError("unknown gene value: " + repr(g))
		return gene_sequence

	def get_gene_decimals(self):
		line = ''
		for g in self._genes:
			line += str(g) + "-"
		if len(line) > 0:
			line = line[:-1]
		return line

	def __str__(self):
		line = '<' + self.get_color().name + ' ' + self.get_species().name + ' '
		line += self.get_gene_sequence() + '>'
		return line

	def __eq__(self, other):
		my_tuple = (self.get_species(), self.get_gene_sequence())
		other_tuple = (other.get_species(), other.get_gene_sequence())
		return my_tuple == other_tuple

	def __hash__(self):
		return hash((self.get_species(), self.get_gene_sequence()))

	def __repr__(self):
		st = "Flower(" + self.get_species().name
		for x in self.get_genes():
			st += ", " + str(x)
		st += ")"
		return st

	def clone(self):
		return Flower(self._species, self._genes)

	def breed_with(self, other):
		if other._species != self._species:
			msg = "{:s} cannot breed with {:s}"
			raise ValueError(msg.format(self._species, other._species))
		new_genes = []
		for own_gene, other_gene in zip(self._genes, other._genes):
			if own_gene == 0:
				new_gene_a = 0
			elif own_gene == 2:
				new_gene_a = 1
			else:
				new_gene_a = random.randint(0, 1)
			if other_gene == 0:
				new_gene_b = 0
			elif other_gene == 2:
				new_gene_b = 1
			else:
				new_gene_b = random.randint(0, 1)
			new_gene = new_gene_a + new_gene_b
			new_genes.append(new_gene)
		return Flower(self._species, *new_genes)

	def is_seed(self):
		return self in SEED_FLOWERS

	def distance_from(self, other):
		if other._species != self._species:
			msg = "{:s} cannot breed with {:s}"
			raise ValueError(msg.format(self._species, other._species))
		total_dist = 0
		for own_gene, other_gene in zip(self._genes, other._genes):
			total_dist += abs(own_gene - other_gene)
		return total_dist

	def shorthand(self):
		short = ""
		if self.is_seed():
			short += "S:"
		else:
			short += " :"
		for x in self.get_genes():
			short += str(x)
		short += ":"
		c = self.get_color()
		if c == Color.WHITE:
			short += "_W"
		elif c == Color.PURPLE:
			short += "PR"
		elif c == Color.YELLOW:
			short += "_Y"
		elif c == Color.RED:
			short += "_R"
		elif c == Color.PINK:
			short += "PN"
		elif c == Color.ORANGE:
			short += "OR"
		elif c == Color.BLACK:
			short += "BK"
		elif c == Color.BLUE:
			short += "BU"
		elif c == Color.GREEN:
			short += "GR"
		else:
			raise ValueError("not a valid color: " + str(c.name))
		return short

	def get_possible_children_with(self, other):
		"""Return (child, percent of parents, percent of color)"""
		if other._species != self._species:
			msg = "{:s} cannot breed with {:s}"
			raise ValueError(msg.format(self._species, other._species))
		gene_probabilities = []
		for own_gene, other_gene in zip(self._genes, other._genes):
			possible_genes = []
			if own_gene == 0:
				if other_gene == 0:
					possible_genes = [(1.0, 0)]
				elif other_gene == 1:
					possible_genes = [(0.5, 0), (0.5, 1)]
				elif other_gene == 2:
					possible_genes = [(1.0, 1)]
			elif own_gene == 1:
				if other_gene == 0:
					possible_genes = [(0.5, 0), (0.5, 1)]
				elif other_gene == 1:
					possible_genes = [(0.25, 0), (0.5, 1), (0.25, 2)]
				elif other_gene == 2:
					possible_genes = [(0.5, 1), (0.5, 2)]
			elif own_gene == 2:
				if other_gene == 0:
					possible_genes = [(1.0, 1)]
				elif other_gene == 1:
					possible_genes = [(0.5, 1), (0.5, 2)]
				elif other_gene == 2:
					possible_genes = [(1.0, 2)]
			if len(possible_genes) < 1:
				msg = "couldn't breed genes {:d} and {:d} together"
				raise ValueError(msg.format(own_gene, other_gene))
			gene_probabilities.append(possible_genes)
		possible_children = []
		color_probs = {}
		for probset1 in gene_probabilities[0]:
			p1 = probset1[0]
			g1 = probset1[1]
			for probset2 in gene_probabilities[1]:
				p2 = probset2[0]
				g2 = probset2[1]
				for probset3 in gene_probabilities[2]:
					p3 = probset3[0]
					g3 = probset3[1]
					if len(gene_probabilities) > 3:
						for probset4 in gene_probabilities[3]:
							p4 = probset4[0]
							g4 = probset4[1]
							child = Flower(self.get_species(), g1, g2, g3, g4)
							total_prob = p1*p2*p3*p4
					else:
						child = Flower(self.get_species(), g1, g2, g3)
						total_prob = p1*p2*p3
					possible_children.append((child, total_prob))
					if child.get_color() not in color_probs:
						color_probs[child.get_color()] = 0.0
					color_probs[child.get_color()] += total_prob
		children_with_color_probs = []
		for c in possible_children:
			children_with_color_probs.append(
				(c[0], c[1], c[1]/color_probs[c[0].get_color()])
			)
		return children_with_color_probs


WhiteSeedRose			= Flower(Species.ROSE, 0, 0, 1, 0)
YellowSeedRose			= Flower(Species.ROSE, 0, 2, 0, 0)
RedSeedRose				= Flower(Species.ROSE, 2, 0, 0, 1)
WhiteSeedCosmo			= Flower(Species.COSMO, 0, 0, 1)
YellowSeedCosmo			= Flower(Species.COSMO, 0, 2, 1)
RedSeedCosmo			= Flower(Species.COSMO, 2, 0, 0)
WhiteSeedLily			= Flower(Species.LILY, 0, 0, 2)
YellowSeedLily			= Flower(Species.LILY, 0, 2, 0)
RedSeedLily				= Flower(Species.LILY, 2, 0, 1)
WhiteSeedPansy			= Flower(Species.PANSY, 0, 0, 1)
YellowSeedPansy			= Flower(Species.PANSY, 0, 2, 0)
RedSeedPansy			= Flower(Species.PANSY, 2, 0, 0)
WhiteSeedHyacinth		= Flower(Species.HYACINTH, 0, 0, 1)
YellowSeedHyacinth		= Flower(Species.HYACINTH, 0, 2, 0)
RedSeedHyacinth			= Flower(Species.HYACINTH, 2, 0, 1)
WhiteSeedTuplip			= Flower(Species.TULIP, 0, 0, 1)
YellowSeedTuplip		= Flower(Species.TULIP, 0, 2, 0)
RedSeedTulip			= Flower(Species.TULIP, 2, 0, 1)
WhiteSeedMum			= Flower(Species.MUM, 0, 0, 1)
YellowSeedMum			= Flower(Species.MUM, 0, 2, 0)
RedSeedMum				= Flower(Species.MUM, 2, 0, 0)
WhiteSeedWindflower		= Flower(Species.WINDFLOWER, 0, 0, 1)
OrangeSeedWindflower	= Flower(Species.WINDFLOWER, 0, 2, 0)
RedSeedWindflower		= Flower(Species.WINDFLOWER, 2, 0, 0)

SEED_FLOWERS = [
	WhiteSeedRose,
	YellowSeedRose,
	RedSeedRose,
	WhiteSeedCosmo,
	YellowSeedCosmo,
	RedSeedCosmo,
	WhiteSeedLily,
	YellowSeedLily,
	RedSeedLily,
	WhiteSeedPansy,
	YellowSeedPansy,
	RedSeedPansy,
	WhiteSeedHyacinth,
	YellowSeedHyacinth,
	RedSeedHyacinth,
	WhiteSeedTuplip,
	YellowSeedTuplip,
	RedSeedTulip,
	WhiteSeedMum,
	YellowSeedMum,
	RedSeedMum,
	WhiteSeedWindflower,
	OrangeSeedWindflower,
	RedSeedWindflower
]


_GENE_LABELS = {
	Species.ROSE: 'ryws',
	Species.COSMO: 'rys',
	Species.LILY: 'rys',
	Species.PANSY: 'ryw',
	Species.HYACINTH: 'ryw',
	Species.TULIP: 'rys',
	Species.MUM: 'ryw',
	Species.WINDFLOWER: 'row'
}

_PHENOTYPES = {
	Species.ROSE: [
		[
			[
				[Color.WHITE, Color.WHITE, Color.WHITE],	 # Rose 0-0-0-?
				[Color.WHITE, Color.WHITE, Color.WHITE],	 # Rose 0-0-1-?
				[Color.PURPLE, Color.PURPLE, Color.PURPLE]	 # Rose 0-0-2-?
			],
			[
				[Color.YELLOW, Color.YELLOW, Color.YELLOW],  # Rose 0-1-0-?
				[Color.WHITE, Color.WHITE, Color.WHITE],	 # Rose 0-1-1-?
				[Color.PURPLE, Color.PURPLE, Color.PURPLE]	 # Rose 0-1-2-?
			],
			[
				[Color.YELLOW, Color.YELLOW, Color.YELLOW],	 # Rose 0-2-0-?
				[Color.YELLOW, Color.YELLOW, Color.YELLOW],	 # Rose 0-2-1-?
				[Color.WHITE, Color.WHITE, Color.WHITE]		 # Rose 0-2-2-?
			]
		],
		[
			[
				[Color.RED, Color.PINK, Color.WHITE],		# Rose 1-0-0-?
				[Color.RED, Color.PINK, Color.WHITE],		# Rose 1-0-1-?
				[Color.RED, Color.PINK, Color.PURPLE]		# Rose 1-0-2-?
			],
			[
				[Color.ORANGE, Color.YELLOW, Color.YELLOW],  # Rose 1-1-0-?
				[Color.RED, Color.PINK, Color.WHITE],		 # Rose 1-1-1-?
				[Color.RED, Color.PINK, Color.PURPLE]		 # Rose 1-1-2-?
			],
			[
				[Color.ORANGE, Color.YELLOW, Color.YELLOW],	 # Rose 1-2-0-?
				[Color.ORANGE, Color.YELLOW, Color.YELLOW],	 # Rose 1-2-1-?
				[Color.RED, Color.PINK, Color.WHITE]		 # Rose 1-2-2-?
			]
		],
		[
			[
				[Color.BLACK, Color.RED, Color.PINK],		 # Rose 2-0-0-?
				[Color.BLACK, Color.RED, Color.PINK],		 # Rose 2-0-1-?
				[Color.BLACK, Color.RED, Color.PINK]		 # Rose 2-0-2-?
			],
			[
				[Color.ORANGE, Color.ORANGE, Color.YELLOW],  # Rose 2-1-0-?
				[Color.RED, Color.RED, Color.WHITE],		 # Rose 2-1-1-?
				[Color.BLACK, Color.RED, Color.PURPLE]		 # Rose 2-1-2-?
			],
			[
				[Color.ORANGE, Color.ORANGE, Color.YELLOW],	 # Rose 2-2-0-?
				[Color.ORANGE, Color.ORANGE, Color.YELLOW],	 # Rose 2-2-1-?
				[Color.BLUE, Color.RED, Color.WHITE]		 # Rose 2-2-2-?
			]
		]
	],
	Species.COSMO: [
		[
			[Color.WHITE, Color.WHITE, Color.WHITE],		# Cosmo 0-0-?
			[Color.YELLOW, Color.YELLOW, Color.WHITE],		# Cosmo 0-1-?
			[Color.YELLOW, Color.YELLOW, Color.YELLOW]		# Cosmo 0-2-?
		],
		[
			[Color.PINK, Color.PINK, Color.PINK],			# Cosmo 1-0-?
			[Color.ORANGE, Color.ORANGE, Color.PINK],		# Cosmo 1-1-?
			[Color.ORANGE, Color.ORANGE, Color.ORANGE]		# Cosmo 1-2-?
		],
		[
			[Color.RED, Color.RED, Color.RED],				# Cosmo 2-0-?
			[Color.ORANGE, Color.ORANGE, Color.RED],		# Cosmo 2-1-?
			[Color.BLACK, Color.BLACK, Color.RED]			# Cosmo 2-2-?
		]
	],
	Species.LILY: [
		[
			[Color.WHITE, Color.WHITE, Color.WHITE],		# Lily 0-0-?
			[Color.YELLOW, Color.WHITE, Color.WHITE],		# Lily 0-1-?
			[Color.YELLOW, Color.YELLOW, Color.WHITE]		# Lily 0-2-?
		],
		[
			[Color.RED, Color.PINK, Color.WHITE],			# Lily 1-0-?
			[Color.ORANGE, Color.YELLOW, Color.YELLOW],		# Lily 1-1-?
			[Color.ORANGE, Color.YELLOW, Color.YELLOW]		# Lily 1-2-?
		],
		[
			[Color.BLACK, Color.RED, Color.PINK],			# Lily 2-0-?
			[Color.BLACK, Color.RED, Color.PINK],			# Lily 2-1-?
			[Color.ORANGE, Color.ORANGE, Color.WHITE]		# Lily 2-2-?
		]
	],
	Species.PANSY: [
		[
			[Color.WHITE, Color.WHITE, Color.BLUE],			# Pansy 0-0-?
			[Color.YELLOW, Color.YELLOW, Color.BLUE],		# Pansy 0-1-?
			[Color.YELLOW, Color.YELLOW, Color.YELLOW]		# Pansy 0-2-?
		],
		[
			[Color.RED, Color.RED, Color.BLUE],				# Pansy 1-0-?
			[Color.ORANGE, Color.ORANGE, Color.ORANGE],		# Pansy 1-1-?
			[Color.YELLOW, Color.YELLOW, Color.YELLOW]		# Pansy 1-2-?
		],
		[
			[Color.RED, Color.RED, Color.PURPLE],			# Pansy 2-0-?
			[Color.RED, Color.RED, Color.PURPLE],			# Pansy 2-1-?
			[Color.ORANGE, Color.ORANGE, Color.PURPLE]		# Pansy 2-2-?
		]
	],
	Species.HYACINTH: [
		[
			[Color.WHITE, Color.WHITE, Color.BLUE],			# Hyacinth 0-0-?
			[Color.YELLOW, Color.YELLOW, Color.WHITE],		# Hyacinth 0-1-?
			[Color.YELLOW, Color.YELLOW, Color.YELLOW]		# Hyacinth 0-2-?
		],
		[
			[Color.RED, Color.PINK, Color.WHITE],			# Hyacinth 1-0-?
			[Color.ORANGE, Color.YELLOW, Color.YELLOW],		# Hyacinth 1-1-?
			[Color.ORANGE, Color.YELLOW, Color.YELLOW]		# Hyacinth 1-2-?
		],
		[
			[Color.RED, Color.RED, Color.RED],				# Hyacinth 2-0-?
			[Color.BLUE, Color.RED, Color.RED],				# Hyacinth 2-1-?
			[Color.PURPLE, Color.PURPLE, Color.PURPLE]		# Hyacinth 2-2-?
		]
	],
	Species.TULIP: [
		[
			[Color.WHITE, Color.WHITE, Color.WHITE],		# Tulip 0-0-?
			[Color.YELLOW, Color.YELLOW, Color.WHITE],		# Tulip 0-1-?
			[Color.YELLOW, Color.YELLOW, Color.YELLOW]		# Tulip 0-2-?
		],
		[
			[Color.RED, Color.PINK, Color.WHITE],			# Tulip 1-0-?
			[Color.ORANGE, Color.YELLOW, Color.YELLOW],		# Tulip 1-1-?
			[Color.ORANGE, Color.YELLOW, Color.YELLOW]		# Tulip 1-2-?
		],
		[
			[Color.BLACK, Color.RED, Color.RED],			# Tulip 2-0-?
			[Color.BLACK, Color.RED, Color.RED],			# Tulip 2-1-?
			[Color.PURPLE, Color.PURPLE, Color.PURPLE]		# Tulip 2-2-?
		]
	],
	Species.MUM: [
		[
			[Color.WHITE, Color.WHITE, Color.PURPLE],		# Mum 0-0-?
			[Color.YELLOW, Color.YELLOW, Color.WHITE],		# Mum 0-1-?
			[Color.YELLOW, Color.YELLOW, Color.YELLOW]		# Mum 0-2-?
		],
		[
			[Color.PINK, Color.PINK, Color.PINK],			# Mum 1-0-?
			[Color.YELLOW, Color.RED, Color.PINK],			# Mum 1-1-?
			[Color.PURPLE, Color.PURPLE, Color.PURPLE]		# Mum 1-2-?
		],
		[
			[Color.RED, Color.RED, Color.RED],				# Mum 2-0-?
			[Color.PURPLE, Color.PURPLE, Color.RED],		# Mum 2-1-?
			[Color.GREEN, Color.GREEN, Color.RED]			# Mum 2-2-?
		]
	],
	Species.WINDFLOWER: [
		[
			[Color.WHITE, Color.WHITE, Color.BLUE],			# Windflower 0-0-?
			[Color.ORANGE, Color.ORANGE, Color.BLUE],		# Windflower 0-1-?
			[Color.ORANGE, Color.ORANGE, Color.ORANGE]		# Windflower 0-2-?
		],
		[
			[Color.RED, Color.RED, Color.BLUE],				# Windflower 1-0-?
			[Color.PINK, Color.PINK, Color.PINK],			# Windflower 1-1-?
			[Color.ORANGE, Color.ORANGE, Color.ORANGE]		# Windflower 1-2-?
		],
		[
			[Color.RED, Color.RED, Color.PURPLE],			# Windflower 2-0-?
			[Color.RED, Color.RED, Color.PURPLE],			# Windflower 2-1-?
			[Color.PINK, Color.PINK, Color.PURPLE]			# Windflower 2-2-?
		]
	],
}
