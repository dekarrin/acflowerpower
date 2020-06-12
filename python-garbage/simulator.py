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

# state_stack = []


target = flower.Flower(flower.Species.PANSY, 2, 0, 2)

breeder = planner.BreedPlanner(target, flower.WhiteSeedPansy, flower.YellowSeedPansy, flower.RedSeedPansy)
br = breeder.find_plan()
