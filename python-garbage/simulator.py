import flower
import planner
import pprint
from typing import List, Sequence


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
		result_keys = sorted(full_results.keys(), key=lambda x: x.name)
		for c in result_keys:
			color = c.name
			color_results = full_results[c]
			print(color + " - {:.2%}".format(color_results['total']))
			for v in sorted(color_results['variants']):
				print(" * " + v[0] + ": {:.2%}".format(v[1]))
		print()
	return full_results


def quantize(num, factor):
	return round(num * factor) / factor


# simulate_breeding(r1, b0)
# simulate_breeding(r1, b1)
# simulate_breeding(r2, b1)
# simulate_breeding(r2, b0)

def get_num_turns_to_purple(b0, r1, max_attempts=10000):
	blue_flower = b0
	red_flower = r1
	breeds = 0
	# print("0: Combining " + str(red_flower) + " + " + str(blue_flower))
	for x in range(max_attempts):
		new_flower = blue_flower.breed_with(red_flower)
		breeds += 1
		if new_flower.get_color() == flower.Color.PURPLE:
			# print(str(breeds) + ": Got purple")
			return breeds
		elif new_flower.get_color() == flower.Color.RED:
			red_flower = new_flower
			# print(str(breeds) + ": Got new red; now combining " +
			# str(red_flower) + " + " + str(blue_flower))
		elif new_flower.get_color() == flower.Color.BLUE:
			blue_flower = new_flower
			# print(str(breeds) + ": Got new blue; now combining " +
			# str(red_flower) + " + " + str(blue_flower))
	return -1


def get_num_turns_to_purple_hybrid_only(r1, max_attempts=10000):
	breeds = 0
	for x in range(max_attempts):
		new_flower = r1.breed_with(r1)
		breeds += 1
		if new_flower.get_color() == flower.Color.PURPLE:
			return breeds
	return -1


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


def print_genos(genos):
	pprint.pprint([x.get_print_tuple() for x in genos])
	print("(total: " + str(len(genos)) + ")")
	print()


def print_breeders(breeders: planner.BreederSet, tabs=0):
	tab_before = "  " * tabs
	print(tab_before + "(breeders:)")
	for tree in breeders.breeder_trees:
		line = tab_before + "["
		for idx, path in enumerate(tree):
			odds = path[0]
			br = path[1]
			fmt = "({:.3f}, ({:s}, steps={:.3f}))"
			line += fmt.format(odds, br.flower.shorthand(), br.expected_steps)
			if idx + 1 < len(tree):
				line += ","
		line += "]"
		print(line)
	print()

# state_stack = []


def execute_step(
	potential_breeders: planner.BreederSet,
	target: flower.Flower, depth
):

	breed_results: List[planner.DeterministicBreedResult] = []
	for p in potential_breeders.pairs:
		res_list = potential_breeders.breed_flowers(p[0], p[1], target)
		breed_results += res_list
	breeds: List[planner.PossibleGenotype] = []
	for res in breed_results:
		for geno in res.genotypes:
			breeds.append(geno)

	print("INITIAL:")
	print_genos(breeds)
	print_breeders(potential_breeders, tabs=1)
	#breeds = potential_breeders.filter_out_cd_breeds_already_present(breeds)

	# add all deterministics to Bp immediately; they may knock out Cnds
	# in next step

	new_breeds = []
	# this all assumes B_d; deterministic parent flowers
	for b in breeds:
		if b.is_deterministic_breed():
			if b.is_deterministic_color():
				step = planner.PlanStep(
					planner.StepType.BREED, {'p1': b.result.p1, 'p2': b.result.p2}
				)
				pot_p1 = potential_breeders.get_breeder_with_min_expected(b.result.p1)
				pot_p2 = potential_breeders.get_breeder_with_min_expected(b.result.p2)
				full_plan = pot_p1.plan
				full_plan += pot_p2.plan
				full_plan += [step]
				if b.child in potential_breeders:
					extant = potential_breeders.get_breeder_with_min_expected(b.child)
					if extant.expected_steps < b.expected_steps:
						# TODO: consider adding anyways if result is deterministic and there
						# is currently no deterministic breeder. counterpoint: if expected
						# is higher, then during simulations statistically it should not
						# be possible to get a better result over a sufficiently large
						# set of simulations.

						# if it isn't added to potential_breeders, this continue
						# skips the add and removes it from the result
						continue
				pot = planner.PotentialBreeder(b.child, b.expected_steps, full_plan)
				potential_breeders.add_deterministic(pot)
		new_breeds.append(b)
	breeds = new_breeds

	print("ADDED Cd TO Bp AND REMOVED Cd ALREADY PRESENT:")
	print_genos(breeds)
	print_breeders(potential_breeders, tabs=1)

	breeds = potential_breeders.filter_out_cnd_breeds_already_present(breeds)
	print("REMOVED Cnd ALREADY PRESENT:")
	print_genos(breeds)
	print_breeders(potential_breeders, tabs=1)

	breeds = sorted(
		breeds,
		key=lambda x: (x.percent_color, x.score, x.percent_color),
		reverse=True
	)
	print("SORTED:")
	print_genos(breeds)
	print_breeders(potential_breeders, tabs=1)

	return breeds


target = flower.Flower(flower.Species.PANSY, 2, 0, 2)


# need way to represent both Bd and Bnd in potential breeders map.
# might need to extend to a new class
# x -> {'deterministic': x, 'non-deterministic': y}

starter_breeders = planner.BreederSet(
	[
		planner.PotentialBreeder(
			flower.WhiteSeedPansy, 0,
			[planner.PlanStep(planner.StepType.START, {})]),
		planner.PotentialBreeder(
			flower.YellowSeedPansy, 0,
			[planner.PlanStep(planner.StepType.START, {})]),
		planner.PotentialBreeder(
			flower.RedSeedPansy, 0,
			[planner.PlanStep(planner.StepType.START, {})])
	]
)

br = execute_step(starter_breeders, target, 0)
