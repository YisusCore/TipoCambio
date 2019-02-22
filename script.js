var TipoCambio, Promise;

/**
 * Examples:
 * var DOLARES = TipoCambio(10, 'PEN', 'USD'); //10PEN => USD
 */
;(function(api){
	'use strict';
	var module, define;
	
	if (typeof module === 'object' && typeof module.exports === 'object')
	{
		module.exports = api('jQuery');
	}
	else if (typeof define === 'function' && define.amd)
	{
		define(['jQuery'], api);
	}
	else
	{
		api(jQuery);
	}
}(function($){
	'use strict';
	
	TipoCambio = function(){
		var today = (function(){
			var date = new Date();
			
			var y = date.getFullYear(),
				m = date.getMonth() +1,
				d = date.getDate()
			;
			
			if (m < 10)
			{
				m = '0' + m;
			}
			
			if (d < 10)
			{
				d = '0' + d;
			}
			
			return y + '-' + m + '-' + d;
		}());
		
		var cookie = typeof $.cookie !== 'undefined';

		var currencies = {/*CURRENCIES*/};
		
		if (typeof currencies.PEN === 'undefined')
		{
			$.getJSON('https://api.jys.pe/tipo-cambio/' + today + '/currencies.basic.json')
			.done(function(result){
				$.each(result, function(ind, currencie){
					if (typeof currencies[currencie.code] === 'undefined')
					{
						currencies[currencie.code] = currencie;
					}
					
					currencies[currencie.code].rates[today] = currencie.rates[today];
					currencies[currencie.code].rates.today = currencie.rates[today];
				});
			});
		}
		
		var isDay = function ISDAY (val)
		{
			return /^\d{4}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/gi.test(val);
		};
		
		var isCode = function ISCODE (val)
		{
			return isNaN(parseFloat(val)) && typeof val === 'string' && val.length === 3;
		};

		var isValidCode = function ISVALIDCODE (val)
		{
			return isCode(val) && typeof currencies[val] !== 'undefined';
		};

		/**
		 * TipoCambio()
		 * @param double val|from|day
		 * @param string from|to|day	is to if (arguments.length === 2 && arguments[0] is val)
		 * @param string to|day	is to if (arguments.length === 2 && arguments[0] is val)
		 */
		var TipoCambio = function TipoCambio (val, from, to, day)
		{
			var $this = typeof this === 'undefined' ? TipoCambio : this;

			var l = arguments.length;
			
			if (l === 0)
			{
				return $this;
			}
			
			if (l === 1)
			{
				/**
				 * TipoCambio('2019-02-21');	//Cambia la fecha de conversion
				 * TipoCambio('USD');			//Cambia la moneda de resultado
				 */
				if (isDay(val))
				{
					$this.CambiarDay(val);
				}
				else if (isValidCode(val))
				{
					$this.CambiarMoneda(val);
				}
				else
				{
					throw 'Val needs to be a valid day or a valid money code';
				}
				
				return $this;
			}
			
			if (l === 2)
			{
				/**
				 * TipoCambio('USD', '2019-02-21');	//Cambia la moneda de resultado y la fecha de conversion
				 * TipoCambio('2019-02-21', 'USD');	//Cambia la moneda de resultado y la fecha de conversion
				 * TipoCambio(10, 'USD');			//Retorna la conversión de la moneda enviada
				 */
				
				if (isDay(val))
				{
					$this.CambiarDay(val);
				}
				else if (isValidCode(val))
				{
					$this.CambiarMoneda(val);
				}
				else
				{
					if (isValidCode(from))
					{
						return $this.Convert(val, from);
					}
					else
					{
						throw from + ' needs to be a valid money code';
					}
					
					return $this;
				}
				
				if (isDay(from))
				{
					$this.CambiarDay(from);
				}
				else if (isValidCode(from))
				{
					$this.CambiarMoneda(from);
				}
				else
				{
					throw from + ' needs to be a valid Day or valid money code';
				}
				
				return $this;
			}
			
			if (l === 3)
			{
				/**
				 * TipoCambio(10, 'USD', '2019-02-21');	//Retorna la conversión de la moneda enviada basado en la fecha enviada (no cambia la moneda ni la fecha)
				 * TipoCambio('2019-02-21', 10, 'USD');	//Cambia la fecha de conversion y retorna la conversión de la moneda enviada
				 * TipoCambio(10, 'USD', 'PEN');		//Retorna la conversión de la moneda enviada a la segunda moneda enviada (no cambia la moneda)
				 */
				
				if (isDay(val))
				{
					$this.CambiarDay(val);
				}
				else if (isValidCode(val))
				{
					return $this;
				}
				else
				{
					if ( ! isValidCode(from))
					{
						throw 'From needs to be a valid money code';
					}
					
					if ( ! isDay(to) && ! isValidCode(to))
					{
						throw 'To needs to be a valid money code or a date';
					}
					
					let Xday =  isDay(to) ? to : $this.day;
					let Xto  =  isValidCode(to) ? to : $this.moneda;
					
					
					return $this.Convert(val, from, Xto, Xday);
				}
				
				if (isDay(to) || isValidCode(to))
				{
					throw 'To needs to be a double value';
				}
				
				return $this.Convert(from, to);
			}
			
			if (l >= 4)
			{
				/**
				 * TipoCambio(10, 'USD', 'PEN', '2019-02-21');	//Retorna la conversión de la moneda enviada a la segunda moneda enviada  basado en la fecha enviada (no cambia la moneda ni la fecha)
				 */
				
				return $this.Convert(val, from, to, day);
			}
			
			
		};

		if (typeof document.moneda === 'undefined')
		{
			document.__defineGetter__('moneda', function(){
				return cookie ? $.cookie('moneda') : 'PEN';
			});
		}
		
		var checkNodes = function checkNodes(){
			var $this = typeof this === 'undefined' ? TipoCambio : this;
			$.each($this.nodes, function(x, inp){
				$(inp).TipoCambio();
			});
		};
		
		var Convert = TipoCambio.Convert = function Convert (val, from, to, day, decimals, returnString, millions){
			if (typeof returnString === 'undefined')
			{
				returnString = false;
			}
			
			if (typeof from === 'undefined')
			{
				from = this.moneda;
			}
			
			if (typeof to === 'undefined')
			{
				to = this.moneda;
			}
			
			if (typeof day === 'undefined')
			{
				day = this.day;
			}
			
			if (typeof decimals === 'undefined')
			{
				decimals = returnString ? 2 : 4;
			}
			
			if (returnString && typeof millions === 'undefined')
			{
				millions = ',';
			}
			
			if (typeof currencies[from] === 'undefined')
			{
				throw from + ' is not valid code money';
			}
			
			if (typeof currencies[to] === 'undefined')
			{
				throw to + ' is not valid code money';
			}
			
			if (typeof currencies[from].rates[day] === 'undefined' || typeof currencies[to].rates[day] === 'undefined')
			{
				throw 'data of ' + day + ' was not loaded';
			}
			
			var rate_from = currencies[from].rates[day],
				rate_to = currencies[to].rates[day];
			
			var k = rate_to / rate_from;
			
			val = val * k;
			
			val = parseFloat(val.toString().replace(/\.(\d)?0{4,}(.*)$/,'\.$1'));
			
			var decimals_ = Math.pow(10, decimals);
			val = Math.round(val * decimals_) / decimals_;
			
			if (returnString)
			{
				val = (val.toString() + '.').split('.', 3);
				
				let ent = val[0];
				let dec = val[1];
				
				var i;
				for(i = dec.length; i < decimals; i++)
				{
					dec += '0';
				}

				if (millions !== '')
				{
					let ent_ = [];
					ent = ent.toString();

					let ent_l = ent.length,
						part,
						ent_lk;

					do
					{
						ent_lk = ent_l - 3;
						
						if (ent_lk < 0)
						{
							ent_lk = 0;
						}
						
						part = ent.substr(ent_lk, 3);
						ent_.push(part);

						ent = ent.substr(0, ent_lk);
						ent_l = ent.length;
					}
					while(ent_l > 0);
					
					ent_.reverse();

					ent = ent_.join(millions);
				}
				
				val = currencies[to].sign_pre + ent + '.' + dec;
			}
			else
			{
				val = parseFloat(val);
			}
			
			return val;
		};
		
		var ConvertString = TipoCambio.ConvertString = function Convert (val, from, to, day, decimals, millions){
			var $this = typeof this === 'undefined' ? TipoCambio : this;
			return $this.Convert(val, from, to, day, decimals, true, millions);
		};
		
		TipoCambio.nodes = [];
		TipoCambio.checkNodes = checkNodes;
		TipoCambio.currencies = currencies;
		
		TipoCambio.CambiarDay = function CambiarDayDocument (day) {
			TipoCambio.__defineGetter__('day', function(){return day;});
			
			TipoCambio.loadDay(day).then(function(){
				TipoCambio.checkNodes();
			});
				
//			checkNodes();
			return this;
		};
		
		TipoCambio.CambiarMoneda = function CambiarMonedaDocument (moneda) {
//			document.moneda = moneda;
//			this.moneda = moneda;
			
			document.__defineGetter__('moneda', function(){return moneda;});
			TipoCambio.__defineGetter__('moneda', function(){return moneda;});

			if (cookie)
			{
				$.cookie('moneda', moneda);
			}

			checkNodes();
			return this;
		};
		
		var DaysPromises = {};
		
		TipoCambio.loadDay = function TC_LoadDay(day, done)
		{
			if (typeof DaysPromises[day] === 'undefined')
			{
				DaysPromises[day] = new Promise(function(resolve){
					$.getJSON('https://api.jys.pe/tipo-cambio/' + day + '/rates.json')
					.done(function(rates){
						$.each(rates, function(code, rate){
							if (typeof currencies[code] === 'undefined')
							{
								return;
							}

							currencies[code].rates[day] = rate;
						});

						resolve();
					});
				});
			}
			
			if (typeof done !== 'undefined')
			{
				DaysPromises[day].then(done);
			}
			
			return DaysPromises[day];
		};

		TipoCambio.prototype = {
			CambiarMoneda:function CambiarMoneda (moneda) {
				this.__defineGetter__('moneda', function(){return moneda;});
				this.__defineSetter__('moneda', function(moneda){
					this.CambiarMoneda(moneda);
				});
				
				this.checkNodes();
				return this;
			},
			CambiarDay:function CambiarDay (day) {
				this.__defineGetter__('day', function(){return day;});
				this.__defineSetter__('day', function(day){
					this.CambiarDay(day);
				});

				var that = this;
				TipoCambio.loadDay(day).then(function(){
					that.checkNodes();
				});
				
				return this;
			},
			checkNodes:checkNodes,
			Convert:Convert,
			ConvertString:ConvertString,
			nodes:[],
			get day(){return today;},
			get moneda(){return document.moneda;},
			set day(val){
				this.CambiarDay(val);
			},
			set moneda(moneda){
				this.CambiarMoneda(moneda);
			},
		};
		
		TipoCambio.__defineGetter__('day', function(){return today;});
		TipoCambio.__defineGetter__('moneda', function(){return document.moneda;});
		
		document.__defineSetter__('moneda', function(moneda){
			TipoCambio.CambiarMoneda(moneda);
		});
		
		TipoCambio.__defineSetter__('moneda', function(moneda){
			TipoCambio.CambiarMoneda(moneda);
		});
		
		TipoCambio.__defineSetter__('day', function(val){
			TipoCambio.CambiarDay(val);
		});
		

		$.TipoCambio = TipoCambio;
		$.fn.TipoCambio = function(val, from, TC)
		{
			var $val, $from, $TC;

			if (TC instanceof TipoCambio)
			{
				$TC = TC;
			}
			else if (isValidCode(TC))
			{
				$from = TC;
			}
			else
			{
				$val = TC;
			}
			
			if (from instanceof TipoCambio)
			{
				$TC = from;
			}
			else if (isValidCode(from))
			{
				$from = from;
			}
			else
			{
				$val = from;
			}
			
			if (val instanceof TipoCambio)
			{
				$TC = val;
			}
			else if (isValidCode(val))
			{
				$from = val;
			}
			else
			{
				$val = val;
			}

			this.each(function(){
				var i$val  = $val    || $(this).data('val')    || $(this).data('valor')     || $(this).data('amount')    || $(this).data('monto')  || $(this).data('TC.val')    || $(this).val();
				var i$from = $from || $(this).data('moneda') || $(this).data('currencie') || $(this).data('from') || $(this).data('TC.moneda');
				var i$dec  = $(this).data('dec') || $(this).data('decimals') || $(this).data('decimales') || $(this).data('TC.decimales');
				var i$mil  = $(this).data('mil') || $(this).data('million') || $(this).data('millions') || $(this).data('TC.millions');
				
				var i$TC;
				
				if (typeof $(this).data('TC') === 'undefined')
				{
					i$TC = $TC || TipoCambio;
					
					$(this).data('TC', i$TC);
					i$TC.nodes.push(this);
				}
				
				i$TC = $(this).data('TC');
				
				$(this).data('TC.val', i$val);
				$(this).data('TC.moneda', i$from);
				$(this).data('TC.decimales', i$dec);
				$(this).data('TC.millions', i$mil);
				
				var V = i$TC.Convert      (i$val, i$from, undefined, undefined, i$dec),
					H = i$TC.ConvertString(i$val, i$from, undefined, undefined, i$dec, i$mil);

				$(this)
				.val(V)
				.html(H)
				;
			});
		};
		
		$(document).ready(function(){
			TipoCambio.loadDay(today).then(function(){
				$('[data-toogle="TipoCambio"]').TipoCambio();
			});
		});
		return TipoCambio;
	}();
}));
