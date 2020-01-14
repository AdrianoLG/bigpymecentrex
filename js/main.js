let tableValues = [];
$(function() {
   tableValues.push(tableValue(1));
   tableValues.push(tableValue(2));
   printValues();
   // Form styles
   $.getScript('./js/form.js');
   $('#addStation').click(function() {
      const index = Object.keys(tableValues).length + 1;
      tableValues.push(tableValue(index));
      appendContent(index);
      appendRow();
      $.getScript('./js/form.js');
      init();
   });
   init();
   $('#copyData').click(function() {
      copy($('#calculatorData'));
   });
   // APP LOGIC
   function init() {
         // Product
      $('#calculadoraForm .product select').on('selectmenuchange', function(event, ui) {
         let id = parseInt($(this)[0].name.match(/\d+/)[0]);
         let value = $(this).val();
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
         const root = $(this).parent().parent(); // station
         const product = $(root).find('.product select').val();
         changeActivationDate(root, product);
      });
         // Activation date
      $('#calculadoraForm .activationDate input').change(function(event) {
         activationDate($(this), event);
         $(this).parent().parent().find('.unsubscribeDate input').datepicker('setDate', toDate(event.target.value));
      });
         // Fee
      $('#calculadoraForm .fee input').change(function() {
         const root = $(this).parent().parent().parent(); // station
         penalizeDays(root, $(this));
      });
   }
   // FUNCTIONS
   function activationDate(dis, event) {
      const root = $(dis).parent().parent(); // station
      $(root).find('.endDate').removeClass('hidden');
      $(root).find('.unsubscribeDate').removeClass('hidden');
      const product = $(root).find('.product select').val();
      if (product != '-') {
         changeActivationDate(root, product, event);
      }
   }
   function appendContent(contentId) {
      $('.calcContainer').append(''
         + '<div id="station' + contentId + '" class="fifty fifty-left station">'
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
            + '<div class="activationDate">'
               + '<label for="activationDate' + contentId + '">Fecha de activación</label>'
               + '<input type="text" placeholder="dd/mm/aaaa" name="activationDate' + contentId + '" id="activationDate' + contentId + '" class="datepickerInp">'
            + '</div>'
            + '<div class="endDate hidden">'
               + '<label for="endDate' + contentId + '">Fecha de finalización</label>'
               + '<input type="text" placeholder="dd/mm/aaaa" name="endDate' + contentId + '" id="endDate' + contentId + '" class="datepickerInp">'
            + '</div>'
            + '<div class="unsubscribeDate hidden">'
               + '<label for="unsubscribeDate' + contentId + '">Fecha de baja</label>'
               + '<input type="text" placeholder="dd/mm/aaaa" name="unsubscribeDate' + contentId + '" id="unsubscribeDate' + contentId + '" class="datepickerInp">'
            + '</div>'
            + '<div class="fee">'
               + '<label for="fee' + contentId + '">Mensualidad</label>'
               + '<input name="fee" id="fee' + contentId + '" placeholder="0.0000">'
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
   function calculateAmount(dis, penalizeDays, id) {
      const root = $(dis).parent().parent().parent();
      const product = $(root).find('.product select').val();
      let fee = dis.val();
      let amount = fee / 30 * penalizeDays;
      let roundedAmount = amount.toFixed(2);
      if (product === 'centrex') {
         $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(6)').text(roundedAmount + '€');
      } else {
         $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(4)').text(roundedAmount + '€');
         calculatePercentage(dis, amount, id);
         calculatePenalty(dis, amount, id, penalizeDays);
      }
   }
   function calculatePenalty(dis, amount, id, penalizeDays) {
      let penalty;
      const root = $(dis).parent().parent().parent();
      const product = $(root).find('.product select').val();
      switch (product) {
         case 'centrex':
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
      $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(6)').text(penalty.toFixed(2) + '€');
   }
   function calculatePercentage(dis, amount, id) {
      let contractLength = parseInt($('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(2)').text().match(/\d+/)[0]);
      let percentage = (amount * 100) / (contractLength * $(dis).val());
      let roundedPercentage = percentage.toFixed(2);
      $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(5)').text(roundedPercentage + '%');
   }
   function changeActivationDate(root, product, event = null) {
      let newDate = event === null ? toDate($(root).find('.activationDate input').val()) : toDate(event.target.value);
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
   }
   // Copies values from HTML
   function copy(selector) {
      console.log('Entra');
      let clientName = '<h3>' + $('#calculadoraForm .clientName input').val() + '</h3>';
      var $temp = $('<div id="toCopy">');
      $('body').append($temp);
      $temp.attr('contenteditable', true).html(clientName + $(selector).html());
      selectText('toCopy');
      document.execCommand('copy');
      $temp.remove();
   }
   function penalizeDays(root, dis) {
      let endDate = $(root).find('.endDate input').datepicker('getDate');
      let unsubscribeDate = $(root).find('.unsubscribeDate input').datepicker('getDate');
      let penalizeDays = Math.ceil((endDate - unsubscribeDate) / (1000 * 60 * 60 * 24)); // Days to penalize
      let id = parseInt($(root)[0].id.match(/\d+/)[0]);
      $('#calculadoraForm table tr:nth-child(' + (id + 1) + ') td:nth-child(3)').text(penalizeDays);
      calculateAmount(dis, penalizeDays, id);
   }
   function printValues() {
      tableValues.forEach(element => {
         appendContent(element.station);
      });
      $('.calcContainer').css('height', 'auto');
      $.getScript('./js/form.js');
   }
   // Selects text to copy
   function selectText(el){
      console.log('Por aquí también');
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