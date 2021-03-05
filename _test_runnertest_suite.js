const index = require('./index.js');
const getTimestamp = require('./api/timestamp.js').getTimestamp;


describe("UnitTests", function() {

  test("Covert-to-UTC", async function() {
    expect(getTimestamp('1451001600000')).toEqual({
      utc: 'Fri, 25 Dec 2015 00:00:00 GMT',
      unix: 1451001600000
    });
  });

  test("Convert-to-Unix", async function() {
    expect(getTimestamp('2015-12-25')).toEqual({
      unix: 1451001600000,
      utc: 'Fri, 25 Dec 2015 00:00:00 GMT'
    });
  });

});