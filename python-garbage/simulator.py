import flower
import planner
import itertools
import pprint
from typing import Any, Dict, List, Union, Sequence, Tuple, Optional

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

def print_breeders(breeders, tabs=0):
	tab_before = "  " * tabs
	print(tab_before + "(breeders:)")
	for fl in breeders:
		br = breeders[fl]
		print("{:s}({:s}, steps={:.3f})".format(tab_before, br.flower.shorthand(), br.expected_steps))
	print()

#state_stack = []

def execute_step(potential_breeders: Dict[flower.Flower, planner.PotentialBreeder], target: flower.Flower, depth):
	pairs = itertools.combinations_with_replacement([b.flower for b in potential_breeders.values()], 2)
	breed_results = []
	for p in pairs:
		possible = p[0].get_possible_children_with(p[1])
		br = planner.DeterministicBreedResult(potential_breeders[p[0]], potential_breeders[p[1]])
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

	print("INITIAL:")
	print_genos(breeds)
	print_breeders(potential_breeders, tabs=1)
	breeds = planner.remove_cd_breeds_already_in_bp(breeds, potential_breeders)
	print("REMOVED Cd ALREADY PRESENT:")
	print_genos(breeds)
	print_breeders(potential_breeders, tabs=1)
	breeds = sorted(breeds, key=lambda x: (x.percent_color, x.score, x.percent_color), reverse=True)
	print("SORTED:")
	print_genos(breeds)
	print_breeders(potential_breeders, tabs=1)
	breeds = planner.remove_cnd_breeds_already_in_bp(breeds, potential_breeders)
	print("REMOVED Cnd ALREADY PRESENT:")
	print_genos(breeds)
	print_breeders(potential_breeders, tabs=1)
	for b in breeds:
		## this all assumes B_d; deterministic parent flowers
		if b.is_deterministic_color():
			# we already know that any deterministic color left is not in bp, so add it
			step = planner.PlanStep(planner.StepType.BREED, {'p1': b.result.p1, 'p2': b.result.p2})
			full_plan = potential_breeders[b.result.p1].plan
			full_plan += potential_breeders[b.result.p2].plan
			full_plan += [step]
			potential_breeders[b.child] = planner.PotentialBreeder(b.child, b.expected_steps, full_plan)
		else:
			## if everything in the phenotype is scored at 2, discard the entire path
			pass

	return breeds

target = flower.Flower(flower.Species.PANSY, 2, 0, 2)


starter_breeders = {
	flower.WhiteSeedPansy: planner.PotentialBreeder(
		flower.WhiteSeedPansy, 0, [planner.PlanStep(planner.StepType.START, {})]),
	flower.YellowSeedPansy: planner.PotentialBreeder(
		flower.YellowSeedPansy, 0, [planner.PlanStep(planner.StepType.START, {})]),
	flower.RedSeedPansy: planner.PotentialBreeder(
		flower.RedSeedPansy, 0, [planner.PlanStep(planner.StepType.START, {})])
}

br = execute_step(starter_breeders, target, 0)
