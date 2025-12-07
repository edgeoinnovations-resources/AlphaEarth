/**
 * AlphaEarth Case Studies Database
 * 125 Educational Scenarios for Satellite Embedding Exploration
 *
 * The AlphaEarth Foundations Satellite Embedding dataset is produced by
 * Google and Google DeepMind.
 */

const CaseStudies = {
    categories: [
        {
            id: 'deforestation',
            name: 'Deforestation & Forest Dynamics',
            icon: '🌲',
            scenarios: [
                { id: 1, name: 'Amazon Deforestation Arc', lat: -8.5, lon: -55.0, zoom: 8, year1: 2017, year2: 2024, description: 'Monitor the "Arc of Deforestation" along Brazil\'s agricultural frontier where forest is converted to cattle ranching and soy production.', bands: ['A01', 'A16', 'A09'], mode: 'change' },
                { id: 2, name: 'Borneo Palm Oil Expansion', lat: 1.5, lon: 117.0, zoom: 9, year1: 2017, year2: 2023, description: 'Track conversion of tropical rainforest to palm oil plantations in Indonesian and Malaysian Borneo.', bands: ['A02', 'A14', 'A08'], mode: 'change' },
                { id: 3, name: 'Congo Basin Logging Roads', lat: 1.0, lon: 18.0, zoom: 8, year1: 2018, year2: 2024, description: 'Observe logging road network expansion into pristine Central African rainforest.', bands: ['A01', 'A12', 'A07'], mode: 'change' },
                { id: 4, name: 'Sumatra Peat Forest Loss', lat: 0.5, lon: 103.0, zoom: 9, year1: 2017, year2: 2022, description: 'Monitor peat swamp forest destruction and drainage for agriculture in Riau Province.', bands: ['A03', 'A15', 'A10'], mode: 'change' },
                { id: 5, name: 'Chaco Dry Forest Clearing', lat: -24.0, lon: -62.0, zoom: 8, year1: 2017, year2: 2024, description: 'Track rapid agricultural expansion into South America\'s Gran Chaco dry forest ecosystem.', bands: ['A04', 'A18', 'A11'], mode: 'change' },
                { id: 6, name: 'Madagascar Eastern Forests', lat: -18.5, lon: 48.5, zoom: 9, year1: 2017, year2: 2023, description: 'Monitor slash-and-burn agriculture impacts on unique Madagascar rainforests.', bands: ['A01', 'A16', 'A09'], mode: 'change' },
                { id: 7, name: 'Cerrado Savanna Conversion', lat: -14.0, lon: -47.0, zoom: 8, year1: 2018, year2: 2024, description: 'Observe agricultural transformation of Brazil\'s species-rich Cerrado savanna.', bands: ['A05', 'A19', 'A12'], mode: 'change' },
                { id: 8, name: 'Myanmar Teak Extraction', lat: 19.5, lon: 96.5, zoom: 9, year1: 2017, year2: 2022, description: 'Track selective logging patterns in Myanmar\'s valuable teak forests.', bands: ['A02', 'A14', 'A08'], mode: 'change' },
                { id: 9, name: 'Siberian Taiga Wildfires', lat: 63.0, lon: 125.0, zoom: 7, year1: 2019, year2: 2021, description: 'Observe massive wildfire scars in Siberian boreal forests linked to climate change.', bands: ['A06', 'A20', 'A13'], mode: 'change' },
                { id: 10, name: 'Papua New Guinea Highlands', lat: -5.5, lon: 145.0, zoom: 9, year1: 2017, year2: 2023, description: 'Monitor forest clearing for subsistence agriculture in PNG highlands.', bands: ['A01', 'A16', 'A09'], mode: 'change' },
                { id: 11, name: 'Canadian Boreal Mining', lat: 56.0, lon: -111.0, zoom: 8, year1: 2017, year2: 2024, description: 'Track oil sands mining impact on Alberta\'s boreal forest ecosystem.', bands: ['A07', 'A21', 'A14'], mode: 'change' },
                { id: 12, name: 'Laos Rubber Plantations', lat: 19.0, lon: 102.0, zoom: 9, year1: 2017, year2: 2022, description: 'Observe forest conversion to rubber monocultures in northern Laos.', bands: ['A03', 'A17', 'A10'], mode: 'change' },
                { id: 13, name: 'California Wildfire Recovery', lat: 38.5, lon: -122.5, zoom: 9, year1: 2017, year2: 2024, description: 'Monitor forest regeneration after major California wildfires.', bands: ['A08', 'A22', 'A15'], mode: 'change' },
                { id: 14, name: 'Southeast Asia Mangroves', lat: 10.0, lon: 106.5, zoom: 9, year1: 2017, year2: 2023, description: 'Track mangrove forest loss and restoration in Mekong Delta region.', bands: ['A01', 'A16', 'A09'], mode: 'change' },
                { id: 15, name: 'European Bark Beetle Damage', lat: 48.5, lon: 13.5, zoom: 9, year1: 2018, year2: 2023, description: 'Observe bark beetle epidemic impacts on Central European spruce forests.', bands: ['A09', 'A23', 'A16'], mode: 'change' }
            ]
        },
        {
            id: 'agriculture',
            name: 'Agricultural Landscapes',
            icon: '🌾',
            scenarios: [
                { id: 16, name: 'Nile Delta Agriculture', lat: 30.8, lon: 31.0, zoom: 9, year1: 2020, year2: 2020, description: 'Explore intensive irrigated agriculture patterns in Egypt\'s fertile Nile Delta.', bands: ['A10', 'A24', 'A17'], mode: 'embeddings' },
                { id: 17, name: 'US Corn Belt Patterns', lat: 41.5, lon: -93.0, zoom: 8, year1: 2020, year2: 2020, description: 'Analyze center-pivot irrigation and crop rotation in Iowa\'s agricultural heartland.', bands: ['A11', 'A25', 'A18'], mode: 'embeddings' },
                { id: 18, name: 'Punjab Wheat Fields', lat: 30.5, lon: 75.0, zoom: 8, year1: 2020, year2: 2020, description: 'Observe intensive wheat cultivation in India\'s breadbasket region.', bands: ['A12', 'A26', 'A19'], mode: 'embeddings' },
                { id: 19, name: 'Brazilian Soy Frontier', lat: -12.5, lon: -55.5, zoom: 8, year1: 2017, year2: 2024, description: 'Track soybean expansion into Mato Grosso\'s former forest and cerrado lands.', bands: ['A01', 'A16', 'A09'], mode: 'change' },
                { id: 20, name: 'Dutch Greenhouse Agriculture', lat: 52.0, lon: 4.5, zoom: 10, year1: 2020, year2: 2020, description: 'Explore high-tech greenhouse clusters in Netherlands\' Westland region.', bands: ['A13', 'A27', 'A20'], mode: 'embeddings' },
                { id: 21, name: 'California Central Valley', lat: 36.5, lon: -120.0, zoom: 8, year1: 2018, year2: 2022, description: 'Monitor drought impacts and fallowing in California\'s agricultural region.', bands: ['A14', 'A28', 'A21'], mode: 'change' },
                { id: 22, name: 'Mekong Rice Paddies', lat: 10.5, lon: 106.0, zoom: 9, year1: 2020, year2: 2020, description: 'Analyze triple-cropping rice systems in Vietnam\'s Mekong Delta.', bands: ['A15', 'A29', 'A22'], mode: 'embeddings' },
                { id: 23, name: 'Ethiopian Highlands Farming', lat: 9.0, lon: 38.5, zoom: 9, year1: 2020, year2: 2020, description: 'Observe traditional highland agriculture patterns in Ethiopia.', bands: ['A16', 'A30', 'A23'], mode: 'embeddings' },
                { id: 24, name: 'Australian Wheat Belt', lat: -32.0, lon: 118.0, zoom: 8, year1: 2019, year2: 2020, description: 'Compare drought vs normal year in Western Australia\'s wheat region.', bands: ['A17', 'A31', 'A24'], mode: 'change' },
                { id: 25, name: 'Ukraine Grain Fields', lat: 49.0, lon: 32.5, zoom: 8, year1: 2021, year2: 2023, description: 'Monitor agricultural disruption in Ukraine\'s productive farmland.', bands: ['A18', 'A32', 'A25'], mode: 'change' },
                { id: 26, name: 'Israel Precision Agriculture', lat: 32.0, lon: 35.0, zoom: 10, year1: 2020, year2: 2020, description: 'Explore advanced drip irrigation and intensive farming in Negev region.', bands: ['A19', 'A33', 'A26'], mode: 'embeddings' },
                { id: 27, name: 'Japanese Rice Terraces', lat: 37.5, lon: 138.0, zoom: 11, year1: 2020, year2: 2020, description: 'Observe traditional terraced rice paddies in Niigata Prefecture.', bands: ['A20', 'A34', 'A27'], mode: 'embeddings' },
                { id: 28, name: 'Spanish Olive Groves', lat: 37.8, lon: -4.5, zoom: 9, year1: 2020, year2: 2020, description: 'Analyze extensive olive cultivation in Andalusia, Spain.', bands: ['A21', 'A35', 'A28'], mode: 'embeddings' },
                { id: 29, name: 'Kenyan Flower Farms', lat: -0.3, lon: 36.3, zoom: 10, year1: 2020, year2: 2020, description: 'Explore commercial floriculture around Lake Naivasha, Kenya.', bands: ['A22', 'A36', 'A29'], mode: 'embeddings' },
                { id: 30, name: 'Argentine Pampas', lat: -35.0, lon: -61.0, zoom: 8, year1: 2020, year2: 2020, description: 'Observe large-scale grain and cattle operations in the Pampas.', bands: ['A23', 'A37', 'A30'], mode: 'embeddings' }
            ]
        },
        {
            id: 'urban',
            name: 'Urban Expansion & Development',
            icon: '🏙️',
            scenarios: [
                { id: 31, name: 'Dubai Urban Growth', lat: 25.2, lon: 55.3, zoom: 10, year1: 2017, year2: 2024, description: 'Track rapid urban development and artificial island expansion in Dubai.', bands: ['A24', 'A38', 'A31'], mode: 'change' },
                { id: 32, name: 'Lagos Megacity Expansion', lat: 6.5, lon: 3.4, zoom: 10, year1: 2017, year2: 2024, description: 'Monitor Africa\'s fastest-growing megacity spreading into lagoon and forest areas.', bands: ['A01', 'A16', 'A09'], mode: 'change' },
                { id: 33, name: 'Beijing Urban Sprawl', lat: 40.0, lon: 116.5, zoom: 9, year1: 2017, year2: 2023, description: 'Observe suburban expansion and new town development around Beijing.', bands: ['A25', 'A39', 'A32'], mode: 'change' },
                { id: 34, name: 'Dhaka Bangladesh Growth', lat: 23.8, lon: 90.4, zoom: 10, year1: 2017, year2: 2024, description: 'Track urbanization of floodplain areas in rapidly growing Dhaka.', bands: ['A26', 'A40', 'A33'], mode: 'change' },
                { id: 35, name: 'Phoenix Desert Sprawl', lat: 33.5, lon: -112.0, zoom: 9, year1: 2017, year2: 2024, description: 'Monitor urban expansion into Sonoran Desert around Phoenix, Arizona.', bands: ['A27', 'A41', 'A34'], mode: 'change' },
                { id: 36, name: 'Cairo Informal Settlements', lat: 30.0, lon: 31.3, zoom: 10, year1: 2018, year2: 2023, description: 'Observe growth of informal housing on agricultural land near Cairo.', bands: ['A28', 'A42', 'A35'], mode: 'change' },
                { id: 37, name: 'Shenzhen High-Rise Boom', lat: 22.5, lon: 114.1, zoom: 10, year1: 2017, year2: 2023, description: 'Track continuing transformation of Shenzhen\'s urban landscape.', bands: ['A29', 'A43', 'A36'], mode: 'change' },
                { id: 38, name: 'Mumbai Coastal Development', lat: 19.1, lon: 72.9, zoom: 10, year1: 2017, year2: 2024, description: 'Monitor land reclamation and coastal development in Mumbai.', bands: ['A30', 'A44', 'A37'], mode: 'change' },
                { id: 39, name: 'Singapore Land Reclamation', lat: 1.35, lon: 103.85, zoom: 11, year1: 2017, year2: 2024, description: 'Observe ongoing land reclamation projects expanding Singapore.', bands: ['A31', 'A45', 'A38'], mode: 'change' },
                { id: 40, name: 'Addis Ababa Light Rail', lat: 9.0, lon: 38.75, zoom: 11, year1: 2017, year2: 2023, description: 'Track infrastructure development and urbanization in Ethiopia\'s capital.', bands: ['A32', 'A46', 'A39'], mode: 'change' },
                { id: 41, name: 'Jakarta Sinking City', lat: -6.2, lon: 106.85, zoom: 10, year1: 2017, year2: 2024, description: 'Monitor urban development in subsiding coastal Jakarta.', bands: ['A33', 'A47', 'A40'], mode: 'change' },
                { id: 42, name: 'Riyadh Desert Expansion', lat: 24.7, lon: 46.7, zoom: 9, year1: 2017, year2: 2024, description: 'Track rapid urbanization and new development projects in Saudi Arabia\'s capital.', bands: ['A34', 'A48', 'A41'], mode: 'change' },
                { id: 43, name: 'Nairobi Tech Hub Growth', lat: -1.3, lon: 36.85, zoom: 10, year1: 2018, year2: 2024, description: 'Monitor development of technology parks and housing in Nairobi.', bands: ['A35', 'A49', 'A42'], mode: 'change' },
                { id: 44, name: 'Ho Chi Minh City Expansion', lat: 10.8, lon: 106.6, zoom: 10, year1: 2017, year2: 2024, description: 'Observe satellite city and industrial zone development around HCMC.', bands: ['A36', 'A50', 'A43'], mode: 'change' },
                { id: 45, name: 'Mexico City Air Quality', lat: 19.4, lon: -99.1, zoom: 10, year1: 2020, year2: 2020, description: 'Analyze urban heat island and development patterns in Mexico City.', bands: ['A37', 'A51', 'A44'], mode: 'embeddings' }
            ]
        },
        {
            id: 'water',
            name: 'Water Resources & Hydrology',
            icon: '💧',
            scenarios: [
                { id: 46, name: 'Aral Sea Disaster', lat: 44.5, lon: 59.0, zoom: 8, year1: 2017, year2: 2024, description: 'Monitor the continuing shrinkage of the Aral Sea, one of Earth\'s worst environmental disasters.', bands: ['A38', 'A52', 'A45'], mode: 'change' },
                { id: 47, name: 'Lake Mead Drought', lat: 36.2, lon: -114.4, zoom: 10, year1: 2017, year2: 2024, description: 'Track water level decline in Lake Mead, key Colorado River reservoir.', bands: ['A39', 'A53', 'A46'], mode: 'change' },
                { id: 48, name: 'Dead Sea Shrinking', lat: 31.5, lon: 35.5, zoom: 10, year1: 2017, year2: 2024, description: 'Observe the continuing decline of the Dead Sea water levels.', bands: ['A40', 'A54', 'A47'], mode: 'change' },
                { id: 49, name: 'Lake Chad Basin', lat: 13.5, lon: 14.0, zoom: 8, year1: 2017, year2: 2023, description: 'Monitor the fluctuating extent of Lake Chad in the Sahel region.', bands: ['A01', 'A16', 'A09'], mode: 'change' },
                { id: 50, name: 'Three Gorges Reservoir', lat: 30.8, lon: 111.0, zoom: 9, year1: 2020, year2: 2020, description: 'Explore the massive Three Gorges Dam reservoir and surrounding landscape.', bands: ['A41', 'A55', 'A48'], mode: 'embeddings' },
                { id: 51, name: 'Ganges River Flooding', lat: 25.5, lon: 85.0, zoom: 8, year1: 2019, year2: 2020, description: 'Compare monsoon flooding patterns along the Ganges River.', bands: ['A42', 'A56', 'A49'], mode: 'change' },
                { id: 52, name: 'Colorado River Delta', lat: 31.8, lon: -115.0, zoom: 9, year1: 2017, year2: 2024, description: 'Monitor water allocation impacts on the Colorado River delta.', bands: ['A43', 'A57', 'A50'], mode: 'change' },
                { id: 53, name: 'Murray-Darling Basin', lat: -35.0, lon: 143.5, zoom: 8, year1: 2018, year2: 2021, description: 'Observe drought and recovery in Australia\'s major agricultural river system.', bands: ['A44', 'A58', 'A51'], mode: 'change' },
                { id: 54, name: 'Mekong Dam Cascade', lat: 22.0, lon: 100.5, zoom: 8, year1: 2017, year2: 2023, description: 'Track impacts of hydropower dam construction on the upper Mekong.', bands: ['A45', 'A59', 'A52'], mode: 'change' },
                { id: 55, name: 'Lake Urmia Iran', lat: 37.7, lon: 45.5, zoom: 9, year1: 2017, year2: 2024, description: 'Monitor the dramatic shrinking of Iran\'s Lake Urmia.', bands: ['A46', 'A60', 'A53'], mode: 'change' },
                { id: 56, name: 'Brahmaputra River Dynamics', lat: 26.0, lon: 92.0, zoom: 8, year1: 2019, year2: 2020, description: 'Observe seasonal flooding and channel migration in Brahmaputra.', bands: ['A47', 'A61', 'A54'], mode: 'change' },
                { id: 57, name: 'Salton Sea California', lat: 33.3, lon: -115.85, zoom: 10, year1: 2017, year2: 2024, description: 'Track the shrinking Salton Sea and exposed lakebed.', bands: ['A48', 'A62', 'A55'], mode: 'change' },
                { id: 58, name: 'Poyang Lake Seasonal', lat: 29.2, lon: 116.2, zoom: 9, year1: 2020, year2: 2020, description: 'Explore China\'s largest freshwater lake seasonal variation patterns.', bands: ['A49', 'A63', 'A56'], mode: 'embeddings' },
                { id: 59, name: 'Ogallala Aquifer Depletion', lat: 37.5, lon: -101.0, zoom: 8, year1: 2017, year2: 2024, description: 'Monitor center-pivot irrigation patterns and land use change over the Ogallala.', bands: ['A50', 'A64', 'A57'], mode: 'change' },
                { id: 60, name: 'Lake Victoria Basin', lat: -1.5, lon: 33.5, zoom: 8, year1: 2020, year2: 2020, description: 'Analyze land use around Africa\'s largest lake.', bands: ['A01', 'A16', 'A09'], mode: 'embeddings' }
            ]
        },
        {
            id: 'coastal',
            name: 'Coastal & Marine Environments',
            icon: '🌊',
            scenarios: [
                { id: 61, name: 'Great Barrier Reef', lat: -18.0, lon: 147.0, zoom: 8, year1: 2020, year2: 2020, description: 'Explore coral reef patterns visible in AlphaEarth embeddings.', bands: ['A01', 'A32', 'A16'], mode: 'embeddings' },
                { id: 62, name: 'Venice Lagoon', lat: 45.45, lon: 12.35, zoom: 11, year1: 2020, year2: 2020, description: 'Analyze the unique patterns of Venice\'s historic lagoon system.', bands: ['A02', 'A33', 'A17'], mode: 'embeddings' },
                { id: 63, name: 'Bangladesh Sundarbans', lat: 21.95, lon: 89.2, zoom: 9, year1: 2017, year2: 2024, description: 'Monitor erosion and change in the world\'s largest mangrove forest.', bands: ['A03', 'A34', 'A18'], mode: 'change' },
                { id: 64, name: 'Dutch Delta Works', lat: 51.65, lon: 4.0, zoom: 10, year1: 2020, year2: 2020, description: 'Explore the engineering marvel of Netherlands\' flood protection system.', bands: ['A04', 'A35', 'A19'], mode: 'embeddings' },
                { id: 65, name: 'Maldives Atolls', lat: 4.2, lon: 73.5, zoom: 10, year1: 2020, year2: 2020, description: 'Analyze coral atoll patterns in the climate-threatened Maldives.', bands: ['A05', 'A36', 'A20'], mode: 'embeddings' },
                { id: 66, name: 'Louisiana Wetland Loss', lat: 29.5, lon: -90.5, zoom: 9, year1: 2017, year2: 2024, description: 'Track coastal erosion and wetland loss in Louisiana delta.', bands: ['A06', 'A37', 'A21'], mode: 'change' },
                { id: 67, name: 'Palm Islands Dubai', lat: 25.12, lon: 55.13, zoom: 12, year1: 2020, year2: 2020, description: 'Explore the artificial Palm Jumeirah island development.', bands: ['A07', 'A38', 'A22'], mode: 'embeddings' },
                { id: 68, name: 'Chesapeake Bay Estuary', lat: 37.5, lon: -76.0, zoom: 8, year1: 2020, year2: 2020, description: 'Analyze patterns in America\'s largest estuary ecosystem.', bands: ['A08', 'A39', 'A23'], mode: 'embeddings' },
                { id: 69, name: 'Wadden Sea Tidal Flats', lat: 53.5, lon: 8.0, zoom: 9, year1: 2020, year2: 2020, description: 'Explore UNESCO World Heritage tidal flat ecosystem.', bands: ['A09', 'A40', 'A24'], mode: 'embeddings' },
                { id: 70, name: 'Hong Kong Reclamation', lat: 22.35, lon: 114.15, zoom: 11, year1: 2017, year2: 2024, description: 'Monitor ongoing land reclamation projects in Hong Kong.', bands: ['A10', 'A41', 'A25'], mode: 'change' },
                { id: 71, name: 'Red Sea Coral Reefs', lat: 27.5, lon: 34.0, zoom: 9, year1: 2020, year2: 2020, description: 'Explore unique heat-resistant coral reef patterns in Red Sea.', bands: ['A11', 'A42', 'A26'], mode: 'embeddings' },
                { id: 72, name: 'Mississippi River Delta', lat: 29.15, lon: -89.25, zoom: 10, year1: 2017, year2: 2024, description: 'Track land loss and delta dynamics at the Mississippi mouth.', bands: ['A12', 'A43', 'A27'], mode: 'change' },
                { id: 73, name: 'Bay of Fundy Tides', lat: 45.3, lon: -64.5, zoom: 9, year1: 2020, year2: 2020, description: 'Analyze tidal patterns in world\'s highest tidal range location.', bands: ['A13', 'A44', 'A28'], mode: 'embeddings' },
                { id: 74, name: 'Danube Delta Romania', lat: 45.0, lon: 29.5, zoom: 9, year1: 2020, year2: 2020, description: 'Explore Europe\'s largest wetland and delta ecosystem.', bands: ['A14', 'A45', 'A29'], mode: 'embeddings' },
                { id: 75, name: 'Florida Keys Reef Tract', lat: 24.7, lon: -81.0, zoom: 9, year1: 2020, year2: 2020, description: 'Analyze patterns in North America\'s only barrier coral reef.', bands: ['A15', 'A46', 'A30'], mode: 'embeddings' }
            ]
        },
        {
            id: 'climate',
            name: 'Climate & Seasonal Patterns',
            icon: '🌡️',
            scenarios: [
                { id: 76, name: 'Arctic Sea Ice Edge', lat: 78.0, lon: 0.0, zoom: 5, year1: 2017, year2: 2023, description: 'Compare Arctic sea ice extent between years.', bands: ['A16', 'A47', 'A31'], mode: 'change' },
                { id: 77, name: 'Greenland Ice Sheet', lat: 72.0, lon: -40.0, zoom: 6, year1: 2017, year2: 2024, description: 'Monitor surface changes on the Greenland ice sheet.', bands: ['A17', 'A48', 'A32'], mode: 'change' },
                { id: 78, name: 'Sahel Greening Trend', lat: 14.0, lon: 0.0, zoom: 7, year1: 2017, year2: 2024, description: 'Track vegetation changes in the African Sahel region.', bands: ['A18', 'A49', 'A33'], mode: 'change' },
                { id: 79, name: 'Antarctic Peninsula', lat: -65.0, lon: -60.0, zoom: 6, year1: 2017, year2: 2024, description: 'Observe ice shelf changes on the warming Antarctic Peninsula.', bands: ['A19', 'A50', 'A34'], mode: 'change' },
                { id: 80, name: 'European Heatwave Impact', lat: 47.0, lon: 8.0, zoom: 7, year1: 2021, year2: 2022, description: 'Compare vegetation stress before and during major heatwave.', bands: ['A20', 'A51', 'A35'], mode: 'change' },
                { id: 81, name: 'Himalayan Glacier Retreat', lat: 28.0, lon: 84.5, zoom: 9, year1: 2017, year2: 2024, description: 'Track glacier changes in the Nepal Himalaya.', bands: ['A21', 'A52', 'A36'], mode: 'change' },
                { id: 82, name: 'Amazon Drought Patterns', lat: -3.0, lon: -60.0, zoom: 7, year1: 2019, year2: 2023, description: 'Compare drought year impacts on Amazon forest.', bands: ['A22', 'A53', 'A37'], mode: 'change' },
                { id: 83, name: 'Australian Bushfire Season', lat: -33.0, lon: 150.5, zoom: 8, year1: 2019, year2: 2020, description: 'Track 2019-2020 Black Summer bushfire impacts.', bands: ['A23', 'A54', 'A38'], mode: 'change' },
                { id: 84, name: 'Siberian Permafrost', lat: 68.0, lon: 145.0, zoom: 7, year1: 2017, year2: 2024, description: 'Monitor permafrost thaw impacts in Siberian landscapes.', bands: ['A24', 'A55', 'A39'], mode: 'change' },
                { id: 85, name: 'Indian Monsoon Patterns', lat: 22.0, lon: 78.0, zoom: 6, year1: 2019, year2: 2020, description: 'Compare monsoon vegetation response across India.', bands: ['A25', 'A56', 'A40'], mode: 'change' },
                { id: 86, name: 'Patagonian Ice Fields', lat: -49.0, lon: -73.5, zoom: 8, year1: 2017, year2: 2024, description: 'Track glacier retreat in South American ice fields.', bands: ['A26', 'A57', 'A41'], mode: 'change' },
                { id: 87, name: 'Svalbard Arctic Warming', lat: 78.0, lon: 16.0, zoom: 8, year1: 2017, year2: 2024, description: 'Monitor rapid warming impacts on Svalbard archipelago.', bands: ['A27', 'A58', 'A42'], mode: 'change' },
                { id: 88, name: 'Alps Snow Cover', lat: 46.5, lon: 10.0, zoom: 8, year1: 2018, year2: 2023, description: 'Compare snow cover patterns in European Alps.', bands: ['A28', 'A59', 'A43'], mode: 'change' },
                { id: 89, name: 'Horn of Africa Drought', lat: 5.0, lon: 42.0, zoom: 7, year1: 2020, year2: 2022, description: 'Track severe drought impacts in East Africa.', bands: ['A29', 'A60', 'A44'], mode: 'change' },
                { id: 90, name: 'Canadian Arctic Thaw', lat: 69.0, lon: -105.0, zoom: 7, year1: 2017, year2: 2024, description: 'Monitor landscape changes as Arctic warms.', bands: ['A30', 'A61', 'A45'], mode: 'change' }
            ]
        },
        {
            id: 'geology',
            name: 'Geology & Landforms',
            icon: '🏔️',
            scenarios: [
                { id: 91, name: 'Grand Canyon Layers', lat: 36.1, lon: -112.1, zoom: 11, year1: 2020, year2: 2020, description: 'Explore geological layer patterns visible in AlphaEarth.', bands: ['A31', 'A62', 'A46'], mode: 'embeddings' },
                { id: 92, name: 'Sahara Desert Dunes', lat: 24.0, lon: 10.0, zoom: 8, year1: 2020, year2: 2020, description: 'Analyze sand dune formation patterns in the Sahara.', bands: ['A32', 'A63', 'A47'], mode: 'embeddings' },
                { id: 93, name: 'Himalayan Fold Mountains', lat: 28.5, lon: 84.0, zoom: 9, year1: 2020, year2: 2020, description: 'Explore tectonic patterns in Himalayan mountain structures.', bands: ['A33', 'A64', 'A48'], mode: 'embeddings' },
                { id: 94, name: 'Iceland Volcanic Features', lat: 64.5, lon: -18.0, zoom: 8, year1: 2020, year2: 2020, description: 'Analyze volcanic landforms and lava fields of Iceland.', bands: ['A34', 'A01', 'A49'], mode: 'embeddings' },
                { id: 95, name: 'Australian Uluru Region', lat: -25.35, lon: 131.0, zoom: 10, year1: 2020, year2: 2020, description: 'Explore patterns around Uluru and Kata Tjuta.', bands: ['A35', 'A02', 'A50'], mode: 'embeddings' },
                { id: 96, name: 'Death Valley Salt Flats', lat: 36.25, lon: -116.85, zoom: 10, year1: 2020, year2: 2020, description: 'Analyze salt pan patterns in Death Valley.', bands: ['A36', 'A03', 'A51'], mode: 'embeddings' },
                { id: 97, name: 'Ethiopian Rift Valley', lat: 7.5, lon: 39.0, zoom: 8, year1: 2020, year2: 2020, description: 'Explore tectonic features of the East African Rift.', bands: ['A37', 'A04', 'A52'], mode: 'embeddings' },
                { id: 98, name: 'Namib Desert Patterns', lat: -24.5, lon: 15.5, zoom: 9, year1: 2020, year2: 2020, description: 'Analyze unique dune patterns in the world\'s oldest desert.', bands: ['A38', 'A05', 'A53'], mode: 'embeddings' },
                { id: 99, name: 'Tibetan Plateau', lat: 33.0, lon: 90.0, zoom: 7, year1: 2020, year2: 2020, description: 'Explore patterns across the "Roof of the World".', bands: ['A39', 'A06', 'A54'], mode: 'embeddings' },
                { id: 100, name: 'Atacama Mineral Patterns', lat: -23.5, lon: -68.5, zoom: 9, year1: 2020, year2: 2020, description: 'Analyze mineral deposits visible in driest desert.', bands: ['A40', 'A07', 'A55'], mode: 'embeddings' }
            ]
        },
        {
            id: 'historical',
            name: 'Historical & Archaeological',
            icon: '🏛️',
            scenarios: [
                { id: 101, name: 'Giza Pyramids Complex', lat: 29.975, lon: 31.13, zoom: 14, year1: 2020, year2: 2020, description: 'Explore the ancient Giza Pyramid complex patterns.', bands: ['A41', 'A08', 'A56'], mode: 'embeddings' },
                { id: 102, name: 'Nazca Lines Peru', lat: -14.7, lon: -75.1, zoom: 13, year1: 2020, year2: 2020, description: 'Analyze patterns around the ancient Nazca geoglyphs.', bands: ['A42', 'A09', 'A57'], mode: 'embeddings' },
                { id: 103, name: 'Angkor Wat Temple Complex', lat: 13.41, lon: 103.87, zoom: 13, year1: 2020, year2: 2020, description: 'Explore the largest religious monument complex.', bands: ['A43', 'A10', 'A58'], mode: 'embeddings' },
                { id: 104, name: 'Ancient Irrigation Persia', lat: 32.0, lon: 54.0, zoom: 10, year1: 2020, year2: 2020, description: 'Analyze qanat irrigation patterns in Iranian plateau.', bands: ['A44', 'A11', 'A59'], mode: 'embeddings' },
                { id: 105, name: 'Roman Road Network', lat: 41.9, lon: 12.5, zoom: 9, year1: 2020, year2: 2020, description: 'Trace ancient Roman road patterns visible in landscape.', bands: ['A45', 'A12', 'A60'], mode: 'embeddings' },
                { id: 106, name: 'Machu Picchu Region', lat: -13.16, lon: -72.55, zoom: 13, year1: 2020, year2: 2020, description: 'Explore Incan terracing and site patterns.', bands: ['A46', 'A13', 'A61'], mode: 'embeddings' },
                { id: 107, name: 'Great Wall of China', lat: 40.4, lon: 116.5, zoom: 11, year1: 2020, year2: 2020, description: 'Trace the Great Wall through varied landscapes.', bands: ['A47', 'A14', 'A62'], mode: 'embeddings' },
                { id: 108, name: 'Mesopotamia Ancient Cities', lat: 32.5, lon: 44.5, zoom: 9, year1: 2020, year2: 2020, description: 'Explore patterns of ancient settlement mounds in Iraq.', bands: ['A48', 'A15', 'A63'], mode: 'embeddings' }
            ]
        },
        {
            id: 'disasters',
            name: 'Disaster Response & Hazards',
            icon: '⚠️',
            scenarios: [
                { id: 109, name: 'Tonga Volcano Aftermath', lat: -20.55, lon: -175.4, zoom: 10, year1: 2021, year2: 2022, description: 'Compare before/after the 2022 Hunga Tonga eruption.', bands: ['A49', 'A16', 'A64'], mode: 'change' },
                { id: 110, name: 'Fukushima Exclusion Zone', lat: 37.45, lon: 141.0, zoom: 10, year1: 2017, year2: 2024, description: 'Monitor land use changes in Fukushima exclusion zone.', bands: ['A50', 'A17', 'A01'], mode: 'change' },
                { id: 111, name: 'Paradise California Fire', lat: 39.76, lon: -121.6, zoom: 12, year1: 2018, year2: 2024, description: 'Track rebuilding after devastating 2018 Camp Fire.', bands: ['A51', 'A18', 'A02'], mode: 'change' },
                { id: 112, name: 'Nepal Earthquake 2015', lat: 28.15, lon: 84.75, zoom: 10, year1: 2017, year2: 2023, description: 'Monitor post-earthquake reconstruction in Nepal.', bands: ['A52', 'A19', 'A03'], mode: 'change' },
                { id: 113, name: 'Bahamas Hurricane Dorian', lat: 26.6, lon: -78.2, zoom: 10, year1: 2019, year2: 2022, description: 'Track recovery from devastating 2019 Hurricane Dorian.', bands: ['A53', 'A20', 'A04'], mode: 'change' },
                { id: 114, name: 'Australia Lake Fire Scars', lat: -36.0, lon: 149.0, zoom: 9, year1: 2019, year2: 2024, description: 'Monitor forest recovery from Black Summer fires.', bands: ['A54', 'A21', 'A05'], mode: 'change' },
                { id: 115, name: 'Houston Harvey Flooding', lat: 29.75, lon: -95.35, zoom: 10, year1: 2017, year2: 2018, description: 'Compare before/after Hurricane Harvey flooding.', bands: ['A55', 'A22', 'A06'], mode: 'change' },
                { id: 116, name: 'Lombok Earthquake Impact', lat: -8.45, lon: 116.35, zoom: 10, year1: 2018, year2: 2022, description: 'Monitor recovery from 2018 Lombok earthquakes.', bands: ['A56', 'A23', 'A07'], mode: 'change' }
            ]
        },
        {
            id: 'experiments',
            name: 'Visualization Experiments',
            icon: '🔬',
            scenarios: [
                { id: 117, name: 'Urban Heat Signatures', lat: 40.7, lon: -74.0, zoom: 10, year1: 2020, year2: 2020, description: 'Explore urban heat patterns in New York City embeddings.', bands: ['A57', 'A24', 'A08'], mode: 'embeddings' },
                { id: 118, name: 'Vegetation Index Analog', lat: -1.0, lon: 36.8, zoom: 9, year1: 2020, year2: 2020, description: 'Find band combinations that highlight vegetation like NDVI.', bands: ['A01', 'A09', 'A02'], mode: 'clustering' },
                { id: 119, name: 'Water Body Detection', lat: 46.5, lon: -94.0, zoom: 8, year1: 2020, year2: 2020, description: 'Experiment with bands that highlight lakes in Minnesota.', bands: ['A58', 'A25', 'A09'], mode: 'embeddings' },
                { id: 120, name: 'Snow vs Cloud Patterns', lat: 46.9, lon: 8.0, zoom: 9, year1: 2020, year2: 2020, description: 'Explore how embeddings differentiate snow from clouds.', bands: ['A59', 'A26', 'A10'], mode: 'embeddings' },
                { id: 121, name: 'Coastal Turbidity Patterns', lat: -23.0, lon: -43.2, zoom: 10, year1: 2020, year2: 2020, description: 'Analyze water turbidity patterns near Rio de Janeiro.', bands: ['A60', 'A27', 'A11'], mode: 'embeddings' },
                { id: 122, name: 'Agricultural Stress Detection', lat: 36.0, lon: -119.5, zoom: 9, year1: 2021, year2: 2022, description: 'Compare drought stress patterns in California crops.', bands: ['A61', 'A28', 'A12'], mode: 'change' },
                { id: 123, name: 'Land Cover Clustering', lat: 51.5, lon: -0.1, zoom: 10, year1: 2020, year2: 2020, description: 'Use clustering to identify land cover types around London.', bands: ['A01', 'A16', 'A09'], mode: 'clustering' },
                { id: 124, name: 'Temporal Stability Analysis', lat: 35.7, lon: 139.7, zoom: 10, year1: 2017, year2: 2024, description: 'Find areas of high change vs stability in Tokyo region.', bands: ['A62', 'A29', 'A13'], mode: 'change' },
                { id: 125, name: 'Embedding Space Explorer', lat: 0.0, lon: 0.0, zoom: 2, year1: 2020, year2: 2020, description: 'Freely explore the 64-dimensional embedding space globally.', bands: ['A63', 'A30', 'A14'], mode: 'embeddings' }
            ]
        }
    ],

    /**
     * Get all scenarios
     * @returns {Array} All scenarios across categories
     */
    getAllScenarios() {
        const scenarios = [];
        this.categories.forEach(cat => {
            cat.scenarios.forEach(s => {
                scenarios.push({
                    ...s,
                    category: cat.id,
                    categoryName: cat.name,
                    categoryIcon: cat.icon
                });
            });
        });
        return scenarios;
    },

    /**
     * Get scenarios by category
     * @param {string} categoryId - Category ID
     * @returns {Array} Scenarios in category
     */
    getByCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.scenarios : [];
    },

    /**
     * Get scenario by ID
     * @param {number} id - Scenario ID
     * @returns {Object|null} Scenario or null
     */
    getById(id) {
        for (const cat of this.categories) {
            const scenario = cat.scenarios.find(s => s.id === id);
            if (scenario) {
                return {
                    ...scenario,
                    category: cat.id,
                    categoryName: cat.name,
                    categoryIcon: cat.icon
                };
            }
        }
        return null;
    },

    /**
     * Search scenarios by keyword
     * @param {string} query - Search query
     * @returns {Array} Matching scenarios
     */
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.getAllScenarios().filter(s =>
            s.name.toLowerCase().includes(lowerQuery) ||
            s.description.toLowerCase().includes(lowerQuery)
        );
    }
};

// Export
window.CaseStudies = CaseStudies;
