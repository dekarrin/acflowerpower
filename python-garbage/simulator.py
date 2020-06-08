import flower
import itertools
import pprint
from enum import Enum, auto
from typing import Any, Dict, List, Union, Sequence, Tuple

def simulate_breeding(f1, f2, trials=10000, print_results=True):
	if print_results:
		print("Simulating the following two flowers:")
		print(str(f1) + " + " + str(f2))

	results = {}
	for x in range(trials):
		new_flower = f1.breed_with(f2)
		if new_flower.get_color() not in results:
			results[new_flower.get_color()] = {}
		color_results = results[new_flower.get_color()]
		if new_flower.get_gene_sequence() not in color_results:
			color_results[new_flower.get_gene_sequence()] = 1
		else:
			color_results[new_flower.get_gene_sequence()] += 1
	full_results = {}
	for c in results:
		color_results = results[c]
		color_results_total = sum(color_results[x] for x in color_results)
		total_percent = color_results_total / trials
		result_set = {
			'total': total_percent,
			'variants': [(k, v/trials) for k, v in color_results.items()]
		}
		full_results[c] = result_set
	if print_results:
		print("Results:")
		result_keys = sorted(full_results.keys(), key=lambda x:x.name)
		for c in result_keys:
			color = c.name
			color_results = full_results[c]
			print (color + " - {:.2%}".format(color_results['total']))
			for v in sorted(color_results['variants']):
				print(" * " + v[0] + ": {:.2%}".format(v[1]))
		print()
	return full_results


def quantize(num, factor):
	return round(num * factor) / factor





#simulate_breeding(r1, b0)
#simulate_breeding(r1, b1)
#simulate_breeding(r2, b1)
#simulate_breeding(r2, b0)

def get_num_turns_to_purple(max_attempts=10000):
	blue_flower = b0
	red_flower = r1
	breeds = 0
	got = False
	#print("0: Combining " + str(red_flower) + " + " + str(blue_flower))
	for x in range(max_attempts):
		new_flower = blue_flower.breed_with(red_flower)
		breeds += 1
		if new_flower.get_color() == flower.Color.PURPLE:
			#print(str(breeds) + ": Got purple")
			return breeds
		elif new_flower.get_color() == flower.Color.RED:
			red_flower = new_flower
			#print(str(breeds) + ": Got new red; now combining " + str(red_flower) + " + " + str(blue_flower))
		elif new_flower.get_color() == flower.Color.BLUE:
			blue_flower = new_flower
			#print(str(breeds) + ": Got new blue; now combining " + str(red_flower) + " + " + str(blue_flower))
	return -1

def get_num_turns_to_purple_hybrid_only(max_attempts=10000):
	red_flower = r1
	breeds = 0
	for x in range(max_attempts):
		new_flower = r1.breed_with(r1)
		breeds += 1
		if new_flower.get_color() == flower.Color.PURPLE:
			return breeds
	return -1


class StepType(Enum):
	START = auto()
	BREED = auto()
	TEST = auto()

class PlanStep:
	def __init__(self, type: StepType, data: Dict[str, Any]):
		self.type = type
		self.data = data

class PotentialBreeder:
	def __init__(self, f: flower.Flower, expected_steps: float, plan: List[PlanStep]):
		self.flower = f
		self.expected_steps = expected_steps
		self.plan = plan

BreedResult = Union['DeterministicBreedResult', 'NondeterministicBreedResult']

class PossibleGenotype:
	def __init__(self, owner_result: 'DeterministicBreedResult', child: flower.Flower, percent_color: float, percent_parent: float):
		self.child = child
		self.score = 0
		self.percent_parent = percent_parent
		self.percent_color = percent_color
		self.dist = 0
		self.result = owner_result

	def is_deterministic_color(self) -> bool:
		return self.percent_color == 1.0

	def is_deterministic_breed(self) -> bool:
		return self.result.is_deterministic()

	@property
	def expected_steps(self) -> float:
		return 1.0/self.percent_parent + max(self.result.p1_expected, self.result.p2_expected)

	def get_print_tuple(self):
		print_tuple = (
			self.result.p1.shorthand(),
			self.result.p2.shorthand(),
			self.child.shorthand(),
			self.percent_color,
			self.score,
			self.percent_parent,
			self.dist
		)
		return print_tuple

	def __str__(self) -> str:
		return pprint.pformat(self.get_print_tuple())

	def __eq__(self, other):
		my_tuple = (
			self.result.p1,
			self.result.p2,
			self.child,
			self.percent_color,
			self.score,
			self.percent_parent,
			self.dist
		)
		other_tuple = (
			other.result.p1,
			other.result.p2,
			other.child,
			other.percent_color,
			other.score,
			other.percent_parent,
			other.dist
		)
		return my_tuple == other_tuple

	def __hash__(self, other):
		return hash((
			self.result.p1,
			self.result.p2,
			self.child,
			self.percent_color,
			self.score,
			self.percent_parent,
			self.dist
		))

class NondeterministicBreedResult:
	def __init__(self):
		self._genotypes = []

	def get_deterministic_genotypes(self) -> Sequence[Tuple[int, PossibleGenotype]]:
		return [(idx, g) for idx, g in enumerate(self.genotypes) if g.is_deterministic_color()]

	def get_nondeterministic_genotypes(self) -> Sequence[Tuple[int, PossibleGenotype]]:
		return [(idx, g) for idx, g in enumerate(self.genotypes) if not g.is_deterministic_color()]

	@property
	def genotypes(self) -> List[PossibleGenotype]:
		return self._genotypes

	def is_deterministic(self) -> bool:
		return False


