const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const products = [
    { name: 'Zlaten Dab', price: 180, shifra: '730' },
    { name: 'Tuborg', price: 200, shifra: '705' },
    { name: 'Tuborg Ice', price: 200, shifra: '' },
    { name: 'Carlsberg', price: 220, shifra: '740' },
    { name: 'Blanc', price: 220, shifra: '750' },
    { name: 'Corona', price: 250, shifra: '720' },
    { name: 'Red Bull', price: 200, shifra: '865' },
    { name: 'Gazirani sokovi', price: 100, shifra: '' },
    { name: 'Sokovi', price: 100, shifra: '' },
    { name: 'Jana voda', price: 100, shifra: '' },
    { name: 'Voda Aqua Viva', price: 100, shifra: '899' },
    { name: 'Gazirana voda', price: 100, shifra: '' },
    { name: 'Vino Tikves', price: 300, shifra: '651' },
    { name: 'Vino Snec Sel', price: 300, shifra: '' },
    { name: 'Absolut Vanilla', price: 220, shifra: '' },
    { name: 'Absolut', price: 220, shifra: '196' },
    { name: 'Absolut Kurant', price: 220, shifra: '' },
    { name: 'Absolut Raspberry', price: 220, shifra: '' },
    { name: 'Absolut Elyx', price: 280, shifra: '' },
    { name: 'Grey Goose', price: 350, shifra: '' },
    { name: 'Beefeater Gin', price: 220, shifra: '114' },
    { name: 'Beefeater Pink', price: 220, shifra: '' },
    { name: 'Tanqueray', price: 250, shifra: '' },
    { name: 'Hendrick’s Gin', price: 300, shifra: '' },
    { name: 'Monkey 47', price: 400, shifra: '' },
    { name: 'Jameson', price: 250, shifra: '254' },
    { name: 'Jameson Black', price: 350, shifra: '' },
    { name: 'Jack Daniel’s', price: 250, shifra: '250' },
    { name: 'Jack Daniel’s Honey', price: 250, shifra: '' },
    { name: 'Glenfiddic', price: 400, shifra: '' },
    { name: 'Chivas Regal 12', price: 350, shifra: '' },
    { name: 'Chivas Regal 15', price: 450, shifra: '' },
    { name: 'Glenlivet 12', price: 350, shifra: '' },
    { name: 'Glenlivet 15', price: 450, shifra: '' },
    { name: 'Glenlivet Reserve', price: 380, shifra: '' },
    { name: 'Monkey Shoulder', price: 300, shifra: '293' },
    { name: 'Ballantine’s Finest', price: 200, shifra: '' },
    { name: 'Johnnie Red', price: 220, shifra: '211' },
    { name: 'Johnnie Black', price: 300, shifra: '' },
    { name: 'J&B', price: 220, shifra: '' },
    { name: 'Southern Comfort', price: 200, shifra: '' },
    { name: 'Four Roses', price: 200, shifra: '281' },
    { name: 'Stock', price: 200, shifra: '150' },
    { name: 'Olmeca Gold', price: 100, shifra: '' },
    { name: 'Olmeca Silver', price: 100, shifra: '' },
    { name: 'Altos Plata', price: 120, shifra: '' },
    { name: 'Altos Reposado', price: 120, shifra: '' },
    { name: 'Havana Club Bela', price: 220, shifra: '110' },
    { name: 'Havana Club Gold', price: 220, shifra: '' },
    { name: 'Havana Club 7', price: 250, shifra: '111' },
    { name: 'BK Rakiya', price: 100, shifra: '' },
    { name: 'Jaegermeister', price: 200, shifra: '151' },
    { name: 'Becherovka', price: 200, shifra: '' },
    { name: 'Martini', price: 170, shifra: '' },
    { name: 'Aperol', price: 220, shifra: '' },
    { name: 'Campari', price: 150, shifra: '116' },
    { name: 'Baileys', price: 180, shifra: '' },
    { name: 'Malibu', price: 200, shifra: '' },
    { name: 'Dodatok', price: 30, shifra: '340' },
    { name: 'Shot', price: 100, shifra: '333' },
    { name: 'Shot-150', price: 150, shifra: '302' },
];



