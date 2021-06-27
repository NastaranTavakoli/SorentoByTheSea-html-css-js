/**
 * Stores the current date
 * @name today
 * @type {Date}
 */
var today = new Date();

/**
 * Stores the starting date of the quarterly calendar
 * @name startingDate
 * @type {Date}
 */
var startingDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);

/**
 * Stores the starting month of the quarterly calendar
 * @name startingMonth
 * @type {number}
 */
var startingMonth = startingDate.getMonth();

/**
 * Stores the starting year of the quarterly calendar
 * @name startingYear
 * @type {number}
 */
var startingYear = startingDate.getFullYear();

/**
 * Stores the DatePrice objects based on user's date selection
 * @name selectedDates
 * @type {Array}
 */
var selectedDates = new Array();

/**
 * Stores html select element containing the month options for the user to select
 * @name monthsDropdown
 */
var monthsDropdown = document.querySelector("#month-dropdown");

/**
 * Stores html select element containing the day options for the user to select
 * @name daysDropdown
 */
var daysDropdown = document.querySelector("#day-dropdown");

/**
 * Stores html select element containing the date options for the user to select
 * @name datesDropdown
 */
var datesDropdown = document.querySelector("#selected-dates-dropdown");

var isFirst = true;
for (var i = 0; i < 3; i++) {
  var monthName = startingDate.toLocaleString("default", {
    month: "long",
  });
  var option = document.createElement("option");
  var text = document.createTextNode(monthName);
  option.appendChild(text);
  monthsDropdown.appendChild(option);
  if (isFirst) {
    option.selected = true;
    isFirst = false;
  }
  startingDate.setMonth(startingDate.getMonth() + 1);
}

/**
 * creates options for the daysDropdown based on the selected month from monthsDropdown. Gets called when user clicks on the daysDropdown.
 * @function dayOptions
 */
function dayOptions() {
  var selectedMonthIndex = monthsDropdown.selectedIndex;
  for (i = daysDropdown.options.length - 1; i >= 1; i--) {
    daysDropdown.remove(i);
  }
  startingDate.setMonth(startingMonth);
  var lastDayOfMonth = new Date(
    startingYear,
    startingMonth + selectedMonthIndex + 1,
    0
  ).getDate();

  for (i = 1; i <= lastDayOfMonth; i++) {
    var option = document.createElement("option");
    var text = document.createTextNode(i);
    option.appendChild(text);
    daysDropdown.appendChild(option);
  }
}

/**
 * Compares the value of the date properties of two DatePrice Objects. This function will be passed to the sort method of the selectedDates array.
 * @function compare
 * @param {DatePrice} a - A DatePrice object.
 * @param {DatePrice} b - A DatePrice object.
 * @returns {number} - It is either 0, 1 or -1, indicating which DatePrice's date value is less.
 */
function compare(a, b) {
  const dateA = a.date;
  const dateB = b.date;
  let comparison = 0;
  if (dateA > dateB) {
    comparison = 1;
  } else if (dateA < dateB) {
    comparison = -1;
  }
  return comparison;
}

/**
 * Creates a new DatePrice object based on the user selected date, adds the object to the selectedDates array, sorts the array and updates the html table contents.
 * @function addDate
 */
function addDate() {
  var selectedDay = daysDropdown.value;
  var selectedMonth = startingMonth + monthsDropdown.selectedIndex;
  var selectedDate = new Date(startingYear, selectedMonth, selectedDay);
  var selectedDatePrice = new DatePrice(selectedDate);
  selectedDates.push(selectedDatePrice);
  selectedDates.sort(compare);
  updateTableContent();
}

/**
 * Updates the html elements residing in a table when user calls the addDate function to add a new date.
 * @function updateTableContent
 */
function updateTableContent() {
  var total = 0;
  document.getElementById("selected-dates").innerHTML = "";
  document.getElementById("price").innerHTML = "";
  for (var i = 0; i < selectedDates.length; i++) {
    total += selectedDates[i].price;
    document.getElementById("selected-dates").innerHTML +=
      selectedDates[i].date.toDateString() + "<br />";
    document.getElementById(
      "price"
    ).innerHTML += `$${selectedDates[i].price} <br />`;
  }
  document.getElementById("total").innerHTML = "Total: $" + total;
}

/**
 * Adds date options based on an array(selectedDates) to a html select element with id of "datesDropdown".
 * @function selectedDateOptions
 */
function selectedDateOptions() {
  while (datesDropdown.options.length > 0) {
    datesDropdown.options[0] = null;
  }
  for (i = 0; i < selectedDates.length; i++) {
    var option = document.createElement("option");
    var text = document.createTextNode(selectedDates[i].date.toDateString());
    option.appendChild(text);
    datesDropdown.appendChild(option);
  }
}

/**
 * Searches for a date in array to find its position in an array.
 * @function searchDate
 * @param {string} searchValue - The desired date to search in the collection of dates.
 * @param {Array} collection - The Array of the objects(dates) to be searched in.
 * @returns {number} - The position of the object in the given array. The position is zero-based index.
 */
function searchDate(searchValue, collection) {
  var first = 0;
  var last = collection.length - 1;
  var position = -1;
  var found = false;
  var middle;
  while (found === false && first <= last) {
    middle = Math.floor((first + last) / 2);
    if (collection[middle].date.toDateString() == searchValue) {
      found = true;
      position = middle;
    } else if (collection[middle].date > new Date(searchValue)) {
      last = middle - 1;
    } else {
      first = middle + 1;
    }
  }
  return position;
}

/**
 * Finds the date using binary and removes it from the dropdown options. If no options is available, a pop up message will be displayed indicating so.
 * @function removeDate
 */
function removeDate() {
  if (selectedDates.length == 0) {
    alert("You havn't added any dates yet!");
  } else {
    var searchValue = datesDropdown.options[datesDropdown.selectedIndex].value;
    var index = searchDate(searchValue, selectedDates);
    selectedDates.splice(index, 1);
    updateTableContent();
  }
}

/** Class representing a date and its booking fee. */
class DatePrice {
  /**
   * Creates a DatePrice.
   * @param {Date} date - The date.
   * @param {number} price - The booking price for the date.
   */
  constructor(d) {
    this.date = new Date(d);
    this.price = this.getPrice();
  }

  /**
   * returns the price for each DatePrice object.
   * @return {number}
   */
  getPrice() {
    if (
      this.date.getMonth() == 0 ||
      (this.date.getMonth() == 11 && this.date.getDate() >= 19)
    ) {
      return 250;
    } else if (this.date.getMonth() >= 5 && this.date.getMonth() <= 7) {
      return 200;
    } else {
      return 220;
    }
  }
}
