$(function() {
   $.datepicker.regional['es'] = {
      closeText: 'Cerrar',
      prevText: '< Ant',
      nextText: 'Sig >',
      currentText: 'Hoy',
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
      dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
      weekHeader: 'Sm',
      dateFormat: 'dd/mm/yy',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''
   };
   $.datepicker.setDefaults( $.datepicker.regional[ "es" ] );
   $('#product').selectmenu();
   $('#posType').selectmenu();
   $('#activationDate').datepicker({
      dateFormat: "dd/mm/yy"
   });
   let today = new Date();
   let todayString = ('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear();
   $('#activationDate').val(todayString);
   jQuery( "#activationDate" ).datepicker();
   $('#endDate').val(todayString);
   jQuery( "#endDate" ).datepicker();
   $('#unsubscribeDate').val(todayString);
   jQuery( "#unsubscribeDate" ).datepicker();

   // Change date dynamically
   let partAt = '';
   $.fn.selectRange = function(start, end) {
      var e = document.getElementById($(this).attr('id')); // I don't know why... but $(this) don't want to work today :-/
      if (!e) return;
      else if (e.setSelectionRange) { e.focus(); e.setSelectionRange(start, end); } /* WebKit */
      else if (e.createTextRange) { var range = e.createTextRange(); range.collapse(true); range.moveEnd('character', end); range.moveStart('character', start); range.select(); } /* IE */
      else if (e.selectionStart) { e.selectionStart = start; e.selectionEnd = end; }
   };
   $('#activationDate').click(function() {
      let pos = document.getElementById('activationDate').selectionStart;
      switch(pos) {
         // Day
         case 0:
         case 1:
         case 2:
            $('#activationDate').selectRange(0, 2);
            partAt = 'day';
            break;
         // Month
         case 3:
         case 4:
         case 5:
            $('#activationDate').selectRange(3, 5);
            partAt = 'month';
            break;
         // Year
         case 6:
         case 7:
         case 8:
         case 9:
         case 10:
            $('#activationDate').selectRange(6, 10);
            partAt = 'year';
            break;
         default:
            console.log('Exceeded date range');
      }
   });
   $('#activationDate').focus(function() {
      $(document).keydown(function(e) {
         let date = $('#activationDate').datepicker('getDate');
         switch(e.which) {
            case 38: // up
               switch (partAt) {
                  case 'day':
                     date.setDate(date.getDate() + 1);
                     $('#activationDate').datepicker('setDate', date);
                     $('#activationDate').selectRange(0, 2);
                     break;
                  case 'month':
                     date.setMonth(date.getMonth() + 1);
                     $('#activationDate').datepicker('setDate', date);
                     $('#activationDate').selectRange(3, 5);
                     break;
                  case 'year':
                     date.setFullYear(date.getFullYear() + 1);
                     $('#activationDate').datepicker('setDate', date);
                     $('#activationDate').selectRange(6, 10);
                     break;
                  default:
                     console.log('Out of date range');
                     break;
               }
               break;
            case 40: // down
               switch (partAt) {
                     case 'day':
                        date.setDate(date.getDate() - 1);
                        $('#activationDate').datepicker('setDate', date);
                        $('#activationDate').selectRange(0, 2);
                        break;
                     case 'month':
                        date.setMonth(date.getMonth() - 1);
                        $('#activationDate').datepicker('setDate', date);
                        $('#activationDate').selectRange(3, 5);
                        break;
                     case 'year':
                        date.setFullYear(date.getFullYear() - 1);
                        $('#activationDate').datepicker('setDate', date);
                        $('#activationDate').selectRange(6, 10);
                        break;
                     default:
                        console.log('Out of date range');
                        break;
                  }
                  break;
            default: return;
         }
         e.preventDefault();
      });
   });
   $('#activationDate').blur(function() {
      $(document).off( 'keydown' );
   });
});