// Get input elements
let entries=[];
let editingIndex=null;

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const income = document.getElementById("total-income");
const expense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");
// Get the form and reset button
const form = document.getElementById("entry-form");
const resetBtn = document.getElementById("reset-btn");
const entry=document.getElementById("entry-list");
const tableBody = document.getElementById("entry-tbody");

resetBtn.addEventListener("click", () => {
    form.reset();         // Clears the inputs
    editingIndex = null;  // Exit edit mode if active
  });



function fakeAsyncOperation(data, failRate = 0.2) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < failRate) {
          reject("Fake server error occurred.");
        } else {
          resolve(data);
        }
      }, 1000); // simulate 1 second delay
    });
  }
  

form.addEventListener("submit", async function(event){
    event.preventDefault();
    const description=descriptionInput.value;
    const amount=parseFloat(amountInput.value);
    const type=typeInput.value;
    try{
        const data = await fakeAsyncOperation({description,amount,type},0.2);
        if(editingIndex!=null){
            entries[editingIndex]=data;
            editingIndex=null;
        }
        else{
            let index=entries.length;
            addEntryToTable(data.description,data.amount,data.type,index);
            entries.push(data);
            updateTotals(entries);
        }
        tableBody.innerHTML = "";
        entries.forEach((entry, i) => {
            addEntryToTable(entry.description, entry.amount, entry.type, i);
        });
        updateTotals(entries);
        form.reset();
        
    }catch(e){
        alert("failed to add entry: "+e);
    } 
});

function addEntryToTable(description,amount,type,index){
    const row=document.createElement("tr");

    const desc=document.createElement("td");
    const amt=document.createElement("td");
    const typ=document.createElement("td");
    const action=document.createElement("td");


    desc.textContent=description;
    amt.textContent=amount;
    typ.textContent=type;


    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
  
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    action.appendChild(editBtn);
    action.appendChild(deleteBtn);

    row.appendChild(desc);
    row.appendChild(amt);
    row.appendChild(typ);
    row.appendChild(action);
    tableBody.appendChild(row);
    deleteBtn.addEventListener("click",function() {
        deleteEntry(index)
    });
    editBtn.addEventListener("click", function () {
        descriptionInput.value = description;
        amountInput.value = amount;
        typeInput.value = type;
        editingIndex = index;
      });
    
}

function updateTotals(entryList){
    let totInc=0;
    let totExp=0;
    for(const entry of entryList){
        if(entry.type==="income"){
            totInc+=entry.amount;
        }
        else{
            totExp+=entry.amount;
        }
    }
    income.textContent=totInc;
    expense.textContent=totExp;
    netBalance.textContent =totInc-totExp;
}
function deleteEntry(index){
    entries.splice(index,1);
    tableBody.innerHTML="";
    entries.forEach((entry, i) => {
        addEntryToTable(entry.description, entry.amount, entry.type, i);
    });
    updateTotals(entries);
}
// These buttons will trigger filtering
document.getElementById("show-all").addEventListener("click", () => {
    showFilteredEntries("all");
  });
  
  document.getElementById("show-income").addEventListener("click", () => {
    showFilteredEntries("income");
  });
  
  document.getElementById("show-expense").addEventListener("click", () => {
    showFilteredEntries("expense");
  });
  
  function showFilteredEntries(filterType) {
    tableBody.innerHTML = ""; // clear the table
  
    entries.forEach((entry, index) => {
      if (filterType === "all" || entry.type === filterType) {
        addEntryToTable(entry.description, entry.amount, entry.type, index);
      }
    });
  }
  

