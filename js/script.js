 function newFormatDate(date) {
   var result;
   var year = date.split(", ")[1];
   var month = ["Январь", "Фервраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
   for (var i = 0; i < 12; i++){
     if (date.split(", ")[0] == month[i]){
       var numMonth = i + 1;
       result = numMonth + "." + year;
       break;
     }
   }
   console.log(result);
   return result;
}

function getInfo(dataInfo) {
  var result = "";
  if (dataInfo) {
    result="<span class='data-table__info'></span>";
  }
  return result;
}

function fillTable(data) {
  var table = $("<table>");
  $("tr.data-table__row").remove();
  for (var i =0; i < data.length; i++) {
    $("<tr>").addClass("data-table__row")
              .append( $("<td>").html($("<img src='img/"+data[i].type+"-status.png' width='12px' height='12px' alt=''>")))
              .append( $("<td>").html(data[i].ticket))
              .append( $("<td>").append($("<div>").addClass("data-table__name").html(data[i].name)))
              .append( $("<td>").html($("<span class='data-table__"+data[i].p+"-circle'></span>")))
              .append( $("<td>").html(data[i].status))
              .append( $("<td>").html(data[i].desicion))
              .append( $("<td>").html(data[i].create))
              .append( $("<td>").html(data[i].update))
              .append( $("<td>").html(data[i].deadline))
              .append( $("<td>").html(getInfo(data[i].info)))
              .appendTo("#dataTable");
    }
  }

  function searchName(data) {
    var str = $(".form__input--search").val();
    var finalData = data;
    for (var i = 0; i < finalData.length; i++) {
      if(finalData[i].name.toLowerCase().indexOf(str.toLowerCase()) === -1) {
        finalData.splice(i, 1);
        i--;
      }
    }
    return finalData;
  }

  function searchDate(data) {
    var valueSelected = $("#dateSelect option:selected").text();
    var formatDate = newFormatDate(valueSelected);
    var finalData = data;
    for (var i = 0; i < finalData.length; i++) {
      if (finalData[i].create.indexOf(formatDate) === -1) {
        finalData.splice(i, 1);
        i--;
      }
    }
    return finalData;
  }

  function searchStatus(data) {
    var valueSelected = $("#typeSelect option:selected").text();
    var finalData = data;
    for (var i = 0; i < finalData.length; i++) {
      if(valueSelected == "Открытые задачи") {
        if (finalData[i].status != "Открыто") {
          finalData.splice(i, 1);
          i--;
        }
      }
      if(valueSelected == "Закрытые задачи") {
        if (finalData[i].status != "Закрыто") {
          finalData.splice(i, 1);
          i--;
        }
      }
    }
    return finalData;
  }

  function pagesNum(data) {
    var num = 0;
    var activeNum = $(".data__num--active").html();
    if (activeNum == "все") {
      num = data.length;
    }
    else {
      num = parseInt(activeNum);
    }
    return num;
  }

  function drawTable(data, pageNum) {
    $(".data__count").html(data.length);
    $('#pagination-container').pagination({
      dataSource: data,
      pageSize: pageNum,
      showPrevious: false,
      showNext: false,
      callback: function(data, pagination) {
        fillTable(data);
      }
    });
  }

  function getFinalData(data) {
    var statusData = searchStatus(allData);
    var dateData = searchDate(statusData);
    var nameData = searchName(dateData);
    return nameData;
  }

  function updTable() {
    $.getJSON("js/data.json", function(data) {
    allData = data.records;
    var finalData = getFinalData(allData);
    drawTable(finalData, pagesNum(finalData));
   });
  }

  $(document).ready(function() {
   $("tr.data-table__row").remove();
    updTable();
  });

  $("#typeSelect").change(function() {
    $("tr.data-table__row").remove();
    updTable();
 });

  $("#dateSelect").change(function() {
    $("tr.data-table__row").remove();
    updTable();
  });

  $(".form__input--search").bind("enterKey",function(event){
    $("tr.data-table__row").remove();
    updTable();
  });

  $('.form__input--search').keyup(function(event){
    if(event.keyCode == 13) {
      $(this).trigger("enterKey");
    }
  });

  $(".data__num").click(function(event) {
    event.preventDefault();
    $(".data__num--active").removeClass("data__num--active");
    $(event.target).addClass("data__num--active");
    $("tr.data-table__row").remove();
    updTable();
  });