const findProductMix = (targetValue) => {
    const weightedProducts = products.map(product => {
        const highWeight = ['Zlaten Dab', 'Havana Club Gold', 'Voda Aqua Viva', 'Vino Tikves', 'Tuborg', 'Corona', 'Carlsberg', 'Olmeca Gold', 'Olmeca Silver', 'Beefeater Gin', 'Absolut', 'Dodatok', 'Jana voda', 'Gazirana voda'];
        return { ...product, weight: highWeight.includes(product.name) ? 9 : 0.3 };
    });

    const pickRandomProduct = (maxPrice) => {
        const filtered = weightedProducts.filter(product => product.price <= maxPrice);
        if (!filtered.length) return null;

        const cumulativeWeights = [];
        let sum = 0;

        filtered.forEach(product => {
            sum += product.weight;
            cumulativeWeights.push({ product, cumulative: sum });
        });

        const random = Math.random() * sum;
        return cumulativeWeights.find(item => random <= item.cumulative).product;
    };

    const result = [];
    let remainingValue = targetValue;

    const maxAttempts = 100000;
    let attempts = 0;

    while (remainingValue > 0 && attempts < maxAttempts) {
        const randomProduct = pickRandomProduct(remainingValue);
        if (!randomProduct) break;

        const uniqueProducts = [...new Set(result.map(p => p.name))];
        if (!uniqueProducts.includes(randomProduct.name) && uniqueProducts.length >= UNIQUE_PRODUCT_LIMIT) {
            break;
        }

        if (remainingValue >= randomProduct.price) {
            result.push(randomProduct);
            remainingValue -= randomProduct.price;

            // If the remaining value is close to 2.5k, try to match it more precisely
            if (remainingValue <= 2500 && remainingValue > 0) {
                const exactMatchProduct = weightedProducts.find(p => p.price === remainingValue);
                if (exactMatchProduct) {
                    result.push(exactMatchProduct);
                    remainingValue -= exactMatchProduct.price;
                } else {
                    // If no exact match, try to find a combination that fits the remaining value
                    const remainingFiltered = weightedProducts.filter(p => p.price <= remainingValue);
                    if (remainingFiltered.length) {
                        const bestFit = remainingFiltered.reduce((prev, current) => (Math.abs(current.price - remainingValue) < Math.abs(prev.price - remainingValue) ? current : prev));
                        result.push(bestFit);
                        remainingValue -= bestFit.price;
                    }
                }
            }

            if (remainingValue === 0) {
                const aggregatedResult = result.reduce((acc, product) => {
                    acc[product.name] = acc[product.name] || { ...product, count: 0, price: 0 };
                    acc[product.name].count++;
                    acc[product.name].price += product.price;
                    return acc;
                }, {});
                return Object.values(aggregatedResult).sort((a, b) => b.count - a.count);
            }
        }

        if (remainingValue < Math.min(...weightedProducts.map(p => p.price))) {
            break;
        }

        attempts++;
    }

    return null;
};


app.get('/mix', (req, res) => {
    const value = parseInt(req.query.value);

    if (isNaN(value) || value <= 0) {
        return res.status(400).json({ error: 'Invalid value. Please enter a positive number.' });
    }

    // Set UNIQUE_PRODUCT_LIMIT based on the input value
    let productLimit;
    if (value < 40000) {
        productLimit = 25;
    } else if (value < 60000) {
        productLimit = 30;
    } else if (value < 100000) {
        productLimit = 40;
    } else {
        productLimit = 99;
    }

    const findProductMix = (targetValue) => {
        const weightedProducts = products.map(product => {
            const highWeight = ['Zlaten Dab', 'Havana Club Gold', 'Voda Aqua Viva', 'Vino Tikves', 'Tuborg', 'Corona', 'Carlsberg', 'Olmeca Gold', 'Olmeca Silver', 'Beefeater Gin', 'Absolut', 'Dodatok', 'Jana voda', 'Gazirana voda'];
            return { ...product, weight: highWeight.includes(product.name) ? 9 : 0.3 };
        });

        const pickRandomProduct = (maxPrice) => {
            const filtered = weightedProducts.filter(product => product.price <= maxPrice);
            if (!filtered.length) return null;

            const cumulativeWeights = [];
            let sum = 0;

            filtered.forEach(product => {
                sum += product.weight;
                cumulativeWeights.push({ product, cumulative: sum });
            });

            const random = Math.random() * sum;
            return cumulativeWeights.find(item => random <= item.cumulative).product;
        };

        const result = [];
        let remainingValue = targetValue;

        const maxAttempts = 100000;
        let attempts = 0;

        while (remainingValue > 0 && attempts < maxAttempts) {
            const randomProduct = pickRandomProduct(remainingValue);
            if (!randomProduct) break;

            const uniqueProducts = [...new Set(result.map(p => p.name))];
            if (!uniqueProducts.includes(randomProduct.name) && uniqueProducts.length >= productLimit) {
                break;
            }

            if (remainingValue >= randomProduct.price) {
                result.push(randomProduct);
                remainingValue -= randomProduct.price;

                // If the remaining value is close to 2.5k, try to match it more precisely
                if (remainingValue <= 2500 && remainingValue > 0) {
                    const exactMatchProduct = weightedProducts.find(p => p.price === remainingValue);
                    if (exactMatchProduct) {
                        result.push(exactMatchProduct);
                        remainingValue -= exactMatchProduct.price;
                    } else {
                        // If no exact match, try to find a combination that fits the remaining value
                        const remainingFiltered = weightedProducts.filter(p => p.price <= remainingValue);
                        if (remainingFiltered.length) {
                            const bestFit = remainingFiltered.reduce((prev, current) => (Math.abs(current.price - remainingValue) < Math.abs(prev.price - remainingValue) ? current : prev));
                            result.push(bestFit);
                            remainingValue -= bestFit.price;
                        }
                    }
                }

                if (remainingValue === 0) {
                    const aggregatedResult = result.reduce((acc, product) => {
                        acc[product.name] = acc[product.name] || { ...product, count: 0, price: 0 };
                        acc[product.name].count++;
                        acc[product.name].price += product.price;
                        return acc;
                    }, {});
                    return Object.values(aggregatedResult).sort((a, b) => b.count - a.count);
                }
            }

            if (remainingValue < Math.min(...weightedProducts.map(p => p.price))) {
                break;
            }

            attempts++;
        }

        return null;
    };

    let productMix = null;
    let retryAttempts = 0;

    while (!productMix && retryAttempts < 1000) {
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
