(function(){
	
	function Json(){}
	
	Json.getInst = function()
	{
		if(Json._inst === undefined)
		{
			Json._inst = new Json();
		}
		return Json._inst;
	};
	
	var p = Json.prototype;

	p.fixer= function(string){
		string = string.replace(/,+/g,",");
		string = string.replace(/\[,/g,"[");
		string = string.replace(/,]/g,"]");
		string = string.replace(/,}/g,"}");
		string = string.replace(/{,/g,"{");
		string = string.replace(/:,/g,':"",');
		string = string.replace(/":}/g, '":""}');
		return string;
	}
	
	p.memberCount= function(obj){
		var i = 0
		if(obj.constructor == Object){
			for(p in obj){
				i++;
			}
		}
		return i;
	}
	
	p.toHtml= function(obj){
		
		var text = ''
		
		if(obj.constructor == Array){
			arrayRecusive(obj);
		}else if(obj.constructor == Object){
			objectRecusive(obj);
		}else{
			return "not a JSON Object or Array";
		}
		
		function dec(v){
			if(v == null){
				text += v;
			}
			else if(v.constructor == Array){
					arrayRecusive(v)
			}
			else if(v.constructor == Number){
				text += v;
			}
			else if(v.constructor == String){
				text += '"'+v+'"';
			}
			else if(v.constructor == Boolean){
				text += v
			}
			else if(v.constructor == Object){
				objectRecusive(v)
			}
		}
		
		//scan object
		function objectRecusive(obj){
			
			text += '<div style="background-color:lightBlue"><span style="font-weight:bold; color:blue">{</span>';
			var i = 0
			var j = 0
			
			for(q in obj)i++
			
			if(i>0){
				text += '<div style="margin-left:20px; border-left:1px dotted blue">';
				for(q in obj){
					j++
					text += '"<span style="font-weight:bold;">'+q+'</span>": '
					
					dec(obj[q]);
					
					if(j<i){
						text += '<span style="font-weight:bold; color:blue">,</span><br/>'
					}
				}
				text += '</div>'
			}
			text += '<span style="font-weight:bold; color:blue">}</span></div>'
		}
		
		//scan array
		function arrayRecusive(ary){
			text += '<div style="background-color:pink"><span style="font-weight:bold; color:red">[</span>'
			if(ary.length > 0){
				text += '<div style="margin-left:20px; border-left:1px dotted red">';
				for(var i=0; i<ary.length; i++){
					dec(ary[i]);
					if(i<(ary.length-1)){
						text += '<span style="font-weight:bold; color:red">,</span><br/>'
					}
				}
				text += '</div>';
			}
			text += '<span style="font-weight:bold; color:red">]</span></div>'
		}
		
		return text
	}
	
	//UNDER DEVELOPEMENT
	p.find= function(obj,val,para){
		var ary = [];
		
		var opts = {
			operation: '=', //('=','<','<=','>','>=','[]', '{}')
			returnParent: false,
			returnIndex: true,
			returnValue: true,
			returnLevel: true,
			scanMemberNames: true,
			scanMemberValues: true,
			scanArrayValues: true,
			scanLevels: 'full' //(full|int)
		}
		
		Object.extend(opts,para);
		
		if(opts.operation == '='){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t == val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t == val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '<'){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t < val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t < val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '<='){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t <= val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t <= val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '>'){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t > val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t > val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '>='){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t >= val[i]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t >= val){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '[]'){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t >= val[i][0] && t <= val[i][1]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t >= val[0] && t <= val[1]){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		else if(opts.operation == '{}'){
			opts.operation = function(o,v,t,level){
				if(val.constructor == Array){
					for(var i=0; i<val.length; i++){
						if(t > val[i][0] && t < val[i][1]){
							ary.push( getReturnParams(o,v,level) );
						}
					}		
				}
				
				if(t > val[0] && t < val[1]){
					ary.push( getReturnParams(o,v,level) );
				}
			}
		}
		
		if(obj.constructor == Array){
			arrayRecusive(obj,-1);
		}else if(obj.constructor == Object){
			objectRecusive(obj,-1);
		}else{
			return false;
		}
		
		function dec(o,v,level){
			
			level++;
			
			if(opts.scanLevels == 'full' || level<=opts.scanLevels){
				if(v == null){
					
				}
				else if(opts.scanMemberNames && o.constructor == Object){
					opts.operation(o,v,v,level);
				}
				
				if(o[v].constructor == Array){
					arrayRecusive(o[v],level);
				}
				else if(o[v].constructor == Number){
					toCompare(o,v,level);
				}
				else if(o[v].constructor == String){
					toCompare(o,v,level);
				}
				else if(o[v].constructor == Boolean){
					toCompare(o,v,level);
				}
				else if(o[v].constructor == Object){
					objectRecusive(o[v],level);
				}
				
			}
		}
		
		//scan object
		function objectRecusive(obj,level){
			for(q in obj){
				dec(obj,q,level);
			}
			
		}
		
		//scan array
		function arrayRecusive(ary,level){
			if(ary.length > 0){
				for(var i=0; i<ary.length; i++){
					dec(ary,i,level);
				}
			}
			
		}
		
		function getReturnParams(o,v,level){
			var ret = {}
			if(opts.returnParent){
				ret.obj = o;
			}
			if(opts.returnIndex){
				ret.ind = v;
			}
			if(opts.returnValue){
				ret.val = o[v];
			}
			if(opts.returnLevel){
				ret.lev = level;
			}
			return ret;
		}
		
		function toCompare(o,v,level){
			if( (opts.scanMemberValues && o.constructor == Object) || (opts.scanArrayValues && o.constructor == Array) ){
				opts.operation(o,v,o[v],level);
			}
		}
		
		if(ary.length > 0){
			return ary;
		}else{
			return false;
		}
	}
	
	
	p.jPath = function(obj, expr, arg) {
	   var P = {
	        resultType: arg && arg.resultType || "VALUE",
	        result: [],
	        normalize: function(expr) {
	           var subx = [];
	           return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
	                      .replace(/'?\.'?|\['?/g, ";")
	                      .replace(/;;;|;;/g, ";..;")
	                      .replace(/;$|'?\]|'$/g, "")
	                      .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
	        },
	        asPath: function(path) {
	                var x = path.split(";"), p = "$";
	                for (var i=1,n=x.length; i<n; i++)
	                   p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
	                return p;
	        },
	        store: function(p, v) {
	           if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
	           return !!p;
	        },
	        trace: function(expr, val, path) {
	         if (expr) {
	            var x = expr.split(";"), loc = x.shift();
	            x = x.join(";");
	            if (val && val.hasOwnProperty(loc))
	               P.trace(x, val[loc], path + ";" + loc);
	            else if (loc === "*")
	               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
	            else if (loc === "..") {
	               P.trace(x, val, path);
	               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
	            }
	            else if (/,/.test(loc)) { // [name1,name2,...]
	               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
	                  P.trace(s[i]+";"+x, val, path);
	            }
	            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
	               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
	            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
	               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
	            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
	               P.slice(loc, x, val, path);
	         }
	         else
	            P.store(path, val);
	        },
	        walk: function(loc, expr, val, path, f) {
	         if (val instanceof Array) {
	            for (var i=0,n=val.length; i<n; i++)
	               if (i in val)
	                  f(i,loc,expr,val,path);
	         }
	         else if (typeof val === "object") {
	            for (var m in val)
	               if (val.hasOwnProperty(m))
	                  f(m,loc,expr,val,path);
	         }
	        },
	        slice: function(loc, expr, val, path) {
	         if (val instanceof Array) {
	            var len=val.length, start=0, end=len, step=1;
	            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
	            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
	            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
	            for (var i=start; i<end; i+=step)
	               P.trace(i+";"+expr, val, path);
	         }
	        },
	        eval: function(x, _v, _vname) {
	         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
	         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
	        }
	   };

	   var $ = obj;
	   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
	      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
	      return P.result.length ? P.result : false;
	   }
	}

	var namespace = new Namespace ( 'org.incrediberry.utils' );

	namespace.Json = Json.getInst();
	
})();

