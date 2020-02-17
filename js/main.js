let tableValues = [];
let root;
$(function() {
   tableValues.push(tableValue(1));
   tableValues.push(tableValue(2));
   printValues();
   // Form styles
   $.getScript('./js/form.js');
   $('#addStation').click(function() {
      const index = Object.keys(tableValues).length + 1;
      tableValues.push(tableValue(index));
      // Form styles
      $.getScript('./js/form.js');
      appendContent(index);
      appendRow();
      init();
   });
   init();
   $('#copyData').click(function() {
      copy($('#calculatorData'), 'data');
   });
   $('#copyTable').click(function() {
      copy($('#calculatorData'), 'table');
   });

   // APP LOGIC
   function init() {
      // FORM
         // Select changes
      $('#calculadoraForm select').on('selectmenuchange', function() {
         formHasChanged($(this));
      });
         // Input changes
      $('#calculadoraForm .calcContainer input').change(function() {
         formHasChanged($(this));
      });
         // Spin changes (input)
      $('#calculadoraForm input').on('spinstart', function() {
         $(this).parent().find('.ui-button').unbind().click(function(e) {
            formHasChanged($(this).parent().find('input'));
         });
      });
   }

   // FUNCTIONS
   function appendContent(contentId) {
      $('.calcContainer').append(''
         + '<div id="station' + contentId + '" class="station">'
            + '<h4>Puesto ' + contentId + '</h4>'
            + '<div class="product">'
               + '<label for="product' + contentId + '">Producto</label>'
               + '<select id="product' + contentId + '" name="product' + contentId + '">'
                  + '<option>-</option>'
                  + '<option value="centrex">Centrex</option>'
                  + '<option value="bigPyme">Big PYME</option>'
                  + '<option value="bigPymeAdmins">Big PYME administraciones públicas</option>'
                  + '<option value="bigPymePlus">Big PYME + ampliación de puestos posterior</option>'
               + '</select>'
            + '</div>'
            + '<div class="posNum">'
               + '<label for="posNum' + contentId + '">Número de puestos</label>'
               + '<input id="posNum' + contentId + '" placeholder="0">'
            + '</div>'
            + '<div class="posType">'
               + '<label for="posType' + contentId + '">Tipo de puesto</label>'
               + '<select name="posType' + contentId + '" id="posType' + contentId + '">'
                  + '<option>-</option>'
                  + '<option value="advanced">Puesto avanzado</option>'
                  + '<option value="basic">Puesto básico</option>'
                  + '<option value="analogic">Puesto analógico</option>'
                  + '<option value="wireless">Puesto inalámbrico</option>'
                  + '<option value="mobile">Puesto móvil</option>'
               + '</select>'
            + '</div>'
            + '<div class="fee">'
               + '<label for="fee' + contentId + '">Mensualidad</label>'
               + '<input name="fee" id="fee' + contentId + '" placeholder="0.0000">'
            + '</div>'
            + '<div class="activationDate">'
               + '<label for="activationDate' + contentId + '">Fecha de<br>activación</label>'
               + '<input type="text" placeholder="dd/mm/aaaa" name="activationDate' + contentId + '" id="activationDate' + contentId + '" class="datepickerInp">'
            + '</div>'
            + '<div class="endDate hidden">'
               + '<label for="endDate' + contentId + '">Fecha de<br>finalización</label>'
               + '<input type="text" placeholder="dd/mm/aaaa" name="endDate' + contentId + '" id="endDate' + contentId + '" class="datepickerInp">'
            + '</div>'
            + '<div class="unsubscribeDate hidden">'
               + '<label for="unsubscribeDate' + contentId + '">Fecha de baja</label>'
               + '<input type="text" placeholder="dd/mm/aaaa" name="unsubscribeDate' + contentId + '" id="unsubscribeDate' + contentId + '" class="datepickerInp">'
            + '</div>'
         + '</div>');
   }
   function appendRow() {
      $('#calculadoraForm table').append(''
         + '<tr>'
            + '<td class="tbProduct"></td>'
            + '<td class="tbContract"></td>'
            + '<td class="tbDays"></td>'
            + '<td class="tbPrice"></td>'
            + '<td class="tbPercentage"></td>'
            + '<td class="tbPenal"></td>'
         + '</tr>');
   }
   function calculateAmount(penalizeDays, id) {
      const product = $(root).find('.product select').val();
      let fee = $(root).find('.fee input').val();
      let amount = (fee / 30) * penalizeDays;
      let roundedAmount = amount.toFixed(2);
      if (product === 'centrex') {
         $("#calculadoraForm table tr:nth-child(" + (id + 1) + ") td:nth-child(6)").text(roundedAmount + '€');
         $("#calculadoraForm table tr:nth-child(" + (id + 1) + ") td:nth-child(4)").text('');
         $("#calculadoraForm table tr:nth-child(" + (id + 1) + ") td:nth-child(5)").text('');
      } else {
         $("#calculadoraForm table tr:nth-child(" + (id + 1) + ") td:nth-child(4)").text(roundedAmount + '€');
         calculatePenalty(amount, id, penalizeDays);
      }
      let total = 0;
      $('#calculadoraForm table tr .tbPenal').each(function(k, v) {
         let temp = $(this)[0].innerHTML;
         if (temp != '') {
            let tempNoUnit = temp.slice(0, temp.length - 1);
            total += parseFloat(tempNoUnit);
         }
      });
      if (!$('#calculadoraForm .total').length) {
         $('#calculadoraForm #calculatorData').append(''
            + '<p class="total">Total: ' + total.toFixed(2) + '€</p>');
      }
      $('#calculadoraForm .total').text('Total: ' + total.toFixed(2) + '€');
   }
   function calculatePenalizeDays() {
      let endDate = $(root).find('.endDate input').datepicker('getDate');
      let unsubscribeDate = $(root).find('.unsubscribeDate input').datepicker('getDate');
      var diff = Math.abs(endDate - unsubscribeDate);
      let penalizeDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      let stationId = $(root).attr('id');
      let id = parseInt(stationId.substr(stationId.length - 1, 1));
      $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(3)').text(penalizeDays);
      calculateAmount(penalizeDays, id);
   }
   function calculatePenalty(amount, id, penalizeDays) {
      let penalty;
      const product = $(root).find('.product select').val();
      switch (product) {
         case 'centrex':
            penalty = 0;
            break;
         case 'bigPyme':
            if (penalizeDays > 365) {
               penalty = amount * .5;
            } else {
               penalty = amount * .2;
            }
            break;
         case 'bigPymePlus':
            if (penalizeDays > 365) {
               penalty = amount * .5;
            } else {
               penalty = amount * .2;
            }
            break;
         case 'bigPymeAdmins':
            if (penalizeDays > 183) {
               penalty = amount;
            } else {
               penalty = amount * .4;
            }
            break;
         default:
            console.log('Error setting penalty');
      }
      if (penalty !== undefined) {
         $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(6)').text(penalty.toFixed(2) + '€');
         calculatePercentage(amount, penalty, id);
      }
   }
   function calculatePercentage(amount, penalty, id) {
      let percentage = (penalty * 100) / amount;
      let roundedPercentage = parseInt(percentage.toFixed(2));
      $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(5)').text(roundedPercentage + '%');
   }
   function changeDates(activationDate) {
      $(root).find('.endDate').removeClass('hidden');
      $(root).find('.unsubscribeDate').removeClass('hidden');
      const product = $(root).find('.product select').val();
      if ((product != '' || product != '-') && (activationDate != '' || activationDate != '-')) {
         setDates(activationDate, product);
      }
   }
   function checkDates() {
      let activationDate = $(root).find('.activationDate input').datepicker('getDate');
      let unsubscribeDate = $(root).find('.unsubscribeDate input').datepicker('getDate');
      let activationDateTS = activationDate.getTime();
      let unsubscribeDateTS = unsubscribeDate.getTime();
      if (unsubscribeDateTS < activationDateTS) {
         $(root).append('<p class="warning">La fecha de baja no puede ser inferior a la fecha de activación</p>');
         setTimeout(() => {
            $('.warning').remove();
            $(root).find('.unsubscribeDate input').datepicker('setDate', activationDate);
         }, 3000);
      }
   }
   // Copies values from HTML
   function copy(selector, kind) {
      let clientNameVal = $('#calculadoraForm .clientName input').val() || '-';
      let clientName = '<h3>' + clientNameVal + '</h3>';
      var $temp = $('<div id="toCopy">');
      $('body').append($temp);
      let insideData = '';
      if (kind == 'data') {
         $('.station').each(function() {
            let stationProduct = $(this).find('.product .ui-selectmenu-text').text() || '-';
            let stationPosNum = $(this).find('.posNum input').attr('aria-valuenow') || '-';
            let stationPosType = $(this).find('.posType .ui-selectmenu-text').text() || '-';
            let stationFee = $(this).find('.fee input').attr('aria-valuenow') || '-';
            let stationActivationDate = $(this).find('.activationDate input').val() || '-';
            let stationEndDate = $(this).find('.endDate input').val() || '-';
            let stationUnsubscribeDate = $(this).find('.unsubscribeDate input').val() || '-';
            insideData += '<h4>' + $(this).find('h4').text() + '</h4>'
               + '<p>Producto: ' + stationProduct + '</p>'
               + '<p>Número de puestos: ' + stationPosNum + '</p>'
               + '<p>Tipo de puesto: ' + stationPosType + '</p>'
               + '<p>Mensualidad: ' + stationFee + '€</p>'
               + '<p>Fecha de activación: ' + stationActivationDate + '</p>'
               + '<p>Fecha de finalización: ' + stationEndDate + '</p>'
               + '<p>Fecha de baja: ' + stationUnsubscribeDate + '</p>';
         });
      }
      var tempData = '<div id="tempData">' + clientName + insideData + '</div>';
      $temp.attr('contenteditable', true).html(tempData + $(selector).html());
      console.log(tempData);
      $('#toCopy').css(
         {
            'font-size': '11px',
            'text-align': 'left'
         }
      );
      $('#toCopy table th, #toCopy table td').css(
         {
            'text-align': 'left'
         }
      );
      selectText('toCopy');
      document.execCommand('copy');
      $temp.remove();
   }
   function fillProduct(dis) {
      let id = parseInt(dis[0].name.match(/\d+/)[0]);
      let value = dis.val();
      if (value) {
         switch (value) {
            case 'centrex':
               $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:first-child').text('Centrex');
               $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(2)').text('18 meses');
            break;
            case 'bigPyme':
               $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:first-child').text('Big PYME');
               $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(2)').text('24 meses');
            break;
            case 'bigPymeAdmins':
               $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:first-child').text('Big PYME administraciones públicas');
               $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(2)').text('12 meses');
            break;
            case 'bigPymePlus':
               $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:first-child').text('Big PYME + Ampliación de puestos posterior');
               $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(2)').text('24 meses');
            break;
            default:
               console.log('Error');
         }
      }
   }
   function formHasChanged(dis) {
      let stationId = dis[0].id.match(/\d/g);
      let stationName = dis[0].id.match(/[a-zA-Z]/g).join('');
      if (stationName === 'posNum' || stationName === 'fee') {
         root = $(dis).parent().parent().parent();
      } else {
         root = $(dis).parent().parent();
      }
      let productVal = $(root).find('.product select').val();
      let posNumVal = $(root).find('.posNum input').val();
      let posTypeVal = $(root).find('.posType select').val();
      let feeVal = $(root).find('.fee input').val();
      let activationDateVal = $(root).find('.activationDate input').val();
      let endDateVal = $(root).find('.activationDate input').val();
      let unsubscribeDateVal = $(root).find('.activationDate input').val();
      switch (stationName) {
         case 'product':
            fillProduct(dis, stationId, stationName);
            if (feeVal != '' && activationDateVal != '') {
               changeDates(activationDateVal);
               checkDates();
               calculatePenalizeDays();
            }
            break;
         case 'posNum':
            // posNum changes
            break;
         case 'posType':
            // posType changes
            break;
         case 'fee':
            if (activationDateVal != '' && unsubscribeDateVal != '') {
               calculatePenalizeDays();
            }
            break;
         case 'activationDate':
            changeDates(activationDateVal);
            checkDates();
            calculatePenalizeDays();
            break;
            case 'endDate':
               // endDate changes
               break;
            case 'unsubscribeDate':
               if (productVal != '' && activationDateVal != '' && endDateVal != '' && unsubscribeDateVal != '') {
                  changeDates(activationDateVal);
                  checkDates();
                  calculatePenalizeDays();
               }
            // Activación o fecha
            break;
         default:
      }
      productVal = '';
      posNumVal = '';
      posTypeVal = '';
      feeVal = '';
      activationDateVal = '';
      endDateVal = '';
      unsubscribeDateVal = '';
   }
   function printValues() {
      tableValues.forEach(element => {
         appendContent(element.station);
      });
      $('.calcContainer').css('height', 'auto');
   }
   // Selects text to copy
   function selectText(el){
      var doc = document;
      var element = document.getElementById(el);
      if (doc.body.createTextRange) {
         var range = document.body.createTextRange();
         range.moveToElementText(element);
         range.select();
      } else if (window.getSelection) {
         var selection = window.getSelection();
         var range = document.createRange();
         range.selectNodeContents(element);
         selection.removeAllRanges();
         selection.addRange(range);
      }
   }
   function setDates(activationDate, product) {
      let newDate = toDate(activationDate);
      switch (product) {
         case 'centrex':
            newDate.setMonth(newDate.getMonth() + 18);
            break;
         case 'bigPyme':
         case 'bigPymePlus':
            newDate.setMonth(newDate.getMonth() + 24);
            break;
         case 'bigPymeAdmins':
            newDate.setMonth(newDate.getMonth() + 12);
            break;
         default:
            console.log('Error setting month');
      }
      $(root).find('.endDate input').datepicker('setDate', newDate);
      $(root).find('.endDate input').datepicker('disable');
      if ($(root).find('.unsubscribeDate input').datepicker('getDate') == null) {
         $(root).find('.unsubscribeDate input').datepicker('setDate', toDate(activationDate));
      }
   }
   function tableValue(n) {
      return {
         'station': n,
         'product': '',
         'number': 0,
         'type': '',
         'activation': '',
         'fee': 0
      }
   }
   function toDate(dateStr) {
      var parts = dateStr.split("/")
      return new Date(parts[2], parts[1] - 1, parts[0])
    }
});