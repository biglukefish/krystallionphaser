import os
import json
import copy

coords = []
map_width = []
map_height = []
game_list = []
new_list = []
file_list = []


# this walks through every file in the level folder and creates a list
# of filepaths	
for (path, dirs, files) in os.walk('levelData/'):
	for name in files:
		full_name = 'levelData/' + name
		file_list.append(full_name)

# this opens each json file using the list of filepaths
for i in range(len(file_list)):
	with open(file_list[i]) as data_file:
		data = json.load(data_file)

	# this makes sure the list is cleared from previous loop iterations, then
	# pulls the data string from the json file
	new_list[:] = []
	new_list = data['layers'][3]['data']

	# this maps each object to: 1) its corresponding key in the data file, and 2) an empty
	# list that will be filled out with coordinates.  This will get reset each
	# iteration of the for loop
	game_objects = {'bees':[1, []], 'ladybugs':[2, []], 'bats':[4, []], 'piranhas':[17,[]],
				'frogs':[13, []], 'blockers':[7, []], 'balloon':[8, []], 'exit':[11, []],
				'krystal':[12, []], 'ghost':[14, []], 'coins':[10, []], 'key':[30, []],
				'alien':[31,[]], 'fireball':[32, []], 'spikes':[33, []]}


	map_height = data['height']
	map_width = data['width']
		
	coords[:] = [] # make sure we clear the coords list from the previous loop

	# location data from the json file is a single string, so x/y coordinates on the 
	# map must be calculated from the size of the map's width and height.
	for j in range(len(new_list)):
		coords.append([new_list[j], (j % map_width) * 64, (j / map_width) * 64])


	# fill out the level with each object's location(s)
	for elem in coords:
		for key in game_objects:
			if elem[0] == game_objects[key][0]:
				game_objects[key][1].append([elem[1], elem[2]])

	# add in map size to game_objects
	game_objects['map_width'] = map_width * 64
	game_objects['map_height'] = map_height * 64

	# append the level data to the game_list.  Each element of the game_list represents
	# a separate level.  Must do a deep copy here since game_objects will get overwritten
	# on the next loop.
	game_list.append(copy.deepcopy(game_objects))
	

# Export the data to a .js file used in the game
with open('js/gamedata.js', 'w') as file:
	file.write('// this file is auto-generated from a script that maps Tiled values to a js object, don\'t edit it directly' + '\n')
	file.write('var gameData = ' + str(game_list))
	