class DeterministicBreedResult:
	def __init__(self, p1: PotentialBreeder, p2: PotentialBreeder):
		"""Create a new deterministic breed result.
		:param p1: the first parent.
		:param p2: the second parent.
		"""
		self.parent1 = p1.flower
		self.parent2 = p2.flower
		self.p1_expected = p1.expected_steps
		self.p2_expected = p2.expected_steps
		self._genotypes: List[PossibleGenotype] = []

	def add_genotype(self, child: flower.Flower, percent_color: float, percent_parent: float) -> PossibleGenotype:
		pg = PossibleGenotype(self, child, percent_color, percent_parent)
		self._genotypes.append(pg)
		return pg

	def get_deterministic_genotypes(self) -> Sequence[Tuple[int, PossibleGenotype]]:
		return [(idx, g) for idx, g in enumerate(self.genotypes) if g.is_deterministic_color()]

	def get_nondeterministic_genotypes(self) -> Sequence[Tuple[int, PossibleGenotype]]:
		return [(idx, g) for idx, g in enumerate(self.genotypes) if not g.is_deterministic_color()]

	@property
	def genotypes(self) -> List[PossibleGenotype]:
		return self._genotypes

	def is_deterministic(self) -> bool:
		return True

	@property
	def p1(self) -> flower.Flower:
		return self.parent1

	@property
	def p2(self) -> flower.Flower:
		return self.parent2


def get_printable_tuple(t):
	printed_items = []
	for x in t:
		if isinstance(x, flower.Flower):
			printed_items.append(x.shorthand())
		else:
			printed_items.append(x)
	return tuple(printed_items)

def get_printable_map(m):
	printed_items = {}
	for k in m:
		if isinstance(k, flower.Flower):
			newk = k.shorthand()
		else:
			newk = k
		v = m[k]
		if isinstance(v, flower.Flower):
			newv = v.shorthand()
		else:
			newv = v
		printed_items[newk] = newv
	return printed_items

def have_visited(flower):
	return False

def remove_cd_results_already_in_bp(res, bp):
	"""Remove all deterministic-by-color results that are already in potential breeders (bp)
	with score less or equal to expected)"""
	new_res = []
	for r in res:
		if r.is_deterministic_color():
			if r.child in bp:
				if bp[r.child].expected_steps <= r.expected_steps:
					# then dont add it
					continue
		new_res.append(r)
	return new_res

def is_deterministic_color(br):
	"""Check if this breed result is deterministic by color; that is, in C_d)"""
	return br['%color'] == 1.0

def print_genos(genos):
	pprint.pprint([x.get_print_tuple() for x in genos])
	print()

#state_stack = []

def execute_step(potential_breeders, target, depth):
	pairs = itertools.combinations_with_replacement([b.flower for b in potential_breeders.values()], 2)
	breed_results = []
	for p in pairs:
		possible = p[0].get_possible_children_with(p[1])
		br = DeterministicBreedResult(potential_breeders[p[0]], potential_breeders[p[1]])
		for c in possible:
			child = c[0]
			parent_percent = c[1]
			color_percent = c[2]
			geno = br.add_genotype(child, color_percent, parent_percent)

			# get distance
			geno.dist = child.distance_from(target)

			# score the genotype
			same_as_parent = child == p[0] or child == p[1]
			dist_parent = min(p[0].distance_from(target), p[1].distance_from(target))
			if dist_parent < geno.dist and not have_visited(child):
				score = 1
			elif dist_parent == geno.dist and same_as_parent:
				score = 2
			elif dist_parent < geno.dist and have_visited(child):
				score = 3
			elif dist_parent == geno.dist and not same_as_parent:
				score = 4
			elif dist_parent > geno.dist:
				score = 5
			geno.score = score

			# get the expected distance
		breed_results.append(br)
	breeds = []
	for res in breed_results:
		for geno in res.genotypes:
			breeds.append(geno)

	print_genos(breeds)
	breeds = remove_cd_results_already_in_bp(breeds, potential_breeders)
	print_genos(breeds)
	breeds = sorted(breeds, key=lambda x: (x.percent_color, x.score, x.percent_color), reverse=True)
	print_genos(breeds)
	#for b in breeds:
	#	## this all assumes B_d; deterministic parent flowers
	#	if is_deterministic_color(b):
	#		# we already know that any dterministic color left is not in bp, so add it
	#		step = PlanStep(StepType.BREED, {'p1': b['p1'], 'p2': b['p2']})
	#		full_plan = bp_p1.plan + bp_p2.plan + [step]
	#		potential_breeders.append(PotentialBreeder(b['child'], expected_steps, full_plan))
	#	else:
	#		## if everything in the phenotype is scored at 2, discard the entire path

	return breeds

target = flower.Flower(flower.Species.PANSY, 2, 0, 2)

starter_breeders = {
	flower.WhiteSeedPansy: PotentialBreeder(flower.WhiteSeedPansy, 0, [PlanStep(StepType.START, {})]),
	flower.YellowSeedPansy: PotentialBreeder(flower.YellowSeedPansy, 0, [PlanStep(StepType.START, {})]),
	flower.RedSeedPansy: PotentialBreeder(flower.RedSeedPansy, 0, [PlanStep(StepType.START, {})])
}

br = execute_step(starter_breeders, target, 0)
