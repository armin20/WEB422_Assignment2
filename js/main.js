/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Armin Sharifiyan Student ID: 130891203 Date: 30/09/2021
 *
 *
 ********************************************************************************/

let restaurantData = [];
let currentRestaurant = {};
let page = 1;
const perPage = 10;
let map = null;

function avg(grades) {
  let sum = 0,
    res = 0;
  for (let i = 0; i < grades.length; i++) {
    sum += grades[i].score;
  }
  res = sum / grades.length;
  return res.toFixed(2);
}

let tableRows = _.template(
  `<% _.forEach(restaurants, function(restaurant){ %>
        <tr data-id=<%- restaurant._id %>>
        <td><%- restaurant.name %></td>
        <td><%- restaurant.cuisine %></td>
        <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
        <td><%- avg(restaurant.grades) %></td>
        </tr>
    <% }); %>`
);

function loadRestaurantData() {
  return fetch(
    `https://hidden-gorge-64232.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      var a = [];
      a = data.filter((elem) => {
        return elem.address.coord.length !== 0;
      });
      console.log(a);
      restaurantData = a;
      // console.log(restaurantData);
      var results = tableRows({ restaurants: restaurantData });
      $("#restaurant-table tbody").html(results);
      // $("#restaurant-table tbody").append(results);
      $("#current-page").html(page);
    })
    .catch((err) => console.log("Error" + err));
}

$(function () {
  loadRestaurantData();

  $("#restaurant-table tbody").on("click", "tr", function () {
    let ids = $(this).attr("data-id");
    // console.log(ids);
    currentRestaurant = _.filter(restaurantData, function (restaurant) {
      return restaurant._id === ids;
    });
    $(".modal-title").html(currentRestaurant[0].name);
    $("#restaurant-address").html(
      currentRestaurant[0].address.building +
        " " +
        currentRestaurant[0].address.street
    );
    $("#restaurant-modal").modal("show");
  });

  $("#previous-page").on("click", () => {
    if (page > 1) {
      page--;
      loadRestaurantData();
    }
  });

  $("#next-page").on("click", () => {
    page++;
    loadRestaurantData();
  });

  $("#restaurant-modal").on("shown.bs.modal", function () {
    const { coord } = currentRestaurant[0].address;

    map = new L.Map("leaflet", {
      center: [coord[1], coord[0]],
      zoom: 18,
      layers: [
        new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
      ],
    });

    L.marker([coord[1], coord[0]]).addTo(map);
  });

  $("#restaurant-modal").on("hidden.bs.modal", function () {
    map.remove();
  });
});
