// console.log(module);

// module.exports = "Hello World";

// module.exports = getDate;

// module.exports.getDate = getDate;

// module.exports.getDate = getDate = function () {
//   var today = new Date();
//   var currentDay = today.getDay();

//   let options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//   };

//   return today.toLocaleDateString("en-US", options);
// };

exports.getDate = getDate = function () {
  const today = new Date();
  var currentDay = today.getDay();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
};

exports.getDay = function () {
  const today = new Date();
  var currentDay = today.getDay();

  let options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options);
};
