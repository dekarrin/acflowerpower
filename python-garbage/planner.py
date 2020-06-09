import flower
from enum import Enum, auto
from typing import Dict, Any, List, Union, Sequence, Tuple, Optional
import pprint


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
		self._branches_by_phenotype: Optional[Dict[flower.Color, List[PossibleGenotype]]] = None

	@property
	def phenotypes(self) -> Dict[flower.Color, List[PossibleGenotype]]:
		if self._branches_by_phenotype is None:
			self._update_branches()
		if self._branches_by_phenotype is not None:
			return self._branches_by_phenotype
		else:
			raise ValueError("problem generating branches by phenotype")

	@property
	def phenotype_probability_tree(self) -> Dict[flower.Color, List[Tuple[float, flower.Flower]]]:
		colors = {}
		for c in self.phenotypes:
			colors[c] = [(g.percent_color, g.child) for g in self.phenotypes[c]]
		return colors

	def add_genotype(self, child: flower.Flower, percent_color: float, percent_parent: float) -> PossibleGenotype:
		pg = PossibleGenotype(self, child, percent_color, percent_parent)
		self._genotypes.append(pg)
		self._branches_by_phenotype = None
		return pg

	def get_genotype_by_child(self, child: flower.Flower) -> Optional[PossibleGenotype]:
		geno_list = [g for g in self.genotypes if g.child == child]
		# sanity check to ensure we didn't somehow get more than one potential
		# genotype of the same child in a deterministic breed result

		if len(geno_list) > 1:
			raise ValueError("multiple items with same genotype found in list of potential genotypes")
		if len(geno_list) < 1:
			return None
		else:
			return geno_list[0]

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

	def _update_branches(self):
		branches: Dict[flower.Color, List[PossibleGenotype]] = {}
		for g in self.genotypes:
			c = g.child.get_color()
			if c not in branches:
				branches[c] = []
			branches[c].append(g)
		self._branches_by_phenotype = branches


def remove_cd_breeds_already_in_bp(breeds, bp):
	"""Remove all deterministic-by-color breeds (C_d) that are already in
	potential breeders (b_p) whose expected steps is less than or equal to the
	expected steps of the plan already in b_p)"""
	new_breeds = []
	for br in breeds:
		if br.is_deterministic_color():
			if br.child in bp:
				if bp[br.child].expected_steps <= br.expected_steps:
					# then dont add it
					continue
		new_breeds.append(br)
	return new_breeds

def remove_cnd_breeds_already_in_bp(breeds, bp):
	"""Remove all non-deterministic-by-color breeds (C_nd) that are already in
	potential breeders (b_p) where each genotype in that color for the parents
	has expected steps less than or equal to the expected steps of the plan
	already in b_p)"""
	new_breeds = []
	for br in breeds:
		if not br.is_deterministic_color():
			# no need to check if all the genotypes for this phenotype are same
			# as breeders (score of 2); instead we will check that all genotypes
			# are already in b_p with an expected steps in bp less than or
			# equal to the one in results. We assume that parents will always be
			# in potential breeders, and since going back to parents increases
			# number of expected steps, this will cover the "same as breeders"
			# case as well. NOTE: that is true as long as that initial
			# assumption holds.
			remove_from_breeds = True
			for possible_geno in br.result.phenotypes[br.child.get_color()]:
				if possible_geno.child in bp:
					# if one of them IS good, mark this genotype as not removable
					# and stop checking
					if bp[possible_geno.child].expected_steps > possible_geno.expected_steps:
						remove_from_breeds = False
						break
				else:
					remove_from_breeds = False
					break
			if remove_from_breeds:
				continue  # continue the loop without hitting the add
		new_breeds.append(br)
	return new_breeds
