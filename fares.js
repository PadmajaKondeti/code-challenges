// JavaScript Document
(function($){
var fareLoading = 
{
	init: function(){
		zonesInfo={};
		farePerRides = 1;
		price = 1;
		$('#txtFare').prop( "disabled", true );
		//fareLoading.disableTXTfare();
	},
	disableTXTfare: function(){
		if((key.charCode < 97 || key.charCode > 122) &&
		(key.charCode < 65 || key.charCode > 90) &&
		//(key.charCode < 48 || key.charCode > 57) && 
		(key.charCode != 45)){
		 return false;
		}
	},
	numericOnly: function(){
		$("#numRides").keydown(function(event) {
			if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 ) {
				// let it happen, don't do anything
			}
			else {
			// Ensure that it is a number and stop the keypress
				if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keywCode > 105 )) {
						event.preventDefault(); 
						$('.error').css('display', 'block');
				} else{
					$('.error').css('display', 'none');		
				} 
			}
		});
	},
	clearZoneVal: function(){
		$('select[name="riding"]').empty();
		fareLoading.clearRidingVal();
	},
	clearRidingVal: function(){
		$('select[name="riding"]').empty();
		$('#numRides').val('');
		$('#txtFare').val('');
		$('input[name="fare"][value="onboard_purchase"]').attr('disabled', false);
		$('input[name="fare"][value="advance_purchase"]').prop('checked', true);
		$('.error').css('display', 'none');	
	},
	fareClaculator: function(){
		$("#numRides").keyup(function(event) {
			var numval = $(this).val();//, anytimeArray = [10,20, 30, 40, 50];
			var x = $('select[name="riding"]').find(':selected').data('ride');
			$('.error').text('Enter between 1- 50');
			if (x == 2) {
				$(this).val(10);
				$('.error').text('Only 10 rides available');
			}
			if ((numval >0  && numval <= 50)){
				$('#txtFare').val($('#numRides').val() * price);	
				
				$('.error').css('display', 'none');
			} else{
				if ((x == 2) ) {
					$(this).val(10);
					//$('.error').text('Only 10 rides available');
					//alert('hh');
				} else {
					$(this).val(1);
					//$('.error').text('Enter between 1- 50');
				};
				$('#txtFare').val(price);
				$('.error').css('display', 'block');
				
			}
		});		
	},
	getRiding: function(rideinfo){
		var  y=[],  i = 0;
		fareLoading.clearRidingVal();
		$.each(rideinfo, function(key, ridevalue) {//get unique values of riding info
			if (($.inArray(ridevalue["type"], y)) == -1){
				y.push(ridevalue["type"]);
				$('select[name="riding"]').append($('<option></option>').html(ridevalue["type"]).attr('data-ride',i));
				i++;
			};		
		});
		fareLoading.setFareValues(rideinfo);
	},
	setFareValues: function(rideinfo){//set the value for fares
		var fares = [[]];
		$('#numRides').val('');
		$('#txtFare').val('');
		$.each(rideinfo, function(key, rideval) {
			var  j=0;
			if ($('select[name="riding"]').val() == rideval['type']){
				fares.push({
					type: rideval['type'],
					price: rideval['price'],
					purchase: rideval['purchase'],
					trips: rideval['trips']
				})
				j++;			
			}
		});
		fareLoading.getFare(fares);		
	},
	getFare: function(fareInfo){//get values based on the purchase type
		$.each(fareInfo, function(key, farevalue) {	
			if ( $('input[type="radio"]:checked').val() == farevalue['purchase'])
			{	$('#numRides').val(farevalue['trips']);
				$('#txtFare').val(farevalue['price']);
				price = farevalue['price'];
			};
		});
	},
	getValueFare: function(y){
		$('input[type="radio"]:checked').val('advance_purchase');
		if(y == 'anytime'){
			$('input[name="fare"][value="onboard_purchase"]').attr('disabled', true);
			//$('.anytime').css('display', 'block');
		} else{
			$('input[name="fare"][value="onboard_purchase"]').attr('disabled', false);
			//$('.anytime').css('display', 'none');
		};
		var x = $('select[name="zones"]').find(':selected').data('zone');
		fareLoading.setFareValues(zonesInfo[x].fares);
	},
	onClckFare: function(){// selection of fares
	 $('input[name="fare"]').off('click.fareClck').on('click.fareClck',function() {
			var x = $('select[name="zones"]').find(':selected').data('zone');
			fareLoading.setFareValues(zonesInfo[x].fares);	
		}).attr("tnt", "handled");
	},
	onClckZones: function(){// selection of zones
		$('select[name="zones"]').off('click.zonesClck').on('click.zonesClck',function() {
			var x = $(this).find(':selected').data('zone');
			fareLoading.getRiding(zonesInfo[x].fares);	
		}).attr("tnt", "handled");
	},
	onClckRiding: function(){// selection of riding info
		$('select[name="riding"]').off('click.ridingClck').on('click.ridingClck',function() {
			var y =$(this).val();
			$('input[name="fare"][value="advance_purchase"]').prop('checked', true);
			if(y == 'anytime'){
				$('input[name="fare"][value="onboard_purchase"]').attr('disabled', true);
				//$('.anytime').css('display', 'block');
			} else{
				$('input[name="fare"][value="onboard_purchase"]').attr('disabled', false);
				//$('.anytime').css('display', 'none');
			};
			var x = $('select[name="zones"]').find(':selected').data('zone');
			fareLoading.setFareValues(zonesInfo[x].fares);	
		}).attr("tnt", "handled");
	},
	selZones:function(val){
		switch ($('select[name="zones"]').find(':selected').data('zone')){
			case 0: 
				fareLoading.getRiding(val[0].fares);
				break;
			case 1: 
				fareLoading.getRiding(val[1].fares);
				break;
			case 2: 
				fareLoading.getRiding(val[2].fares);
				break;
			case 3: 
				fareLoading.getRiding(val[3].fares);
				break;
			case 4: 
				fareLoading.getRiding(val[4].fares);
				break;
			default:			
		};
	},
	getJSONval: function(){
		fareLoading.clearZoneVal();
		$.getJSON('fares.json', function (data) {
			zonesInfo = data.zones;
			$.each(data.zones, function(key, value) {
				$('select[name="zones"]').append(
					$('<option></option>').val(value['name']).html(value['name']).attr('data-zone',key)
				);
			});	
			fareLoading.selZones(zonesInfo);
		})
	}
}
$(document).ready(function(){
	fareLoading.init();
	fareLoading.getJSONval();
	fareLoading.numericOnly();
	fareLoading.onClckZones();
	fareLoading.onClckRiding();
	fareLoading.onClckFare();
	fareLoading.fareClaculator();
});
})(jQuery);	 