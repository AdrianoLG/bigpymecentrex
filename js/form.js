if ($('#calculadoraForm').length) {
   /**
    * INPUT TYPE TEXT
    */
   // Client
   $('#calculadoraForm .clientName input').button().addClass('textInput');
   /**
    * SPINNER - INPUT TYPE NUMBER
    */
   $('.posNum input').spinner({
      min: 1
   });
   var count = 0;
   $('.fee input').each(function(k, v) {
      $(v).spinner({
         step: 0.0001,
         numberFormat: 'n',
         change: function( event, ui ) {
            $(this).val(parseFloat($(this).val()).toFixed(4));
         }
      });
   });
   console.log(count);
   /**
    * SELECTMENU - SELECT
    */
   $('.product select').each(function(k, v) {
      $('.product select').selectmenu();
   });
   $('.posType select').each(function(k, v) {
      $('.posType select').selectmenu();
   });

   /**
    * DATEPICKER - CUSTOM
    */
   // Defaults - Spanish calendar
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
   $.datepicker.setDefaults( $.datepicker.regional[ 'es' ] );
   // Default date, init datepicker
   let todayString = '';
   $('.activationDate input').each(function(k, v) {
      if ($(v).val() == '') {
         $(v).val(todayString);
         $(v).datepicker();
      }
   });
   $('#calculadoraForm .endDate input').each(function(k, v) {
      if ($(v).val() == '') {
         $(v).val(todayString);
         $(v).datepicker();
      }
   });
   $('#calculadoraForm .unsubscribeDate input').each(function(k, v) {
      if ($(v).val() == '') {
         $(v).val(todayString);
         $(v).datepicker();
      }
   });

   // Change date dynamically
   $('#calculadoraForm .datepickerInp').each(function() {
      let partAt = '';
      // When click select range
      $(this).unbind('click').bind('click', function(e) {

         let pos = document.getElementById(this.id).selectionStart;
         switch(pos) {
            // Day
            case 0:
            case 1:
            case 2:
               $(this).selectRange(0, 2);
               partAt = 'day';
               break;
            // Month
            case 3:
            case 4:
            case 5:
               $(this).selectRange(3, 5);
               partAt = 'month';
               break;
            // Year
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
               $(this).selectRange(6, 10);
               partAt = 'year';
               break;
            default:
               console.log('Exceeded date range');
         }
      });
      // When focus use arrow keys to change day, month and year
      $(this).focus(function(e) {
         let dis = this;
         $(document).keydown(function(e) {
            let date = $(dis).datepicker('getDate');
            switch(e.which) {
               case 38: // up
                  switch (partAt) {
                     case 'day':
                        date.setDate(date.getDate() + 1);
                        $(dis).datepicker('setDate', date);
                        $(dis).selectRange(0, 2);
                        $(dis).change();
                        break;
                     case 'month':
                        date.setMonth(date.getMonth() + 1);
                        $(dis).datepicker('setDate', date);
                        $(dis).selectRange(3, 5);
                        $(dis).change();
                        break;
                     case 'year':
                        date.setFullYear(date.getFullYear() + 1);
                        $(dis).datepicker('setDate', date);
                        $(dis).selectRange(6, 10);
                        $(dis).change();
                        break;
                     default:
                        break;
                  }
                  break;
               case 40: // down
                  switch (partAt) {
                     case 'day':
                        date.setDate(date.getDate() - 1);
                        $(dis).datepicker('setDate', date);
                        $(dis).selectRange(0, 2);
                        break;
                     case 'month':
                        date.setMonth(date.getMonth() - 1);
                        $(dis).datepicker('setDate', date);
                        $(dis).selectRange(3, 5);
                        break;
                     case 'year':
                        date.setFullYear(date.getFullYear() - 1);
                        $(dis).datepicker('setDate', date);
                        $(dis).selectRange(6, 10);
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
         // When no focus remove key functions
         $(this).blur(function() {
            $(document).off( 'keydown' );
         });
      });
   });
   // Select characters
   $.fn.selectRange = function(start, end) {
      var e = document.getElementById($(this).attr('id'));
      if (!e) return;
      else if (e.setSelectionRange) { e.focus(); e.setSelectionRange(start, end); } /* WebKit */
      else if (e.createTextRange) { var range = e.createTextRange(); range.collapse(true); range.moveEnd('character', end); range.moveStart('character', start); range.select(); } /* IE */
      else if (e.selectionStart) { e.selectionStart = start; e.selectionEnd = end; }
   };
}