/*
The first list of nestedObjectives contains objectives that will appear anywhere on the board.
The other lists contain mutually exclusive objectives. Multiple objectives from the same list will not appear in the same line.
*/
const nestedObjectives = [
	['4+ E Tanks','6+ E Tanks','8+ E Tanks','70+ Missiles','85+ Missiles','100+ Missiles','115+ Missiles',
	'8 Super Missiles','10 Super Missiles','12 Super Missiles','6 Power Bombs','8 Power Bombs','10 Power Bombs',
	'Charge Beam','Plasma Beam','Ice Beam','Spider Ball','Spring Ball','Screw Attack','Speed Booster',
	'Kill the Surface Alpha','Kill the Research Station Alphas','Kill all Metroids inside Hydro Station',
	'Kill all Gammas in Tower','Kill the Zeta in Distribution Center',
	'Kill 5 Alpha Metroids','Kill 4 Gamma Metroids','Kill 3 Zeta Metroids',
	'Activate Mining Facility Machine','Activate Tower','Activate Distribution Center',
	'Golden Temple Super Missile','Golden Temple Power Bomb',
	'Hydro Station Super Missile','Breeding Grounds 2 Power Bomb','Industrial Complex Power Bomb','Tower Super Missile',
	'Tower Power Bomb','Super Missile in Lower Distribution Center','Power Bomb behind Distribution Center'],
	['Fully explore upper Tower','Fully explore GFS Thoth'],
	['Wave Beam','Skip Wave Beam'],
	['Spazer Beam','Skip Spazer Beam'],
	['Varia Suit','Gravity Suit','Collect only 1 of Varia Suit/Gravity Suit'],
	['High Jump Boots','Space Jump','Collect only 1 of High Jump/Space Jump'],
	['Kill all Metroids in Breeding Grounds 1','Kill all Metroids in Breeding Grounds 2',
	'Kill all Metroids inside Industrial Complex','Kill all Metroids in Mining Facility',
	'Kill all Alphas in Distribution Center','Kill all Gammas in Distribution Center'],
	['Finish inside a transport pipe','Finish in Research Team Room',
	'Finish in Gravity Suit Room','Finish inside GFS Thoth',
	'Finish in an elevator','Finish in Samus\'s ship'],
	['Defeat Arachnus','Defeat Torizo',
	'Defeat Tester','Defeat Tank Prototype',
	'Defeat Serris','Defeat Genesis']
];

const flattenedObjectives = nestedObjectives.flat();