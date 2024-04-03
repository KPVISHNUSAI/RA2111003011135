const express = require("express");
const port = 5000;
const cors = require('cors');
const axios = require('axios');
const TEST_SERVER_BASE_URL = 'http://20.244.56.144/test';
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTUzMzYyLCJpYXQiOjE3MTIxNTMwNjIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZkYTIwMjYxLWQ5MzAtNDVmNS1iZjE2LWE2ZjlkNGNhNGEzOSIsInN1YiI6ImtrNDU2M0Bzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiU1JNIElOU1RJVFVURSBPRiBTQ0lFTkNFIEFORCBURUNITk9MT0dZIiwiY2xpZW50SUQiOiI2ZGEyMDI2MS1kOTMwLTQ1ZjUtYmYxNi1hNmY5ZDRjYTRhMzkiLCJjbGllbnRTZWNyZXQiOiJETkpCa3pxdmVNR1NaZGtDIiwib3duZXJOYW1lIjoiS1BWSVNITlVTQUkiLCJvd25lckVtYWlsIjoia2s0NTYzQHNybWlzdC5lZHUuaW4iLCJyb2xsTm8iOiJSQTIxMTEwMDMwMTExMzUifQ.MpYCoppHmciDd4UziLR1Gqswk5HPm328n57oOp9HVqM"
const app = express();
app.use(express.json());
app.use(cors());
app.get('/categories/:categoryName/products', async (req, res) => {
    try {
        const { categoryName } = req.params;
        const { top, minPrice, maxPrice, page = 1, sort } = req.query;

        const response = await axios.get(`${TEST_SERVER_BASE_URL}/companies/:companyName/categories/${categoryName}/products/top-${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`,{
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`
            }
        });

        let products = response.data;
        if (sort) {
            const [sortField, sortOrder] = sort.split(':');
            products.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a[sortField] - b[sortField];
                } else {
                    return b[sortField] - a[sortField];
                }
            });
        }

        const pageSize = parseInt(top);
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const paginatedProducts = products.slice(startIndex, endIndex);

        res.json(paginatedProducts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    try {
        const { categoryName, productId } = req.params;

        const response = await axios.get(`${TEST_SERVER_BASE_URL}/companies/:companyName/categories/${categoryName}/products`,{
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`
            }
        });

        const product = response.data.find(product => product.productName === productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(port, () => console.log(`Server started on port ${port}`));