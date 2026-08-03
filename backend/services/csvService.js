'use strict';
const { createObjectCsvStringifier } = require('csv-writer');

/**
 * Stream CSV to response
 * @param {object} res       — Express response
 * @param {Array}  data      — Array of row objects
 * @param {string} filename  — Without extension
 */
exports.send = (res, data, filename = 'report') => {
  if (!data.length) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
    return res.send('No data available.');
  }

  const headers = Object.keys(data[0]).map(key => ({ id: key, title: key.replace(/_/g, ' ').toUpperCase() }));

  const csvStringifier = createObjectCsvStringifier({ header: headers });
  const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
  res.send(csv);
};
