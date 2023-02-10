//Initial References
let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");
let alarmasLocal =[];
let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

var bbdd = window.localStorage;

var tem = document.querySelector("template");

if (bbdd.getItem("alarmas")) {
  console.log("Hay alarmas");
  alarmasLocal = JSON.parse(bbdd.getItem("alarmas"));
}else{
  console.log("No hay alarmas");
  bbdd.setItem("alarmas", JSON.stringify(alarmasLocal));
}

//Inicializamos las alarmas guardadas
function mostrarAlarmas(){
  console.log(alarmasLocal.length);
  for(i = 0; i < alarmasLocal.length;i++){
    alarma = alarmasLocal[i];
    let alarmObj = {};
      alarmObj.id = alarma.id.toString();
      alarmObj.alarmHour = alarma.alarmHour;
      alarmObj.alarmMinute = alarma.alarmMinute;
      alarmObj.isActive = false;
      createAlarm(alarmObj);
  }
}
//Añadimos cero si el numero es de un solo digito
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Buscamos el valor en el objeto alarma
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

//Mostramos la hora
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  
  timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

  //Alarma
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
        document.getElementsByClassName("wrapper")[0].classList.add("playing");
        alarmSound.play();
        alarmSound.loop = true;
        
      }
    }
  });
}

const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

//Creamos el div de la alrma

const createAlarm = (alarmObj) => {
  const { id, alarmHour, alarmMinute } = alarmObj;
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;
  
  //Checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  //Boton de borrar
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};

//Preparamos la alarma
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  //Objeto alarma
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.isActive = false;
  createAlarm(alarmObj);
  alarmsArray.push(alarmObj);
  alarmasLocal.push(alarmObj);
  bbdd.setItem("alarmas",JSON.stringify(alarmasLocal));
  
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
});

//Inicio alarma
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

//Parar alarma
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
    document.getElementsByClassName("wrapper")[0].classList.remove("playing");
  }
};

//Borrar alarma
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  console.log("Busca el id: " +searchId);
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists ) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
    console.log(alarmsArray);
    
    alarmasLocal.splice(index,1);
    bbdd.setItem("alarmas",JSON.stringify(alarmasLocal));
    console.log(alarmasLocal);
    
  }else{
    console.log("No existe");
    console.log(alarmsArray);
    console.log(alarmasLocal);
  }
};

window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
};


//Toggle
function toggleShow(){
  let modal = document.getElementById("Modal");
  let boton = document.getElementsByClassName("toggle");
   
    console.log(boton.innerHTML);
    
      if(modal.style.display == "none"){
        modal.style.display= "block";
        boton[0].value="🡰";
       }else{
        modal.style.display= "none";
        boton[0].value="Nueva alarma";
      }
    
  }


//Fecha
var dia = document.querySelector('.dia')
var mes = document.querySelector('.mes')
var año = document.querySelector('.año')

var fecha = new Date()

dia.innerHTML = fecha.getDate();
mes.innerHTML = fecha.getMonth()+1;
año.innerHTML = fecha.getFullYear();

//Guardamos alarmas en el almacenamiento local

mostrarAlarmas();