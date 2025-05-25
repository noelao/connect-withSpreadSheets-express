const express = require('express');

const {google} = require('googleapis');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { title: 'Google Sheets API Example' });
});

app.post('/', async (req, res) => {
    const { request, name } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "rahasia.json", // Path to your service account key file
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // create a client
    const client = await auth.getClient();
    const spreadsheetId = "1Ufq2Nx9syd8dkwnhnhJGX_mhLoO99MwJ_pirh1Nkj3E";

    // instantiate the sheets API
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    // get metadata about the spreadsheet
    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    // read rows from the spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'Sheet1!A1:B10', // Adjust the range as needed
    })

    // tulis pada google sheets
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B", // tanpa deklarasi range, akan menambahkan pada baris terakhir
        valueInputOption: 'RAW',    // 'RAW' or 'USER_ENTERED'
        resource: {
            values: [
                [request, name],
            ],
        },
    });

    res.send("success fully added");
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});