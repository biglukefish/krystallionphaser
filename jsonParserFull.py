import os
import json
from pprint import pprint
import pdb

coords = []
bee_key = 1
ladybug_key = 2
bat_key = 4
piranha_key = 17
frog_key = 13
ape_key = 6
blocker_key = 7
balloon_key = 8
exit_key = 11
krystal_key = 12
ghost_key = 14
coin_key = 10
key_key = 30
alien_key = 31
fireball_key = 32
krystal = []
bees = []
ladybugs = []
piranhas = []
bats = []
frogs = []
ghosts = []
balloons = []
blockers = []
exit = []
coins = []
keys = []
alien = []
fireball = []
mapwidth = []
mapheight = []
gameList = []
file_list = []

def create_leveldict(krystal, bees, ladybugs, piranhas, bats, frogs, balloons, blockers, ghosts, coins, keys, alien, fireball, mapwidth, mapheight):
	
	newdict = dict()
	newdict['krystal_loc'] = krystal[:]
	newdict['bee_locs'] = bees[:]
	newdict['ladybug_locs'] = ladybugs[:]
	newdict['piranha_locs'] = piranhas[:]
	newdict['bat_locs'] = bats[:]
	newdict['frog_locs'] = frogs[:]
	newdict['balloon_locs'] = balloons[:]
	newdict['blocker_locs'] = blockers[:]
	newdict['exit'] = exit[:]
	newdict['map_width'] = mapwidth * 1
	newdict['map_height'] = mapheight * 1
	newdict['ghost_locs'] = ghosts[:]
	newdict['coin_locs'] = coins[:]
	newdict['key_loc'] = keys[:]
	newdict['alien_loc'] = alien[:]
	newdict['fireball_loc'] = fireball[:]

	return newdict

	
for (path, dirs, files) in os.walk('levelData/'):
	for name in files:
		fullname = 'levelData/' + name
		file_list.append(fullname)



for i in range(len(file_list)):
	with open(file_list[i]) as data_file:
		data = json.load(data_file)

	newlist = data['layers'][3]['data']

	bees[:] = []
	ladybugs[:] = []
	piranhas[:] = []
	bats[:] = []
	ghosts[:] = []
	frogs[:] = []
	balloons[:] = []
	blockers[:] = []
	exit[:] = []
	coins[:] = []
	coords[:] = []
	krystal[:] = []
	keys[:] = []
	alien[:] = []
	fireball[:] = []
	mapheight = 0
	mapwidth = 0

	mapheight = data['height']
	mapwidth = data['width']
	
	for j in range(len(newlist)):
		coords.append([newlist[j], (j % mapwidth) * 64, (j / mapwidth) * 64])

	newlist[:] = []

	for elem in coords:
		if elem[0] == krystal_key:
			krystal.append([elem[1], elem[2]])
		if elem[0] == bee_key:
			bees.append([elem[1], elem[2]])
		if elem[0] == ladybug_key:
			ladybugs.append([elem[1], elem[2]])
		if elem[0] == piranha_key:
			piranhas.append([elem[1], elem[2]])
		if elem[0] == bat_key:
			bats.append([elem[1], elem[2]])
		if elem[0] == ghost_key:
			ghosts.append([elem[1], elem[2]])
		if elem[0] == frog_key:
			frogs.append([elem[1], elem[2]])
		if elem[0] == balloon_key:
			balloons.append([elem[1], elem[2]])
		if elem[0] == blocker_key:
			blockers.append([elem[1], elem[2]])
		if elem[0] == exit_key:
			exit.append([elem[1], elem[2]])
		if elem[0] == coin_key:
			coins.append([elem[1], elem[2]])
		if elem[0] == key_key:
			keys.append([elem[1], elem[2]])
		if elem[0] == alien_key:
			alien.append([elem[1], elem[2]])
		if elem[0] == fireball_key:
			fireball.append([elem[1], elem[2]])



	gameList.append(create_leveldict(krystal, bees, ladybugs, piranhas, 
		bats, frogs, balloons, blockers, ghosts, coins, keys, alien, fireball, (mapwidth * 64), (mapheight * 64)))

with open('js/gamedata.js', 'w') as file:
	file.write('// this file is auto-generated from a script that maps Tiled values to a js object, don\'t edit it directly' + '\n')
	file.write('var gameData = ' + str(gameList))
	



