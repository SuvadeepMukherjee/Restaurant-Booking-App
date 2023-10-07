// Select elements from the HTML document
const price = document.querySelector("#price");
const dish = document.querySelector("#dish");
const category = document.querySelector("#category");
const submit = document.querySelector("#submit");

/*
if we are adding new entry then id stays 1 ,
 if we edit then id takes the value of the event.target.id
 */
let id = 1;

let url = "https://crudcrud.com/api/4feb18d9be5a45caae28e395b948dacd";

/***********************************************************/
//function to fetch data from storage
/***********************************************************/
async function getData() {
  // Try to fetch dataObj from a specified URL using a get request
  return await axios.get(`${url}/order`);
}

/***********************************************************/
//displaying data already available
/***********************************************************/
async function displayData() {
  // Fetch dataObj asynchronously using the getData function
  const dataObj = await getData();

  /*
  extract the data property from dataobj ,
   it is an array of objects with _id,priceValue,dishValue and categoryValue*/
  const dataArray = dataObj.data;

  // If the data array is null, return early
  if (dataArray === null) return;

  let html = "";
  /*Loop through the data array and generate HTML elements for each item 
  and add an id to the delete and edit button equal to _id property of the dataArray[i] object */
  for (let i = 0; i < dataArray.length; i++) {
    html += `<div class ="child ${dataArray[i]._id}">
    ${dataArray[i].dishValue} ${dataArray[i].priceValue} 
    ${dataArray[i].categoryValue}
    <button class ="editbtn" id="${dataArray[i]._id}">Edit</button>
    <button class ="deletebtn" id=${dataArray[i]._id}>Delete</button>
    </div>`;
  }
  const display = document.querySelector("#display");
  display.insertAdjacentHTML("afterbegin", html);
}
displayData();

/***********************************************************/
//Editing & Deleting
/***********************************************************/
const parent = document.querySelector("#display");
// Event listener for editing or deleting data
parent.addEventListener("click", async function editDelete(e) {
  e.preventDefault();
  //retreive data from server
  let dataObj = await getData();
  let dataArray = dataObj.data;

  //find the id of the element where the event occured
  let eventId = e.target.id;

  //find the index of the clicked object in the data array
  const index = dataArray.findIndex((object) => {
    return object._id === e.target.id;
  });

  if (e.target.className === "editbtn") {
    //if editing populate form fields with the selected data for editing
    price.value = dataArray[index].priceValue;
    dish.value = dataArray[index].dishValue;
    category.value = dataArray[index].categoryValue;
    id = eventId;
  }
  if (e.target.className === "deletebtn") {
    //delete request to delete requested resources on server
    axios.delete(`${url}/order/${e.target.id}`).then((response) => {
      console.log(response);
    });
    location.reload();
  }
});

/***********************************************************/
//listening to click on submit button
/***********************************************************/
submit.addEventListener("click", function (e) {
  e.preventDefault();

  //extract values from input Fields
  let priceValue = price.value;
  let dishValue = dish.value;
  let categoryValue = category.value;

  //making an object of values received
  let obj = {
    priceValue,
    dishValue,
    categoryValue,
  };
  if (id === 1) {
    //if its fresh data , add it via an HTTP Post request
    axios.post(`${url}/order`, obj).then((res) => console.log(res));
    location.reload();
  } else if (id !== 1) {
    //if its an edit operation update the data via an HTTP Put request
    axios.put(`${url}/order/${id}`, obj).then((res) => console.log(res));
    location.reload();
  }
});
