CREATE TABLE total_yields AS
SELECT y.area, y.year, y.item as crop, y.value as yield, y.value_1 as yield_1, y.value_2 as yield_2, y.value_3 as yield_3, y.value_4 as yield_4, y.value_5 as yield_5,
	te.value as avg_temp, te.value_1 as avg_temp_1, te.value_2 as avg_temp_2, te.value_3 as avg_temp_3, te.value_4 as avg_temp_4, te.value_5 as avg_temp_5,
	ll.latitude, ll.longitude,
	po.value as tonnes_potash, po.value_1 as tonnes_potash_1, po.value_2 as tonnes_potash_2, po.value_3 as tonnes_potash_3, 
	ph.value as tonnes_phosph, ph.value_1 as tonnes_phosph_1, ph.value_2 as tonnes_phosph_2, ph.value_3 as tonnes_phosph_3, 
	pe.value as tonnes_pesticide, pe.value_1 as tonnes_pesticide_1, pe.value_2 as tonnes_pesticide_2, pe.value_3 as tonnes_pesticide_3, 
	ni.value as tonnes_nitrogen, ni.value_1 as tonnes_nitrogen_1, ni.value_2 as tonnes_nitrogen_2, ni.value_3 as tonnes_nitrogen_3, 
	ar.value as arable_land,
	ag.value as ag_land
FROM yield as y
INNER JOIN lat_long as ll
ON y.area = ll.area
INNER JOIN temperature as te
ON y.area = te.area AND y.year = te.year
INNER JOIN potash as po
ON te.area = po.area AND te.year = po.year
INNER JOIN phosphate as ph
ON po.area = ph.area AND po.year = ph.year
INNER JOIN pesticides as pe
ON ph.area = pe.area AND ph.year = pe.year
INNER JOIN nitrogen as ni
ON pe.area = ni.area AND pe.year = ni.year
INNER JOIN arable as ar
ON ni.area= ar.area AND ni.year = ar.year
INNER JOIN agri as ag
ON ar.area= ag.area AND ar.year=ag.year;

SELECT DISTINCT area FROM total_yields;
-- Select distinct shows 106 countries which matches our nb