/* 
	"Active Record" for JavaScript 
	Author: Aykut Kardaş 
	Github: github.com/aykutkardas 
*/ 

// original from https://github.com/aykutkardas/Active-Record 
// viral https://plus.google.com/+AykutKarda%C5%9FZ/posts/f1vUgFVW4WX 

/* eslint-disable no-whitespace-before-property */ 

var ActiveRecord = ActiveRecord || {}; 

ActiveRecord .result = { 
	  data : [] 
	, rawData : [] 
	, query : {} 
	, list : [] 
	}; 

[ 
	  [ 'orderBy', ( prop, order = "ASC" ) => ( { prop, order } ) ] 
	, [ 'where', where => where ] 
	, [ 'limit', ( limit, start = 0 ) => ( { limit, start } ) ] 
	, [ 'select', ( ... ar ) => ar ] 
	] 
.forEach( ( [ p, F ] ) => 
	ActiveRecord[ p ] = function( ... ar ) { 
		this .result .query[ p ] = F .apply( this, ar ); 
		return this; 
		} 
	); 

ActiveRecord .result ._orderBy = function ( prop, order ) { 
	
	this .data .sort( ( a, b ) => { 
		let 
			  [ ap, bp ] = [ a, b ] .map( o => o[ prop ] ) 
			, ascOrder = ap > bp ? 1 : bp > ap ? -1 : 0 
			, eqOrder = ap === bp ? 0 : ap === undefined ? 1 : -1 
			; 
		return ( 
			[ { ASC : ascOrder, DESC : - ascOrder }[ order ] ] 
			.map( v => v !== undefined ? v || eqOrder : undefined ) 
			.find( v => v !== undefined ) 
			); 
		} ); // -- this .data .sort() 
	
	}; // -- .orderBy 

ActiveRecord .result ._where = function () { 
	var 
		  where   = this .query .where
		, data    = [] .concat( this .data ) 
		, temp    = [] 
		, ortemp  = [] 
		, step    = 0 
		; 
	
	where = where .length && typeof where === "object" ? where : [ where ]; 
	
	for ( var i = 0; i < where .length; i++ ) { 
		Object .keys( where[ i ] ) .forEach( key => {
			if ( step > 0 ) { 
				data = [] .concat( temp ); 
				temp = []; 
				} 
			data .forEach( ( v, j ) => { 
				if ( v[ key ] === where[ i ][ key ] && temp .indexOf( v ) === -1 ) { 
					temp .push( v ); 
					this .list .push( j ); 
					} 
				} ); 
			step++; 
			} ); 
		
		temp .forEach( v => ortemp .indexOf( v ) === -1 && ortemp .push( v ) ); 
		data = [] .concat( this .data ); 
		temp = []; 
		step = 0; 
		
		} 
	
	this .data = ortemp; 
	
	}; // -- ._where 

ActiveRecord .result ._limit = function ( limit, start = 0 ) { 
	this .data = this .data .slice( start, limit ); 
	}; // -- .limit 

ActiveRecord .result ._select = function ( select ) { 
	var 
		  columns = select 
		, temp = [] 
		, key 
		; 
	for ( var i = 0; i < this .data .length; i++ ) { 
		var 
			  tempObj = {} 
			, step = 0 
			; 
		for ( var j = 0; j < columns .length; j++ ) { 
			for ( key in this .data[ i ] ) { 
				if ( key == columns[ j ] ) { 
					tempObj[ key ] = this .data[ i ][ key ]; 
					step++; 
					} 
				} 
			} // -- for( j ) 
		step > 0 && temp .push( tempObj ); 
		} // -- for ( i ) 
	this .data = temp; 
	
	}; // -- ._select 

ActiveRecord .get = function ( data ) { 
	if ( ! ( "object" === typeof data && data .length ) ) { 
		throw `The data is not an object: .get(${ JSON .stringify( data ) })`; 
		} 
	
	this .result .data = data; 
	var Query = this .result .query; 
	[ 
		  [ 'orderBy', ( tr, o ) => tr ._orderBy( o .prop, o .order ) ] 
		, [ 'where', ( tr, o ) => tr ._where( o ) ] 
		, [ 'select', ( tr, o ) => tr ._select( o ) ] 
		, [ 'limit', ( tr, o ) => tr ._limit( o .limit, o .start ) ] 
		] 
	.forEach( ( [ p, F ] ) => Query[ p ] && F( this .result, Query[ p ] ) ) 
		; 
	
	return this .result .data; 
	}; // -- .get 
