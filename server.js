const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const products = [
    { name: 'Zlaten Dab', price: 180 },
    { name: 'Tuborg', price: 200 },
    { name: 'Tuborg Ice', price: 200 },
    { name: 'Carlsberg', price: 220 },
    { name: 'Blanc', price: 220 },
    { name: 'Corona', price: 250 },
    { name: 'Red Bull', price: 200 },
    { name: 'Gazirani sokovi', price: 100 },
    { name: 'Sokovi', price: 100 },
    { name: 'Jana voda', price: 100 },
    { name: 'Voda Aqua Viva', price: 100 },
    { name: 'Gazirana voda', price: 100 },
    { name: 'Vino Tikves', price: 300 },
    { name: 'Vino Snec Sel', price: 300 },
    { name: 'Absolut Vanilla', price: 220 },
    { name: 'Absolut Kurant', price: 220 },
    { name: 'Absolut Raspberry', price: 220 },
    { name: 'Absolut Elyx', price: 280 },
    { name: 'Grey Goose', price: 350 },
    { name: 'Beefeater Gin', price: 220 },
    { name: 'Beefeater Pink', price: 220 },
    { name: 'Tanqueray', price: 250 },
    { name: 'Hendrick’s Gin', price: 300 },
    { name: 'Monkey 47', price: 400 },
    { name: 'Jameson', price: 250 },
    { name: 'Jameson Black', price: 350 },
    { name: 'Jack Daniel’s', price: 250 },
    { name: 'Jack Daniel’s Honey', price: 250 },
    { name: 'Buffalo Trace', price: 250 },
    { name: 'Glenfiddic', price: 400 },
    { name: 'Chivas Regal 12', price: 350 },
    { name: 'Chivas Regal 15', price: 450 },
    { name: 'Glenlivet 12', price: 350 },
    { name: 'Glenlivet 15', price: 450 },
    { name: 'Glenlivet Reserve', price: 380 },
    { name: 'Monkey Shoulder', price: 300 },
    { name: 'Ballantine’s Finest', price: 200 },
    { name: 'Ballantine’s 12', price: 300 },
    { name: 'Johnnie Red', price: 220 },
    { name: 'Johnnie Black', price: 300 },
    { name: 'J&B', price: 220 },
    { name: 'Southern Comfort', price: 200 },
    { name: 'Four Roses', price: 200 },
    { name: 'Penny Packer', price: 200 },
    { name: 'Stock', price: 200 },
    { name: 'Olmeca Gold', price: 100 },
    { name: 'Olmeca Silver', price: 100 },
    { name: 'Altos Plata', price: 120 },
    { name: 'Altos Reposado', price: 120 },
    { name: 'Havana Club Bela', price: 220 },
    { name: 'Havana Club Gold', price: 220 },
    { name: 'Havana Club 7', price: 250 },
    { name: 'BK Rakiya', price: 100 },
    { name: 'Jaegermeister', price: 200 },
    { name: 'Becherovka', price: 200 },
    { name: 'Martini', price: 170 },
    { name: 'Aperol', price: 220 },
    { name: 'Campari', price: 150 },
    { name: 'Baileys', price: 180 },
    { name: 'Malibu', price: 200 },
    { name: 'Archers', price: 180 },
    { name: 'Dodatok', price: 30 }
];

// Weighted product selection
const findProductMix = (targetValue) => {
    const result = [];
    let remainingValue = targetValue;

    // Define weights for products (higher weight = more likely to be selected)
    const weightedProducts = products.map(product => {
        if (['Zlaten Dab', 'Tuborg', 'Corona', 'Carlsberg', 'Beefeater Gin', 'Absolut', 'Dodatok', 'Jana voda', 'Gazirana voda'].includes(product.name)) {
            return { ...product, weight: 9 }; // Give these products higher weight
        }
        return { ...product, weight: 0.3 }; // Default weight for others
    });

    const pickRandomProduct = () => {
        const totalWeight = weightedProducts.reduce((sum, product) => sum + product.weight, 0);
        let randomWeight = Math.random() * totalWeight;

        for (let product of weightedProducts) {
            randomWeight -= product.weight;
            if (randomWeight <= 0) {
                return product;
            }
        }
        return null;
    };

    const maxAttempts = 1000;
    let attempts = 0;

    while (remainingValue > 0 && attempts < maxAttempts) {
        const randomProduct = pickRandomProduct();

        if (remainingValue >= randomProduct.price) {
            result.push(randomProduct);
            remainingValue -= randomProduct.price;
        }

        if (remainingValue < Math.min(...weightedProducts.map(p => p.price))) {
            break;
        }

        attempts++;
    }

    if (remainingValue === 0) {
        const aggregatedResult = [];
        const productCounts = result.reduce((acc, product) => {
            acc[product.name] = (acc[product.name] || 0) + 1;
            return acc;
        }, {});

        for (let [name, count] of Object.entries(productCounts)) {
            const product = result.find(p => p.name === name);
            aggregatedResult.push({
                count, // Number of times the product has been added
                name,
                price: product.price * count
            });
        }

        return aggregatedResult.sort((a, b) => b.count - a.count); // Sort by count (most frequent first)
    }

    return null;
};

app.get('/mix', (req, res) => {
    const value = parseInt(req.query.value);

    if (isNaN(value) || value <= 0) {
        return res.status(400).json({ error: 'Invalid value. Please enter a positive number.' });
    }

    let productMix = null;
    let retryAttempts = 0;

    while (!productMix && retryAttempts < 30) {
        productMix = findProductMix(value);
        retryAttempts++;
    }

    if (productMix) {
        res.json({ products: productMix });
    } else {
        res.status(400).json({ error: 'No valid product mix found after multiple attempts.' });
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
