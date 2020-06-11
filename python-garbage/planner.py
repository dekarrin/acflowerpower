import flower
from enum import Enum, auto
from typing import Dict, Any, List, Union, Sequence, Tuple, Optional, Iterable
import pprint
import itertools


class StepType(Enum):
	START = auto()
	BREED = auto()
	TEST = auto()


class PlanStep:
	def __init__(self, type: StepType, data: Dict[str, Any]):
		self.type = type
		self.data = data


class PotentialBreeder:
	def __init__(
		self, f: flower.Flower, expected_steps: float, plan: List[PlanStep]
	):
		self.flower = f
		self.expected_steps = expected_steps
		self.plan = plan


BreedResult = Union['DeterministicBreedResult', 'NondeterministicBreedResult']
BreederProbTree = Sequence[Tuple[float, PotentialBreeder]]


class PossibleGenotype:
	def __init__(
		self, owner_result: 'DeterministicBreedResult', child: flower.Flower,
		percent_color: float, percent_parent: float
	):
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
		steps = 1.0/self.percent_parent
		steps += max(self.result.p1_expected, self.result.p2_expected)
		return steps

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

	def get_deterministic_genotypes(self) -> Sequence[PossibleGenotype]:
		return [g for g in self.genotypes if g.is_deterministic_color()]

	def get_nondeterministic_genotypes(self) -> Sequence[PossibleGenotype]:
		return [g for g in self.genotypes if not g.is_deterministic_color()]

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
		BranchesType = Optional[Dict[flower.Color, List[PossibleGenotype]]]
		self._branches_by_phenotype: BranchesType = None

	@property
	def phenotypes(self) -> Dict[flower.Color, List[PossibleGenotype]]:
		if self._branches_by_phenotype is None:
			self._update_branches()
		if self._branches_by_phenotype is not None:
			return self._branches_by_phenotype
		else:
			raise ValueError("problem generating branches by phenotype")

	@property
	def phenotype_probability_tree(
		self
	) -> Dict[flower.Color, List[Tuple[float, flower.Flower]]]:
		colors = {}
		for c in self.phenotypes:
			colors[c] = [(g.percent_color, g.child) for g in self.phenotypes[c]]
		return colors

	def add_genotype(
		self, child: flower.Flower, percent_color: float, percent_parent: float
	) -> PossibleGenotype:
		pg = PossibleGenotype(self, child, percent_color, percent_parent)
		self._genotypes.append(pg)
		self._branches_by_phenotype = None
		return pg

	def get_genotype_by_child(
		self,
		child: flower.Flower
	) -> Optional[PossibleGenotype]:
		geno_list = [g for g in self.genotypes if g.child == child]
		# sanity check to ensure we didn't somehow get more than one potential
		# genotype of the same child in a deterministic breed result

		if len(geno_list) > 1:
			msg = "multiple items with same genotype found in list"
			msg += " of potential genotypes"
			raise ValueError(msg)
		if len(geno_list) < 1:
			return None
		else:
			return geno_list[0]

	def get_deterministic_genotypes(self) -> Sequence[PossibleGenotype]:
		return [g for g in self.genotypes if g.is_deterministic_color()]

	def get_nondeterministic_genotypes(self) -> Sequence[PossibleGenotype]:
		return [g for g in self.genotypes if not g.is_deterministic_color()]

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


class BreederSet:
	"""Special case of a set, this contains all of the PotentialBreeders than
	can be used for breeding. Due to the fact that deterministic and
	nondeterministic breeders may be included, but that there can only be one
	deterministic breeder for each flower, a simple list or set is insufficient.

	The result of the index operation `breeder_set[key]`` accepts a flower as a
	key and returns the potential breeder with the lowest number of expected
	steps, or raises KeyError if there is no potential breeder for that flower.

	Similarily, `breeder_set.get(key, default)`` returns the same if a potential
	breeder exists for the given flower, or the default value if no potential
	breeder exists for that flower. The special case of breeder_set.get(key)
	does the same but uses None as the default value.

	The returned potential breeder may be deterministic or non-deterministic
	and so this should not be relied on for getting breedable flowers;
	breeder_set.pairs should be used instead. Similarily, it is not possible to
	iterate over the keys in a breeder_set.

	It is not valid to set the value of an index of breeder_set as there is no
	way to tell if it should be deterministic or non-deterministic.

	It is not valid to call `del breeder_set`.
	"""

	def __init__(self, initial_breeders: Iterable[PotentialBreeder]):
		"""
		:param initial_breeders: must be deterministic breeders only.
		"""
		self.breeders_d: Dict[flower.Flower, PotentialBreeder] = {}
		self.breeders_nd: Dict[flower.Flower, Sequence[BreederProbTree]] = {}
		self.unique_breeders_nd: Sequence[BreederProbTree] = []
		for br in initial_breeders:
			self.breeders_d[br.flower] = br

		# b_nd needs to be stored as both a map of flowers to list of all
		# present b_nd trees that contain a potential breeder for that flower,
		# for retrieval by flower, as well as a list of all unique prob trees,
		# for iteration.

	@property
	def breeder_trees(self):
		Trees = Iterable[BreederProbTree]
		b_d_trees: Trees = [((1.0, b)) for b in self.breeders_d.values()]
		b_nd_trees: Trees = [b for b in self.unique_breeders_nd.values()]
		all_trees: Trees = b_d_trees + b_nd_trees
		return all_trees

	@property
	def pairs(self):
		all_trees = self.breeder_trees
		return itertools.combinations_with_replacement(all_trees, 2)

	def breed_flowers(
		self, p1_tree: BreederProbTree, p2_tree: BreederProbTree,
		target: flower.Flower
	) -> Sequence[DeterministicBreedResult]:
		breed_results: List[DeterministicBreedResult] = []
		if len(p1_tree) < 1 or len(p2_tree) < 1:
			msg = "both breeder probability trees must contain at least one item"
			raise ValueError(msg)
		if len(p1_tree) == 1 and len(p2_tree) == 1:
			# fully deterministic breed result
			p1 = p1_tree[0][1]
			p2 = p2_tree[0][1]
			possible = p1.flower.get_possible_children_with(p2.flower)
			br = DeterministicBreedResult(p1, p2)
			for c in possible:
				child = c[0]
				parent_percent = c[1]
				color_percent = c[2]
				geno = br.add_genotype(child, color_percent, parent_percent)
				geno.dist = child.distance_from(target)
				geno.score = self.score_genotype(
					p1.flower, p2.flower, child, target)
			breed_results.append(br)
		return breed_results

	def score_genotype(
		self, p1: flower.Flower, p2: flower.Flower, child: flower.Flower,
		target: flower.Flower
	) -> int:
		dist = child.distance_from(target)
		same_as_parent = child == p1 or child == p2
		dist_parent = min(p1.distance_from(target), p2.distance_from(target))
		if dist_parent < dist and not self.have_visited(child):
			score = 1
		elif dist_parent == dist and same_as_parent:
			score = 2
		elif dist_parent < dist and self.have_visited(child):
			score = 3
		elif dist_parent == dist and not same_as_parent:
			score = 4
		elif dist_parent > dist:
			score = 5
		return score

	def have_visited(self, f: flower.Flower) -> bool:
		return False

	def __getitem__(self, key):
		bd = self.breeders_d.get(key)
		nds = self.breeders_nd.get(key)
		if bd is None and nds is None:
			raise KeyError(key)



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
