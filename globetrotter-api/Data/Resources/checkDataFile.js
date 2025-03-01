const fs = require('fs');

// Self-executing function to count cities in data.json
(function() {
  try {
    // Read and parse the JSON file
    const rawData = fs.readFileSync('./data.json', 'utf8');
    const data = JSON.parse(rawData);
    
    // Count total cities
    const totalCities = data.length;
    
    // Check for uniqueness
    const cityNames = data.map(item => item.city);
    const uniqueCities = new Set(cityNames);
    const uniqueCount = uniqueCities.size;
    
    // Display results
    console.log(`Total cities in data.json: ${totalCities}`);
    console.log(`Unique cities: ${uniqueCount}`);
    
    // Check if there are duplicates
    if (totalCities !== uniqueCount) {
      console.log('WARNING: There are duplicate cities in the data!');
      
      // Find duplicates
      const counts = {};
      cityNames.forEach(city => {
        counts[city] = (counts[city] || 0) + 1;
      });
      
      const duplicates = Object.entries(counts)
        .filter(([_, count]) => count > 1)
        .map(([city, count]) => `${city} (${count} occurrences)`);
      
      console.log('Duplicate cities:', duplicates);
    } else {
      console.log('All cities are unique!');
    }
  } catch (error) {
    console.error('Error processing the file:', error.message);
  }
})();