QUnit.module("getPrice", function () {
  QUnit.test(
    "should return the price based on the following guide: 1 Jun - 31 Aug ($200 per night), 1 Sep - 18 Dec ($220 per night), 1 Feb - 31 May ($220 per night), 19 Dec – 31 Jan ($250 per night)",
    function (assert) {
      var junFirstDay = new DatePrice(new Date(2020, 5, 1));
      var augLastDay = new DatePrice(new Date(2020, 7, 31));
      var sepFirstDay = new DatePrice(new Date(2020, 8, 1));
      var decEighteenthDay = new DatePrice(new Date(2020, 11, 18));
      var decNineteenthDay = new DatePrice(new Date(2020, 11, 19));
      var janLastDay = new DatePrice(new Date(2020, 0, 31));
      var febFirstDay = new DatePrice(new Date(2020, 1, 1));
      var mayLastDay = new DatePrice(new Date(2020, 04, 31));

      assert.equal(junFirstDay.getPrice(), 200);
      assert.equal(augLastDay.getPrice(), 200);
      assert.equal(sepFirstDay.getPrice(), 220);
      assert.equal(decEighteenthDay.getPrice(), 220);
      assert.equal(decNineteenthDay.getPrice(), 250);
      assert.equal(janLastDay.getPrice(), 250);
      assert.equal(febFirstDay.getPrice(), 220);
      assert.equal(mayLastDay.getPrice(), 220);
    }
  );
});

